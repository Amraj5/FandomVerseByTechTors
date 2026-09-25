import "../styles/MerchPage.css";        // ← was "../styles/MerchCard.css"
import data from "../data/fandomverse-dataset.json";
import { useParams } from "react-router-dom";
import { useCart } from "../context/useCart";

const MerchPage = () => {
  const { id } = useParams();
  const { addItems, isInCart } = useCart();
  const item = data.merchandise.find((m) => m.id === id);

  if (!item) {
    return (
      <div className="MerchPage not-found">
        <p>Product not found.</p>
      </div>
    );
  }

  const inCart = isInCart(item.id);

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

        <button
          type="button"
          className="add-btn"
          onClick={() => addItems(item)}
          disabled={!item.inStock}
        >
          {!item.inStock ? "Out of stock" : inCart ? "Add another" : "Add to cart"}
        </button>
      </div>
    </div>
  );
};

export default MerchPage;