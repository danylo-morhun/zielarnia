"use client";

import Image from "next/image";
import { useState } from "react";

type GalleryImage = {
  id: string;
  url: string;
  altPl: string | null;
  isMain: boolean;
  variantId: string | null;
};

type Props = {
  images: GalleryImage[];
  productName: string;
};

export function ProductGallery({ images, productName }: Props) {
  const visibleImages = images.filter((img) => img.variantId === null);
  const fallback = visibleImages.length > 0 ? visibleImages : images;
  const mainIndex = fallback.findIndex((img) => img.isMain);
  const [active, setActive] = useState(mainIndex >= 0 ? mainIndex : 0);

  if (fallback.length === 0) {
    return (
      <div className="aspect-square w-full rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
        <span className="text-sm">Brak zdjęcia</span>
      </div>
    );
  }

  const current = fallback[active];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
        <Image
          src={current.url}
          alt={current.altPl ?? productName}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {fallback.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {fallback.map((img, index) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(index)}
              className={`relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                index === active ? "border-primary" : "border-transparent"
              }`}
              aria-label={`Zdjęcie ${index + 1}`}
            >
              <Image
                src={img.url}
                alt={img.altPl ?? productName}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
