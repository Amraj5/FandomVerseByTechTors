/**
 * File: src/pages/StorePage.jsx
 * Purpose: Merchandise showcase page matching the exact SRS wireframe specification.
 *          Features 2-column layout with product showcase cards, category filtering,
 *          and an inline persistent in-memory session cart (Rule 3).
 * Used by: App.jsx (Route "/store")
 */

import { useState, useMemo, useEffect } from 'react'
import { Search, Minus, Plus, Info, Check } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import { useApp } from '../context/AppContext.jsx'
import ProductCard from '../components/cards/ProductCard.jsx'
import styles from './StorePage.module.css'

export default function StorePage() {
  const { products, categories, loading } = useData()
  const { cart, updateQty, removeFromCart, cartTotal } = useApp()

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [checkoutNotice, setCheckoutNotice] = useState(false)

  useEffect(() => {
    document.title = 'Merchandise showcase | FandomVerse'
  }, [])

  // Filter products by selected category and search query
  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase())
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.franchise?.toLowerCase().includes(q)
      )
    }

    return result
  }, [products, selectedCategory, searchQuery])

  // Handle quantity changes for cart item
  const handleDecrement = (item) => {
    if (item.quantity <= 1) {
      removeFromCart(item.id)
    } else {
      updateQty(item.id, item.quantity - 1)
    }
  }

  const handleIncrement = (item) => {
    updateQty(item.id, item.quantity + 1)
  }

  const handleCheckoutClick = () => {
    setCheckoutNotice(true)
    setTimeout(() => setCheckoutNotice(false), 3500)
  }

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <p>Loading merchandise showcase...</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Page Header */}
        <header className={styles.header}>
          <div className={styles.titleRow}>
            <h1 className={styles.heading}>Merchandise showcase</h1>
            <span className={styles.subheading}>
              licensed-style collectibles · apparel · plushies
            </span>
          </div>

          {/* Category Filter Pills & Search */}
          <div className={styles.filterBar}>
            <div className={styles.categoryPills} role="tablist" aria-label="Filter by fandom category">
              <button
                type="button"
                role="tab"
                aria-selected={selectedCategory === 'all'}
                className={`${styles.pillBtn} ${selectedCategory === 'all' ? styles.pillActive : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat.slug}
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === cat.slug}
                  className={`${styles.pillBtn} ${selectedCategory === cat.slug ? styles.pillActive : ''}`}
                  onClick={() => setSelectedCategory(cat.slug)}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Quick Search */}
            <div className={styles.searchBox}>
              <Search size={14} className={styles.searchIcon} aria-hidden="true" />
              <input
                type="text"
                placeholder="Filter items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                aria-label="Filter merchandise items"
              />
            </div>
          </div>
        </header>

        {/* 2-Column Showcase Content Layout */}
        <div className={styles.layout}>
          {/* Main Column: Products Grid */}
          <main className={styles.productsColumn}>
            {filteredProducts.length > 0 ? (
              <div className={styles.productsGrid}>
                {filteredProducts.map(prod => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            ) : (
              <div className={styles.emptyWrap}>
                <p>No merchandise items match your filter.</p>
                <button
                  type="button"
                  className={styles.resetBtn}
                  onClick={() => {
                    setSelectedCategory('all')
                    setSearchQuery('')
                  }}
                >
                  Reset filters
                </button>
              </div>
            )}
          </main>

          {/* Right Column: "Your cart" Sidebar Panel */}
          <aside className={styles.cartColumn} aria-label="Shopping Cart">
            <div className={styles.cartCard}>
              <h2 className={styles.cartTitle}>Your cart</h2>

              {/* Items List */}
              <div className={styles.cartItemList}>
                {cart.length > 0 ? (
                  cart.map(item => (
                    <div key={item.id} className={styles.cartItem}>
                      <div className={styles.cartItemInfo}>
                        <span className={styles.cartItemName} title={item.name}>
                          {item.name}
                        </span>
                        <span className={styles.cartItemPriceQty}>
                          ${Number(item.price).toFixed(0)} × {item.quantity}
                        </span>
                      </div>

                      {/* Quantity Stepper: [-] [+] */}
                      <div className={styles.stepperWrap}>
                        <button
                          type="button"
                          className={styles.stepperBtn}
                          onClick={() => handleDecrement(item)}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus size={13} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className={styles.stepperBtn}
                          onClick={() => handleIncrement(item)}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus size={13} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={styles.cartEmptyText}>
                    Your cart is currently empty. Click "add to cart" on any merchandise item.
                  </p>
                )}
              </div>

              {/* Cart Divider Line */}
              <div className={styles.cartDivider} />

              {/* Total Row */}
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>total</span>
                <span className={styles.totalAmount}>${cartTotal.toFixed(2)}</span>
              </div>

              {/* SRS Compliance Note */}
              <p className={styles.srsDisclaimer}>
                Temporary cart only — checkout and payment are intentionally out of scope per the srs.
              </p>

              {/* Checkout Unavailable Button */}
              <button
                type="button"
                className={styles.checkoutBtn}
                onClick={handleCheckoutClick}
                aria-describedby="srs-notice"
              >
                Checkout unavailable
              </button>

              {/* Accessible Rule 3 Banner on click */}
              {checkoutNotice && (
                <div id="srs-notice" className={styles.checkoutNoticeBanner} role="status">
                  <Info size={14} aria-hidden="true" />
                  <span>Rule 3: Payments and live checkout are intentionally omitted per SRS specifications.</span>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
