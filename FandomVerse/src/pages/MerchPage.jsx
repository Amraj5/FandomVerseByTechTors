import "../styles/MerchCard.css";
// import { useState } from "react";
import data from "../data/fandomverse-dataset.json";
import { useParams } from "react-router-dom";

const MerchPage = () => {
const { id } = useParams();


const item = data.merchandise.find((m) => m.id === id);
 console.log("matched item =", item);
  if (!item) {
    return (
      <div className="MerchPage">
        <p>Product not found.</p>
      </div>
    );
  }
    return(
            <div className="MerchPage" id={item.id}>
                <img src={item.imageUrl} alt={item.name} />
                <h2>
                    {item.title}
                </h2>
                <div className="breadCrumb">
                    <p>{item.inStock?"In stock" : "Out of stock"}</p>
                    <p>{item.badge}</p>
                    <p>{item.category}</p>
                </div>
                <p>{item.summary}</p>
                <p>{item.price}</p>
            </div>
    )
    
}

export default MerchPage;