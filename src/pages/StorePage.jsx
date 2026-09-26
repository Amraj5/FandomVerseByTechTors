import React, { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import data from "../components/Homepage/featuredmerch/data/fandomverse-dataset.json";
import { useCart } from "../context/useCart";
import styles from "./StorePage.module.css";

const CATEGORY_CONFIG = {
  anime: { label: "Anime", accent: "#E5A988", icon: "🎌" },
  gaming: { label: "Gaming", accent: "#4B92E5", icon: "🎮" },
  movies: { label: "Movies", accent: "#F3B23A", icon: "🎬" },
  tvshows: { label: "TV Shows", accent: "#E54B62", icon: "📺" },
  kpop: { label: "K-pop", accent: "#C85BD6", icon: "🎤" },
  comics: { label: "Comics", accent: "#EA7349", icon: "🦸" },
  manga: { label: "Manga", accent: "#8C929E", icon: "📖" },
};

export default function StorePage() {
  const { id } = useParams();
  const { addItems, isInCart, items: cartItems } = useCart();
  const merchandise = data.merchandise;
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  // Single product page
  if (id) {
    const product = merchandise.find((m) => m.shopUrl === `/store/${id}` || m.id === id);
    const config = CATEGORY_CONFIG[product?.category];

    if (!product) {
      return (
        <div className={`${styles.page} ${styles.notFound}`}>
          <h2>Product Not Found</h2>
          <Link to="/store" className="btn btn-primary">Back to Store</Link>
        </div>
      );
    }

    const inCart = isInCart(product.id);
    const handleAdd = () => addItems(product);

    return (
      <div className={`${styles.page} ${styles.productDetail}`} style={{ "--accent": config?.accent }}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className={styles.crumbSep}>/</span>
          <Link to="/store">Store</Link>
          <span className={styles.crumbSep}>/</span>
          <span aria-current="page">{product.title}</span>
        </nav>

        <div className={styles.productLayout}>
          <div className={styles.productGallery}>
            <img src={product.imageUrl} alt={product.title} />
          </div>
          <div className={styles.productInfo}>
            <span className={styles.productCategory} style={{ backgroundColor: config?.accent }}>
              {config?.icon} {config?.label}
            </span>
            <h1 className={styles.productTitle}>{product.title}</h1>
            <p className={styles.productSummary}>{product.summary}</p>
            <div className={styles.productPrice}>{product.price}</div>
            <div className={styles.productActions}>
              <button
                className={`btn btn-primary ${inCart ? "in-cart" : ""}`}
                onClick={handleAdd}
                disabled={!product.inStock}
              >
                {!product.inStock ? "Out of Stock" : inCart ? "Added to Cart" : "Add to Cart"}
              </button>
              <Link to="/cart" className="btn btn-secondary">View Cart</Link>
            </div>
            <div className={styles.productMeta}>
              {product.rating && <span>⭐ {product.rating}/5</span>}
              {product.badge && <span className={styles.productBadge}>{product.badge}</span>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Store listing page
  const categories = useMemo(() => {
    const cats = new Set(merchandise.map((m) => m.category));
    return ["All", ...Array.from(cats).sort()];
  }, [merchandise]);

  const filtered = merchandise.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Store</h1>
        <p className={styles.tagline}>Official merch from your favorite fandoms</p>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filters}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${selectedCategory === cat ? styles.filterBtnActive : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {filtered.map((item) => {
          const config = CATEGORY_CONFIG[item.category];
          const inCart = isInCart(item.id);
          const handleAdd = (e) => {
            e.preventDefault();
            e.stopPropagation();
            addItems(item);
          };

          return (
            <Link key={item.id} to={item.shopUrl} className={styles.card}>
              <div className={styles.cardImage} style={{ "--accent": config?.accent }}>
                <img src={item.imageUrl} alt={item.title} loading="lazy" />
                <span className={styles.cardCategory} style={{ backgroundColor: config?.accent }}>
                  {config?.icon} {config?.label}
                </span>
                {!item.inStock && <span className={styles.outOfStock}>Out of Stock</span>}
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardPrice}>{item.price}</p>
                <button
                  className={`${styles.btnAddToCart} ${inCart ? "in-cart" : ""}`}
                  onClick={handleAdd}
                  disabled={!item.inStock}
                >
                  {inCart ? "✓ In Cart" : "Add to Cart"}
                </button>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}