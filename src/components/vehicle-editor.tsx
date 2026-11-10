"use client";
import { Vehicle } from "@/lib/model";
import { Field, useEditor, EditorActions } from "./editor-tools";
import { Upload } from "./media-library";
export function VehicleEditor({
  initial,
  revision,
  id,
}: {
  initial: Vehicle;
  revision: number;
  id: string;
}) {
  const editor = useEditor(initial, revision, id, "vehicle"),
    { value, setValue } = editor;
  function set(key: keyof Vehicle, next: unknown) {
    setValue((v) => ({ ...v, [key]: next }));
  }
  const select = (key: keyof Vehicle, label: string, options: string[]) => (
    <label className="field" key={key}>
      {label}
      <select
        value={String(value[key])}
        onChange={(e) => set(key, e.target.value)}
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
  return (
    <div className="editor">
      <fieldset disabled={editor.busy}>
        <legend>Vehicle details</legend>
        <div className="field-grid">
          {(
            [
              ["title", "Listing title"],
              ["make", "Make"],
              ["model", "Model"],
              ["fuel", "Fuel"],
              ["colour", "Colour"],
              ["location", "Location"],
            ] as const
          ).map(([key, label]) => (
            <Field
              key={key}
              label={label}
              value={value[key]}
              onChange={(v) => set(key, v)}
            />
          ))}
          <Field
            label="Year"
            type="number"
            value={String(value.year)}
            onChange={(v) => set("year", Number(v))}
          />
          {select("condition", "Condition", [
            "Foreign used",
            "Nigerian used",
            "New",
          ])}
          {select("transmission", "Transmission", ["Automatic", "Manual"])}
          <Field
            label="Mileage (blank if unknown)"
            type="number"
            value={value.mileage === null ? "" : String(value.mileage)}
            onChange={(v) => set("mileage", v === "" ? null : Number(v))}
          />
          {select("mileageUnit", "Mileage unit", ["km", "mi"])}
          <Field
            label="Description"
            area
            wide
            value={value.description}
            onChange={(v) => set("description", v)}
          />
          <Field
            label="Features (one per line)"
            area
            wide
            value={value.features}
            onChange={(v) => set("features", v)}
          />
        </div>
      </fieldset>
      <fieldset disabled={editor.busy}>
        <legend>Price and availability</legend>
        <div className="field-grid">
          <Field
            label="Price (blank for Price on request)"
            type="number"
            value={value.price === null ? "" : String(value.price)}
            onChange={(v) => set("price", v === "" ? null : Number(v))}
          />
          {select("currency", "Currency", ["NGN", "USD", "GBP", "EUR"])}
          {select("availability", "Availability", [
            "available",
            "reserved",
            "sold",
          ])}
          <Field
            label="Display order (lower first)"
            type="number"
            value={String(value.order)}
            onChange={(v) => set("order", Number(v))}
          />
          <label className="check">
            <input
              type="checkbox"
              checked={value.featured}
              onChange={(e) => set("featured", e.target.checked)}
            />
            Feature on homepage
          </label>
        </div>
      </fieldset>
      <fieldset disabled={editor.busy}>
        <legend>Gallery</legend>
        <p className="small muted">
          First image is the cover. Upload an image or paste a URL from the
          media library. Only use real photos of this vehicle.
        </p>
        {value.images.map((image, i) => (
          <div key={i} className="list-editor-item">
            {image.url && (
              <img
                className="media-thumb"
                src={image.url}
                alt={image.alt || "Vehicle image preview"}
              />
            )}
            <div className="field-grid">
              <Field
                label="Image URL"
                value={image.url}
                onChange={(v) =>
                  set(
                    "images",
                    value.images.map((im, j) =>
                      i === j ? { ...im, url: v } : im,
                    ),
                  )
                }
              />
              <Field
                label="Image description"
                value={image.alt}
                onChange={(v) =>
                  set(
                    "images",
                    value.images.map((im, j) =>
                      i === j ? { ...im, alt: v } : im,
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
                  const list = [...value.images];
                  [list[i - 1], list[i]] = [list[i], list[i - 1]];
                  set("images", list);
                }}
              >
                Move earlier
              </button>
              <button
                className="button secondary"
                onClick={() =>
                  set(
                    "images",
                    value.images.filter((_, j) => i !== j),
                  )
                }
              >
                Remove from gallery
              </button>
            </div>
          </div>
        ))}
        <div className="list-toolbar">
          <button
            className="button secondary"
            onClick={() =>
              set("images", [...value.images, { url: "", alt: "" }])
            }
          >
            Add image URL
          </button>
        </div>
        <Upload
          imageOnly
          onUploaded={(media) =>
            setValue((v) => ({
              ...v,
              images: [...v.images, { url: media.url, alt: media.alt }],
            }))
          }
        />
        <Field
          label="Optional video URL"
          value={value.video}
          onChange={(v) => set("video", v)}
        />
      </fieldset>
      <EditorActions editor={editor} id={id} vehicle />
    </div>
  );
}
