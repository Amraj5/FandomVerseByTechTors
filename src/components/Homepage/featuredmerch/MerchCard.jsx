import "./MerchCard.css";
import data from "./data/fandomverse-dataset.json";
import { Link } from "react-router-dom";
const MerchCard = ()=> {
  return (
    data.merchandise.map((item, index) => (
    <Link to={`/store/${item.id}`} key={item.id} className="merch-link">
      <div className="MerchCard" key={item.id ?? index}>
              <img src={item.imageUrl} alt="card image" />
              <p>{item.title}</p>
              <div className="payment">
                  <p>{item.price}</p>
                  <button type="button">Add</button>
              </div>
      </div>
    </Link>
    ))
);}

export default MerchCard;