import "../styles/MerchPage.css";
import data from "../data/fandomverse-dataset.json";
import { useParams } from "react-router-dom";
import { useCart } from "../context/useCart";

const MerchPage = () => {
  const { id } = useParams();
  const { addItems, isInCart, increment, decrement, items } = useCart();

  const item = data.merchandise.find((m) => m.id === id);

  if (!item) {
    return (
      <div className="MerchPage not-found">
        <p>Product not found.</p>
      </div>
    );
  }

  const inCart = isInCart(item.id);
  const qty = items.find((i) => i.id === item.id)?.quantity ?? 0;

  return (
    <div className="MerchPage" id={item.id}>
      <div className="merch-media">
        <img src={item.imageUrl} alt={item.title} />
      </div>

      <div className="merch-info">
        <div className="breadCrumb">
          <p className={item.inStock ? "stock in" : "stock out"}>
            {item.inStock ? "In stock" : "Out of stock"}
          </p>
          <p>{item.badge}</p>
          <p>{item.category}</p>
        </div>

        <h2>{item.title}</h2>
        <p className="summary">{item.summary}</p>

        <div className="price-row">
          <span className="price-label">Price</span>
          <span className="price">{item.price}</span>
        </div>

        {!item.inStock ? (
          <button type="button" className="add-btn" disabled>
            Out of stock
          </button>
        ) : !inCart ? (
          <button
            type="button"
            className="add-btn"
            onClick={() => addItems(item)}
          >
            Add to cart
          </button>
        ) : (
          <div className="cart-row">
            <span className="cart-row-label">
              In cart
              <span className="cart-row-count">{qty}</span>
            </span>

            <div className="qty-stepper">
              <button
                type="button"
                className="step"
                onClick={() => decrement(item.id)}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="qty" aria-live="polite">
                {qty}
              </span>
              <button
                type="button"
                className="step"
                onClick={() => increment(item.id)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MerchPage;