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

  const looped = [...safeCategories, ...safeCategories];

  return (
    <div className="um-carousel-shell">
      <div className="um-carousel-mask">
        <div className="um-carousel-track">
          {looped.map((category, index) => (
            <a
              key={`${category.id}-${index}`}
              href={`/category/${category.slug}`}
              className="um-carousel-card"
            >
              <div className="um-carousel-image-wrap">
                <img
                  src={
                    category.image_url ||
                    "https://via.placeholder.com/800x500?text=Universal+Mart"
                  }
                  alt={category.name}
                  className="um-carousel-image"
                />
              </div>

              <div className="um-carousel-body">
                <h3 className="um-carousel-title">{category.name}</h3>
                <p className="um-carousel-price">Explore category</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}