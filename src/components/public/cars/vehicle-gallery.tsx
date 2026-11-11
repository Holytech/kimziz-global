"use client";

import { useState } from "react";
import { CarFront, Maximize2, Video } from "lucide-react";
import { Listing } from "@/lib/model";
import { Lightbox, LightboxAsset } from "@/components/lightbox";

export interface VehicleGalleryProps {
  images: Listing["images"];
  video?: string;
  title: string;
}

export function VehicleGallery({
  images,
  video,
  title,
}: Readonly<VehicleGalleryProps>) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Compile all assets (photos and optional video)
  const assets: LightboxAsset[] = [
    ...images.map((im, i) => ({
      type: "image" as const,
      url: im.url,
      alt:
        im.alt || (i === 0 ? `${title} - Cover` : `${title} - Photo ${i + 1}`),
    })),
    ...(video
      ? [
          {
            type: "video" as const,
            url: video,
            alt: `${title} - Video`,
          },
        ]
      : []),
  ];

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <div>
      {/* Photos Grid */}
      {images.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {images.map((im, i) => {
            const isCover = i === 0;
            return (
              <button
                key={i}
                type="button"
                onClick={() => openLightbox(i)}
                className={`${
                  isCover ? "col-span-full aspect-[1.5]" : "aspect-[1.4]"
                } relative w-full overflow-hidden rounded-[6px] bg-soft group cursor-zoom-in text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold border border-line`}
                aria-label={`View photo ${i + 1} of ${images.length}: ${im.alt || title}`}
              >
                <img
                  src={im.url}
                  alt={im.alt || title}
                  loading={i ? "lazy" : "eager"}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-navy/20 group-hover:bg-navy/40 transition-colors flex items-end justify-between p-3 opacity-0 group-hover:opacity-100">
                  <span className="text-white text-xs font-medium drop-shadow-sm truncate max-w-[80%]">
                    {im.alt || (isCover ? "Cover photo" : `Photo ${i + 1}`)}
                  </span>
                  <span className="p-1.5 rounded-full bg-black/60 text-white backdrop-blur-xs shrink-0 shadow-sm">
                    <Maximize2 size={15} />
                  </span>
                </div>

                {isCover && (
                  <span className="absolute top-2.5 left-2.5 bg-gold text-navy text-[0.68rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                    Cover photo
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="min-h-[350px] grid place-items-center bg-soft border border-line rounded text-muted">
          <CarFront size={100} />
        </div>
      )}

      {/* Embedded Video */}
      {video && (
        <div className="mt-6 rounded-[8px] border border-line bg-surface overflow-hidden">
          <div className="p-3 bg-soft/60 border-b border-line flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-ink">
              <Video size={16} className="text-gold" />
              <span>Vehicle Video Showcase</span>
            </div>
            <button
              type="button"
              onClick={() => openLightbox(images.length)} // Video is at index images.length
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-gold transition-colors font-medium cursor-pointer"
            >
              <Maximize2 size={13} /> Fullscreen
            </button>
          </div>
          <video
            controls
            playsInline
            preload="metadata"
            src={video}
            className="w-full aspect-video object-contain bg-black"
          />
        </div>
      )}

      {/* Standalone Lightbox with smooth slide transitions & swipe gesture support */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        assets={assets}
        initialIndex={activeIndex}
        title={title}
      />
    </div>
  );
}
