"use client";

import { useEffect, useRef, useState } from "react";

type ProductImage = {
  id: string;
  image_url?: string | null;
  alt_text?: string | null;
};

export default function ProductImageGallery({
  images,
}: {
  images: ProductImage[];
}) {
  const fallback = "https://via.placeholder.com/900x700?text=Universal+Mart";

  const safeImages =
    images.length > 0
      ? images
      : [{ id: "fallback", image_url: fallback, alt_text: "Product image" }];

  const [index, setIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const thumbRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef(0);

  const selectedImage = safeImages[index];

  const goPrevious = () => {
    setIndex((current) =>
      current === 0 ? safeImages.length - 1 : current - 1
    );
  };

  const goNext = () => {
    setIndex((current) =>
      current === safeImages.length - 1 ? 0 : current + 1
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current;

    if (delta > 50) goPrevious();
    if (delta < -50) goNext();
  };

  const scrollThumbs = (dir: "left" | "right") => {
    if (!thumbRef.current) return;

    thumbRef.current.scrollBy({
      left: dir === "left" ? -260 : 260,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const activeThumb = document.getElementById(`product-thumb-${index}`);

    activeThumb?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [index]);

  return (
    <>
      <div>
        {/* MAIN IMAGE */}
        <div
          className="group relative overflow-hidden rounded-[28px] bg-slate-100"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="block w-full"
          >
            <img
              src={selectedImage.image_url || fallback}
              alt={selectedImage.alt_text || "Product image"}
              className="h-[340px] w-full object-cover transition duration-300 md:h-[560px] md:group-hover:scale-[1.1]"
            />
          </button>

          {safeImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrevious}
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-slate-200 bg-white/90 px-3 py-2 text-sm font-bold shadow-lg transition hover:bg-orange-50"
              >
                ←
              </button>

              <button
                type="button"
                onClick={goNext}
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-slate-200 bg-white/90 px-3 py-2 text-sm font-bold shadow-lg transition hover:bg-orange-50"
              >
                →
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="absolute bottom-4 right-4 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-slate-800 shadow-lg transition hover:bg-orange-50 hover:text-orange-600"
          >
            View larger
          </button>
        </div>

        {/* THUMBNAILS */}
        {safeImages.length > 1 && (
          <div className="relative mt-4">
            {/* Fade edges */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-white to-transparent" />

            <button
              type="button"
              onClick={goPrevious}
              className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-bold shadow-lg transition hover:bg-orange-50"
            >
              ←
            </button>

            <div
              ref={thumbRef}
              className="scrollbar-hide flex gap-3 overflow-x-auto scroll-smooth px-12 pb-2"
            >
              {safeImages.map((img, i) => (
                <button
                  id={`product-thumb-${i}`}
                  key={img.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`shrink-0 rounded-2xl border-2 p-1 transition ${
                    index === i
                      ? "border-orange-500"
                      : "border-transparent hover:border-orange-200"
                  }`}
                >
                  <img
                    src={img.image_url || fallback}
                    alt={img.alt_text || "Product thumbnail"}
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={goNext}
              className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-bold shadow-lg transition hover:bg-orange-50"
            >
              →
            </button>
          </div>
        )}
      </div>

      {/* FULLSCREEN MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-[999] bg-black/90 px-4 py-6">
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            className="absolute right-5 top-5 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow-lg"
          >
            Close
          </button>

          {safeImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrevious}
                className="absolute left-5 top-1/2 -translate-y-1/2 rounded-full bg-white px-4 py-3 text-lg font-bold text-slate-900 shadow-lg"
              >
                ←
              </button>

              <button
                type="button"
                onClick={goNext}
                className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full bg-white px-4 py-3 text-lg font-bold text-slate-900 shadow-lg"
              >
                →
              </button>
            </>
          )}

          <div
            className="flex h-full items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={selectedImage.image_url || fallback}
              alt={selectedImage.alt_text || "Product image"}
              className="max-h-[85vh] max-w-[92vw] rounded-3xl object-contain"
            />
          </div>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-4 py-2 text-xs font-bold text-white">
            {index + 1} / {safeImages.length}
          </div>
        </div>
      )}
    </>
  );
}