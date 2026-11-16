"use client";
import { Site } from "@/lib/model";
import { Field, useEditor, EditorActions } from "./editor-tools";

const groups: { title: string; fields: [keyof Site, string, boolean?][] }[] = [
  {
    title: "Business details",
    fields: [
      ["name", "Business name"],
      ["phone", "Phone"],
      ["whatsapp", "WhatsApp number (international digits, no +)"],
      ["email", "Email"],
      ["address", "Office address", true],
      ["registration", "Registration number"],
      ["hours", "Opening hours (leave blank if unknown)"],
      ["logo", "Logo URL (blank uses approved Kimziz logo)"],
    ],
  },
  {
    title: "Homepage",
    fields: [
      ["headline", "Main headline", true],
      ["intro", "Introduction", true],
      ["heroImage", "Hero image URL"],
      ["heroAlt", "Hero image description"],
      ["heroVideo", "Optional video URL"],
    ],
  },
  {
    title: "About",
    fields: [
      ["aboutTitle", "About heading", true],
      ["about", "About text", true],
      ["history", "Business history (optional)", true],
      ["leadership", "Leadership (optional)", true],
    ],
  },
  {
    title: "Page headings",
    fields: [
      ["servicesTitle", "Services heading", true],
      ["carsTitle", "Cars heading"],
      ["carsIntro", "Cars introduction", true],
      ["contactTitle", "Contact heading", true],
      ["contactIntro", "Contact introduction", true],
    ],
  },
  {
    title: "Calls to action and footer",
    fields: [
      ["ctaLabel", "WhatsApp button label"],
      ["ctaTitle", "Closing heading", true],
      ["ctaText", "Closing description", true],
      ["footer", "Footer description", true],
    ],
  },
  {
    title: "Search and sharing",
    fields: [
      ["seoTitle", "Site title"],
      ["seoDescription", "Search description", true],
      ["socialImage", "Social-sharing image URL"],
    ],
  },
];

