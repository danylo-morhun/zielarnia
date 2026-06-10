"use client";

import type { ProductImage } from "@prisma/client";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { useAction } from "next-safe-action/hooks";
import { addProductImage, deleteProductImage } from "../actions";

interface Props {
  productId: string;
  images: ProductImage[];
}

export function ImagesSection({ productId, images }: Props) {
  const { execute: execAdd } = useAction(addProductImage);
  const { execute: execDelete, isPending: deleting } = useAction(deleteProductImage);

  return (
    <section className="rounded-lg border p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Zdjęcia</h2>
        {/* Requires NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME + NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local */}
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "ml_default"}
          onSuccess={(result) => {
            const info = result.info as { secure_url: string; public_id: string } | undefined;
            if (!info?.secure_url) return;
            execAdd({
              productId,
              url: info.secure_url,
              isMain: images.length === 0,
              sortOrder: images.length,
            });
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="rounded bg-foreground px-3 py-1 text-xs font-medium text-background"
            >
              + Dodaj zdjęcie
            </button>
          )}
        </CldUploadWidget>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((img) => (
          <div key={img.id} className="group relative">
            <div className="relative aspect-square overflow-hidden rounded-md border bg-muted">
              <Image
                src={img.url}
                alt={img.altPl ?? ""}
                fill
                className="object-cover"
                sizes="150px"
              />
            </div>
            {img.isMain && (
              <span className="absolute left-1 top-1 rounded bg-foreground/80 px-1 py-0.5 text-[10px] text-background">
                Główne
              </span>
            )}
            <button
              type="button"
              disabled={deleting}
              onClick={() => {
                if (confirm("Usunąć to zdjęcie?")) execDelete({ imageId: img.id, productId });
              }}
              className="absolute right-1 top-1 hidden rounded bg-destructive p-0.5 text-[10px] text-destructive-foreground group-hover:block disabled:opacity-50"
            >
              ✕
            </button>
          </div>
        ))}
        {images.length === 0 && (
          <p className="col-span-4 py-4 text-center text-sm text-muted-foreground">Brak zdjęć</p>
        )}
      </div>
      {/* URL input fallback */}
      <details className="mt-4">
        <summary className="cursor-pointer text-xs text-muted-foreground">Dodaj przez URL</summary>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const url = fd.get("url") as string;
            if (!url) return;
            execAdd({ productId, url, isMain: images.length === 0, sortOrder: images.length });
            (e.currentTarget as HTMLFormElement).reset();
          }}
          className="mt-2 flex gap-2"
        >
          <input
            name="url"
            type="url"
            placeholder="https://…"
            required
            className="flex-1 rounded border px-2 py-1 text-sm"
          />
          <button
            type="submit"
            className="rounded bg-foreground px-3 py-1 text-xs font-medium text-background"
          >
            Dodaj
          </button>
        </form>
      </details>
    </section>
  );
}
