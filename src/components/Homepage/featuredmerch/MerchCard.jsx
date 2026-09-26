import "./merchcard.css";
import data from "./data/fandomverse-dataset.json";
import { Link } from "react-router-dom";
import { useCart } from "../../../context/useCart";

const MerchCard = () => {
  const { addItems, isInCart } = useCart();
  const merchandise = data.merchandise.slice(0, 8);

  return (
    <section className="merch-section">
      <div className="merch-header">
        <div>
          <p className="section-label">FEATURED MERCH</p>
          <h2 className="merch-title-main">Featured Merchandise</h2>
        </div>
        <Link to="/store" className="view-all-link">View all →</Link>
      </div>

      <div className="merch-grid">
        {merchandise.map((item) => {
          const inCart = isInCart(item.id);

          const handleAdd = (e) => {
            e.preventDefault();
            e.stopPropagation();
            addItems(item);
          };

          return (
            <Link key={item.id} to={item.shopUrl} className="merch-link">
              <div className={`MerchCard ${item.category}`}>
                <img src={item.imageUrl} alt={item.title} loading="lazy" />
                <div className="merch-overlay">
                  <p className="merch-title">{item.title}</p>
                  <div className="payment">
                    <p>{item.price}</p>
                    <button type="button" onClick={handleAdd} disabled={!item.inStock}>
                      {!item.inStock ? "Out of stock" : inCart ? "Add again" : "Add"}
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default MerchCard;