export function ContentEditor({
  initial,
  revision,
}: Readonly<{
  initial: Site;
  revision: number;
}>) {
  const editor = useEditor(initial, revision, "site", "site"),
    { value, setValue } = editor;

  function set(key: keyof Site, next: unknown) {
    setValue((v) => ({ ...v, [key]: next }));
  }

  return (
    <div className="max-w-250">
      <p className="p-4 sm:p-5 border border-[#b99756] bg-soft rounded-md mb-6 text-sm text-ink">
        Use the media library to upload assets, then paste their URLs here.
        Unknown business facts should stay blank.
      </p>

      {groups.map((group) => (
        <fieldset
          key={group.title}
          disabled={editor.busy}
          className="border border-line p-5 sm:p-6 rounded-lg bg-surface mb-6"
        >
          <legend className="text-sm font-semibold px-2 text-ink">
            {group.title}
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {group.fields.map(([key, label, area]) => (
              <Field
                key={key}
                label={label}
                area={area}
                wide={area}
                value={String(value[key])}
                onChange={(next) => set(key, next)}
              />
            ))}
          </div>
        </fieldset>
      ))}

      <fieldset
        disabled={editor.busy}
        className="border border-line p-5 sm:p-6 rounded-lg bg-surface mb-6"
      >
        <legend className="text-sm font-semibold px-2 text-ink">
          Navigation labels
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {Object.entries(value.nav).map(([key, label]) => (
            <Field
              key={key}
              label={key}
              value={label}
              onChange={(next) => set("nav", { ...value.nav, [key]: next })}
            />
          ))}
        </div>
      </fieldset>

      <fieldset
        disabled={editor.busy}
        className="border border-line p-5 sm:p-6 rounded-lg bg-surface mb-6"
      >
        <legend className="text-sm font-semibold px-2 text-ink">
          Services
        </legend>
        {value.services.map((service, i) => (
          <div
            key={i}
            className="border-b border-line py-5 first:pt-0 last:border-0"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <Field
                label="Service title"
                value={service.title}
                onChange={(next) =>
                  set(
                    "services",
                    value.services.map((s, j) =>
                      i === j ? { ...s, title: next } : s,
                    ),
                  )
                }
              />
              <label className="flex items-center gap-2.5 text-sm text-ink font-medium cursor-pointer pt-6">
                <input
                  type="checkbox"
                  checked={service.visible}
                  className="w-4 h-4 accent-gold cursor-pointer"
                  onChange={(e) =>
                    set(
                      "services",
                      value.services.map((s, j) =>
                        i === j ? { ...s, visible: e.target.checked } : s,
                      ),
                    )
                  }
                />
                Visible on website
              </label>
              <Field
                label="Description"
                area
                wide
                value={service.description}
                onChange={(next) =>
                  set(
                    "services",
                    value.services.map((s, j) =>
                      i === j ? { ...s, description: next } : s,
                    ),
                  )
                }
              />
            </div>
            <div className="flex items-center gap-2.5 mt-3 flex-wrap">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 min-h-9.5 px-3.5 py-1.5 bg-transparent text-ink border border-line rounded-[3px] text-xs font-semibold hover:bg-soft transition-colors cursor-pointer disabled:opacity-55"
                disabled={i === 0}
                onClick={() => {
                  const list = [...value.services];
                  [list[i - 1], list[i]] = [list[i], list[i - 1]];
                  set("services", list);
                }}
              >
                Move up
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 min-h-9.5 px-3.5 py-1.5 bg-transparent text-ink border border-line rounded-[3px] text-xs font-semibold hover:bg-soft transition-colors cursor-pointer"
                onClick={async () => {
                  const ok = await editor.confirm({
                    title: "Remove service?",
                    description: `Are you sure you want to remove "${service.title || "this service"}" from the draft?`,
                    confirmLabel: "Remove",
                    variant: "danger",
                  });
                  if (ok) {
                    set(
                      "services",
                      value.services.filter((_, j) => i !== j),
                    );
                  }
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="mt-4 inline-flex items-center justify-center gap-2 min-h-9.5 px-3.5 py-1.5 bg-transparent text-ink border border-line rounded-[3px] text-xs font-semibold hover:bg-soft transition-colors cursor-pointer"
          onClick={() =>
            set("services", [
              ...value.services,
              { title: "New service", description: "", visible: false },
            ])
          }
        >
          Add service
        </button>
      </fieldset>

      <fieldset
        disabled={editor.busy}
        className="border border-line p-5 sm:p-6 rounded-lg bg-surface mb-6"
      >
        <legend className="text-sm font-semibold px-2 text-ink">
          Social links
        </legend>
        {value.social.map((social, i) => (
          <div
            className="border-b border-line py-5 first:pt-0 last:border-0"
            key={i}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <Field
                label="Label"
                value={social.label}
                onChange={(next) =>
                  set(
                    "social",
                    value.social.map((s, j) =>
                      i === j ? { ...s, label: next } : s,
                    ),
                  )
                }
              />
              <Field
                label="HTTPS URL"
                value={social.url}
                onChange={(next) =>
                  set(
                    "social",
                    value.social.map((s, j) =>
                      i === j ? { ...s, url: next } : s,
                    ),
                  )
                }
              />
            </div>
            <button
              type="button"
              className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-ink hover:text-gold transition-colors py-1 cursor-pointer"
              onClick={() =>
                set(
                  "social",
                  value.social.filter((_, j) => i !== j),
                )
              }
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="mt-4 inline-flex items-center justify-center gap-2 min-h-9.5 px-3.5 py-1.5 bg-transparent text-ink border border-line rounded-[3px] text-xs font-semibold hover:bg-soft transition-colors cursor-pointer"
          onClick={() =>
            set("social", [...value.social, { label: "", url: "" }])
          }
        >
          Add social link
        </button>
      </fieldset>

      <EditorActions editor={editor} id="site" />
    </div>
  );
}
