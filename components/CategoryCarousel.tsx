"use client";

import Link from "next/link";
import { useRef, useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
  image_url?: string | null;
};

export default function CategoryCarousel({
  categories,
}: {
  categories: Category[];
}) {
  const maskRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const hasDragged = useRef(false);

  const safeCategories =
    categories && categories.length > 0
      ? categories
      : [
          {
            id: "fallback-1",
            name: "Electronics",
            slug: "electronics",
            image_url: "https://via.placeholder.com/800x500?text=Electronics",
          },
          {
            id: "fallback-2",
            name: "Fashion",
            slug: "fashion",
            image_url: "https://via.placeholder.com/800x500?text=Fashion",
          },
        ];

  const looped = [
    ...safeCategories,
    ...safeCategories,
    ...safeCategories,
    ...safeCategories,
    ...safeCategories,
    ...safeCategories,
  ];

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!maskRef.current) return;

    setIsDragging(true);
    hasDragged.current = false;
    startX.current = e.clientX;
    startScrollLeft.current = maskRef.current.scrollLeft;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !maskRef.current) return;

    const movedBy = e.clientX - startX.current;

    if (Math.abs(movedBy) > 8) {
      hasDragged.current = true;
    }

    maskRef.current.scrollLeft = startScrollLeft.current - movedBy;
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (hasDragged.current) {
      e.preventDefault();
      hasDragged.current = false;
    }
  };

  return (
    <div className="um-carousel-shell">
      <div
        ref={maskRef}
        className={`um-carousel-mask ${isDragging ? "is-dragging" : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        onPointerLeave={stopDragging}
      >
        <div className="um-carousel-track">
          {looped.map((category, index) => (
            <Link
              key={`${category.id}-${index}`}
              href={`/category/${category.slug}`}
              className="um-carousel-card"
              draggable={false}
              onClick={handleCardClick}
            >
              <div className="um-carousel-image-wrap">
                <img
                  src={
                    category.image_url ||
                    "https://via.placeholder.com/800x500?text=Universal+Mart"
                  }
                  alt={category.name}
                  className="um-carousel-image"
                  draggable={false}
                />
              </div>

              <div className="um-carousel-body">
                <h3 className="um-carousel-title">{category.name}</h3>
                <p className="um-carousel-price">Explore category</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}