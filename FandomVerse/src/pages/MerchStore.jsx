import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/MerchStorePage.css";
import data from "../data/fandomverse-dataset.json";
import { useCart } from "../context/useCart";

export default function StorePage() {
  const { items, subtotal, addItems, removeItems, increment, decrement, isInCart } = useCart();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [checkoutNotice, setCheckoutNotice] = useState(false);

  useEffect(() => {
    document.title = "Merchandise showcase | FandomVerse";
  }, []);

  const categories = useMemo(() => {
    const seen = new Set();
    return data.merchandise
      .map((p) => p.category)
      .filter((c) => (seen.has(c) ? false : (seen.add(c), true)))
      .map((slug) => ({ slug, name: slug.charAt(0).toUpperCase() + slug.slice(1) }));
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...data.merchandise];

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.summary?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [selectedCategory, searchQuery]);

  const qtyOf = (id) => items.find((i) => i.id === id)?.quantity ?? 0;

  const handleDecrement = (id) => {
    if (qtyOf(id) <= 1) removeItems(id);
    else decrement(id);
  };

  const handleCheckoutClick = () => {
    setCheckoutNotice(true);
    setTimeout(() => setCheckoutNotice(false), 3500);
  };

  return (
    <div className="store-page">
      <div className="sp-container">
        <header className="sp-header">
          <div className="sp-title-row">
            <h1 className="sp-heading">Merchandise showcase</h1>
            <span className="sp-subheading">licensed-style collectibles · apparel · plushies</span>
          </div>

          <div className="sp-filter-bar">
            <div className="sp-pills" role="tablist" aria-label="Filter by category">
              <button
                type="button"
                role="tab"
                aria-selected={selectedCategory === "all"}
                className={`sp-pill ${selectedCategory === "all" ? "active" : ""}`}
                onClick={() => setSelectedCategory("all")}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === cat.slug}
                  className={`sp-pill ${selectedCategory === cat.slug ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat.slug)}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="sp-search">
              <svg
                className="sp-search-icon"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Filter items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="sp-search-input"
                aria-label="Filter merchandise items"
              />
            </div>
          </div>
        </header>

        <div className="sp-layout">
          <main className="sp-products">
            {filteredProducts.length > 0 ? (
              <div className="sp-grid">
                {filteredProducts.map((product) => {
                  const inCart = isInCart(product.id);
                  const qty = qtyOf(product.id);

                  return (
                    <Link key={product.id} to={`/store/${product.id}`} className="sp-link">
                      <article className="sp-card">
                        <img src={product.imageUrl} alt={product.title} />

                        <p className="sp-card-title">{product.title}</p>

                        <div className="sp-card-footer">
                          <span className="sp-card-price">{product.price}</span>

                          {!product.inStock ? (
                            <button
                              type="button"
                              className="sp-btn"
                              disabled
                              onClick={(e) => e.preventDefault()}
                            >
                              Out of stock
                            </button>
                          ) : !inCart ? (
                            <button
                              type="button"
                              className="sp-btn primary"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addItems(product);
                              }}
                            >
                              Add
                            </button>
                          ) : (
                            <div className="sp-qty-stepper" onClick={(e) => e.preventDefault()}>
                              <button
                                type="button"
                                className="sp-step"
                                aria-label="Decrease quantity"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDecrement(product.id);
                                }}
                              >
                                −
                              </button>
                              <span className="sp-qty">{qty}</span>
                              <button
                                type="button"
                                className="sp-step"
                                aria-label="Increase quantity"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  increment(product.id);
                                }}
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="sp-empty">
                <p>No merchandise items match your filter.</p>
                <button
                  type="button"
                  className="sp-reset-btn"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                  }}
                >
                  Reset filters
                </button>
              </div>
            )}
          </main>

          <aside className="sp-cart" aria-label="Shopping Cart">
            <h2 className="sp-cart-title">Your cart</h2>

            <div className="sp-cart-list">
              {items.length > 0 ? (
                items.map((item) => (
                  <div key={item.id} className="sp-cart-item">
                    <div className="sp-cart-item-info">
                      <span className="sp-cart-item-name" title={item.title}>
                        {item.title}
                      </span>
                      <span className="sp-cart-item-meta">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </span>
                    </div>

                    <div className="sp-qty-stepper small">
                      <button
                        type="button"
                        className="sp-step"
                        aria-label={`Decrease quantity of ${item.title}`}
                        onClick={() => handleDecrement(item.id)}
                      >
                        −
                      </button>
                      <span className="sp-qty">{item.quantity}</span>
                      <button
                        type="button"
                        className="sp-step"
                        aria-label={`Increase quantity of ${item.title}`}
                        onClick={() => increment(item.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="sp-cart-empty">Your cart is currently empty. Click "Add" on any merchandise item.</p>
              )}
            </div>

            <div className="sp-cart-divider" />

            <div className="sp-total-row">
              <span className="sp-total-label">Total</span>
              <span className="sp-total-amount">${subtotal.toFixed(2)}</span>
            </div>

            <p className="sp-disclaimer">
              Temporary cart only — checkout and payment are intentionally out of scope per the SRS.
            </p>

            <button
              type="button"
              className="sp-checkout-btn"
              onClick={handleCheckoutClick}
              aria-describedby="srs-notice"
            >
              Checkout unavailable
            </button>

            {checkoutNotice && (
              <div id="srs-notice" className="sp-notice" role="status">
                <span aria-hidden="true">ⓘ</span>
                <span>Rule 3: Payments and live checkout are intentionally omitted per SRS specifications.</span>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}