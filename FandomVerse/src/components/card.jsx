import "../styles/card.css";
import data from "../data/fandomverse-dataset.json";

const Card = ()=> {
  return (
    data.topicHubs.map((item) =>
    ( 
    <div className="card" key={item.id}>
        <img src={item.bannerImage} alt="card image" />
        <p>{item.category}</p>
        <h6>
            {item.overview}
        </h6>
    <div>

    </div>
    </div>
   
    ))
   

);}

export default Card;