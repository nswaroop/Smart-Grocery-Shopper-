import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Rating } from "@material-ui/lab";
import { addItemsToCart } from "../../actions/cartAction";
import { useSelector, useDispatch } from "react-redux";
import "./ProductCard.css";
import { useAlert } from "react-alert";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const options = {
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };

  const getProductImage = (productName) => {
    try {
      return require(`../../ProductImages/${productName}.jpg`).default;
    } catch (error) {
      console.error(`Error loading image for ${productName}:`, error);
      // If an error occurs (e.g., image not found), return a placeholder image
      return require('../../ProductImages/placeholder.jpg').default;
    }
  };

  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    // if (product.Stock <= quantity) return;

    const qty = quantity + 1;
    setQuantity(qty);
    console.log("hellore")
  };

  const decreaseQuantity = () => {
    if (1 >= quantity) return;

    const qty = quantity - 1;
    setQuantity(qty);
  };

  const addToCartHandler = () => {
    dispatch(addItemsToCart(product._id, quantity));
    alert.success("Item Added To Cart");
  };

  const transformString = (inputString) => {
    // Split the string based on underscore
    const stringArray = inputString.split('_');

    // Join the array elements with space
    const modifiedString = stringArray.join(' ');

    return modifiedString;
  };

  return (
    // <Link className="productCard" to={`/product/${product._id}`}>
    <div className="productCard">
      {/* <img src={product.images[0].url} alt={product.name} /> */}
      <img src={getProductImage(product.name)} alt={product.name} />
      <p>{transformString(product.name)}</p>
      {/* <div>
        <Rating {...options} />{" "}
        <span className="productCardSpan">
          {" "}
          ({product.numOfReviews} Reviews)
        </span>
      </div>
      <span>{`₹${product.price}`}</span> */}
      <div className="outerblock">
                  <div className="insideBlock">
                    <button onClick={decreaseQuantity}>-</button>
                    <input readOnly type="number" value={quantity} />
                    <button onClick={increaseQuantity}>+</button>
                  </div>
                  <button
                    // disabled={product.Stock < 1 ? true : false}
                    onClick={addToCartHandler}
                  >
                    Add to Cart
                  </button>
      </div>
      </div>
    // </Link>
  );
};

export default ProductCard;