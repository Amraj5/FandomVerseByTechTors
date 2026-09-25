import "./merchcard.css";
import data from "./data/fandomverse-dataset.json";
import { Link } from "react-router-dom";

function MerchCard() {
  const merchandise = data.merchandise;

  return (
    <section>
       <h2 className="merch-header">Featured Merchandise</h2>
    <div className="merch-grid">
      {merchandise.map((item) => {
        return (
          <Link
            to={`/store/${item.id}`}
            key={item.id}
            className="merch-link"
          >
              <div
  className={`MerchCard ${item.category}`}
  style={{
    backgroundImage: `url("${item.imageUrl}")`,
  }}
>
              <div className="merch-overlay">
                <p className="merch-title">{item.title}</p>

                <div className="payment">
                  <p>{item.price}</p>
                  <button type="button">Add</button>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
    </section>
     
  );
}

export default MerchCard;
