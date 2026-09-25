import "../styles/MerchCard.css";
import data from "../data/fandomverse-dataset.json";
import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";

const MerchCard = () => {
  const { addItems, isInCart } = useCart();

  return (
    data.merchandise.map((item) => {
      const inCart = isInCart(item.id);

      const handleAdd = (e) => {
        e.preventDefault();     // don't follow the Link
        e.stopPropagation();    // don't let React Router see the click
        addItems(item);         // adapter inside CartProvider parses "$189.99"
      };

      return (
        <Link to={`/store/${item.id}`} key={item.id} className="merch-link">
          <div className="MerchCard">
            <img src={item.imageUrl} alt={item.title} />
            <p>{item.title}</p>
            <div className="payment">
              <p>{item.price}</p>
              <button
                type="button"
                onClick={handleAdd}
                disabled={!item.inStock}
              >
                {!item.inStock ? "Out of stock" : inCart ? "Add again" : "Add"}
              </button>
            </div>
          </div>
        </Link>
      );
    })
  );
};

export default MerchCard;