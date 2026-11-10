import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { defaultSite } from "../src/lib/defaults";
import {
  siteSchema,
  vehicleSchema,
  emptyVehicle,
  priceLabel,
  whatsappUrl,
  safeUrl,
} from "../src/lib/model";

test("starter content validates and dangerous links are rejected", () => {
  assert.equal(siteSchema.safeParse(defaultSite).success, true);
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,test",
    "//evil.example",
    "/\\evil.example",
    "http://insecure.example",
  ])
    assert.equal(safeUrl.safeParse(url).success, false, url);
  assert.equal(
    safeUrl.safeParse(
      "https://res.cloudinary.com/example/image/upload/test.jpg",
    ).success,
    true,
  );
  assert.equal(
    vehicleSchema.safeParse(emptyVehicle).success,
    false,
    "Incomplete vehicles cannot be published",
  );
  assert.equal(
    vehicleSchema.safeParse({
      ...emptyVehicle,
      title: "Test",
      make: "Test",
      model: "Test",
      price: -1,
    }).success,
    false,
  );
  assert.equal(priceLabel(emptyVehicle), "Price on request");
  const link = new URL(
    whatsappUrl("2347014615680", "Car & model? Reference: ABC"),
  );
  assert.equal(link.searchParams.get("text"), "Car & model? Reference: ABC");
});

test("Postgres enforces private drafts, admin membership, atomic publishing and revision conflicts", async (t) => {
  const db = new PGlite();
  const admin = "11111111-1111-4111-8111-111111111111",
    outsider = "22222222-2222-4222-8222-222222222222";
  await db.exec(
    `create role anon; create role authenticated; create schema auth; create table auth.users(id uuid primary key); create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$; grant usage on schema auth to anon,authenticated; grant execute on function auth.uid() to anon,authenticated; insert into auth.users values ('${admin}'),('${outsider}');`,
  );
  await db.exec(
    await readFile(
      new URL("../supabase/schemas/001_content.sql", import.meta.url),
      "utf8",
    ),
  );
  await db.exec(`insert into public.admins(user_id) values ('${admin}');`);
  async function asUser(id: string) {
    await db.exec(
      `reset role; set role authenticated; set request.jwt.claim.sub='${id}';`,
    );
  }
  const save = async (
    revision: number,
    action: string,
    data: unknown = { title: "Private car" },
  ) =>
    db.query(
      "select public.save_document('vehicle-test','vehicle',$1::jsonb,$2,$3) as revision",
      [JSON.stringify(data), revision, action],
    );
  await t.test(
    "ordinary authenticated users cannot self-promote, write, or publish",
    async () => {
      await asUser(outsider);
      await assert.rejects(
        db.exec(`insert into public.admins(user_id) values ('${outsider}')`),
      );
      await assert.rejects(save(0, "publish"));
      await assert.rejects(
        db.exec(
          "insert into public.documents(id,kind,draft) values('bad','vehicle','{}')",
        ),
      );
    },
  );
  await t.test("admin can save draft without publishing", async () => {
    await asUser(admin);
    await save(0, "save");
    assert.equal(
      (await db.query("select * from public.documents")).rows.length,
      1,
    );
    assert.equal(
      (await db.query("select * from public.publications")).rows.length,
      0,
    );
  });
  await t.test("anonymous visitors cannot read private drafts", async () => {
    await db.exec("reset role;set role anon;set request.jwt.claim.sub='';");
    await assert.rejects(db.query("select * from public.documents"));
    assert.equal(
      (await db.query("select * from public.publications")).rows.length,
      0,
    );
  });
  await t.test(
    "publishing creates a public snapshot, later draft changes remain private",
    async () => {
      await asUser(admin);
      await save(1, "publish", { title: "Public car" });
      await save(2, "save", { title: "Unpublished edit" });
      await db.exec("reset role;set role anon;set request.jwt.claim.sub='';");
      const result = await db.query<{ data: { title: string } }>(
        "select data from public.publications",
      );
      assert.equal(result.rows[0].data.title, "Public car");
    },
  );
  await t.test(
    "non-admin users cannot see other drafts or modify public content",
    async () => {
      await asUser(outsider);
      assert.equal(
        (await db.query("select * from public.documents")).rows.length,
        0,
      );
      assert.equal(
        (await db.query("select * from public.admins")).rows.length,
        0,
      );
      await db.exec(
        'update public.publications set data=\'{"title":"tampered"}\'',
      );
      const result = await db.query<{ data: { title: string } }>(
        "select data from public.publications",
      );
      assert.equal(result.rows[0].data.title, "Public car");
    },
  );
  await t.test(
    "stale saves fail without changing published content",
    async () => {
      await asUser(admin);
      await assert.rejects(
        save(1, "publish", { title: "Stale" }),
        /newer version/,
      );
      const result = await db.query<{ data: { title: string } }>(
        "select data from public.publications",
      );
      assert.equal(result.rows[0].data.title, "Public car");
    },
  );
  await t.test(
    "archive removes publication and preserves the draft",
    async () => {
      await asUser(admin);
      await save(3, "unpublish");
      assert.equal(
        (await db.query("select * from public.publications")).rows.length,
        0,
      );
      assert.equal(
        (await db.query("select * from public.documents")).rows.length,
        1,
      );
    },
  );
  await t.test(
    "revoking admin membership immediately blocks writes",
    async () => {
      await db.exec(
        `reset role;delete from public.admins where user_id='${admin}';`,
      );
      await asUser(admin);
      await assert.rejects(save(4, "publish"));
    },
  );
  await db.close();
});

import { sameOrigin } from "../src/lib/request-security";
test("upload origin checks use the external host and reject cross-site requests", () => {
  assert.equal(sameOrigin("http://127.0.0.1:3000", "127.0.0.1:3000"), true);
  assert.equal(sameOrigin("https://kimziz.example", "kimziz.example"), true);
  assert.equal(sameOrigin("https://attacker.example", "kimziz.example"), false);
  assert.equal(
    sameOrigin("https://kimziz.example.attacker.example", "kimziz.example"),
    false,
  );
  assert.equal(sameOrigin(null, "kimziz.example"), false);
  assert.equal(sameOrigin("null", "kimziz.example"), false);
  assert.equal(
    sameOrigin("https://kimziz.example/path", "kimziz.example"),
    false,
  );
});
