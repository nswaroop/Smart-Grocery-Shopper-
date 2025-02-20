import React from "react";
import "./CartItemCard.css";
import { Link } from "react-router-dom";

const getProductImage = (productName) => {
  try {
    return require(`../../ProductImages/${productName}.jpg`).default;
  } catch (error) {
    console.error(`Error loading image for ${productName}:`, error);
    // If an error occurs (e.g., image not found), return a placeholder image
    return require('../../ProductImages/placeholder.jpg').default;
  }
};

const CartItemCard = ({ item, deleteCartItems }) => {
  const transformString = (inputString) => {
    // Split the string based on underscore
    const stringArray = inputString.split('_');

    // Join the array elements with space
    const modifiedString = stringArray.join(' ');

    return modifiedString;
  };
  return (
    <div className="CartItemCard">
      {/* <img src={item.image} alt="ssa" /> */}
      <img src={getProductImage(item.name)} alt={item.name} />
      <div>
        <Link to={`/product/${item.product}`}>{transformString(item.name)}</Link>
        {/* <span>{`Price: ₹${item.price}`}</span> */}
        <p onClick={() => deleteCartItems(item.product)}>Remove</p>
      </div>
    </div>
  );
};

export default CartItemCard;