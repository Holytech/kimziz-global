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
}: {
  initial: Site;
  revision: number;
}) {
  const editor = useEditor(initial, revision, "site", "site"),
    { value, setValue } = editor;
  function set(key: keyof Site, next: unknown) {
    setValue((v) => ({ ...v, [key]: next }));
  }
  return (
    <div className="editor">
      <p className="notice">
        Use the media library to upload assets, then paste their URLs here.
        Unknown business facts should stay blank.
      </p>
      {groups.map((group) => (
        <fieldset key={group.title} disabled={editor.busy}>
          <legend>{group.title}</legend>
          <div className="field-grid">
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
      <fieldset disabled={editor.busy}>
        <legend>Navigation labels</legend>
        <div className="field-grid">
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
      <fieldset disabled={editor.busy}>
        <legend>Services</legend>
        {value.services.map((service, i) => (
          <div key={i} className="list-editor-item">
            <div className="field-grid">
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
              <label className="check">
                <input
                  type="checkbox"
                  checked={service.visible}
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
            <div className="list-toolbar">
              <button
                className="button secondary"
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
                className="button secondary"
                onClick={() => {
                  if (confirm("Remove this service from the draft?"))
                    set(
                      "services",
                      value.services.filter((_, j) => i !== j),
                    );
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          className="button secondary"
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
      <fieldset disabled={editor.busy}>
        <legend>Social links</legend>
        {value.social.map((social, i) => (
          <div className="list-editor-item" key={i}>
            <div className="field-grid">
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
              className="text-link"
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
          className="button secondary"
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
