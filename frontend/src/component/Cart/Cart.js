
import React, { Fragment,useState } from "react";
import "./Cart.css";
import CartItemCard from "./CartItemCard";
import { useSelector, useDispatch } from "react-redux";
import { addItemsToCart, removeItemsFromCart,updateCartItems} from "../../actions/cartAction";
import { Typography } from "@material-ui/core";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { Link } from "react-router-dom";
import RecommendationModal from './RecommendationModel';
import { useAlert } from 'react-alert';
import axios from "axios";

import Form from "./Form" ;
const Cart = ({ history }) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const alert = useAlert();
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [recommendations, setRecommendations] = useState(false);

  const [formValues, setFormValues] = useState({
    pricePriority: 0,
    timePriority: 0,
    selectedStores: [],
    servicePreferences:[],
  });

  // const [selectedCartIndex, setSelectedCartIndex] = useState(null);

  const increaseQuantity = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (stock <= quantity) {
      return;
    }
    dispatch(addItemsToCart(id, newQty));
  };

  const decreaseQuantity = (id, quantity) => {
    const newQty = quantity - 1;
    if (1 >= quantity) {
      return;
    }
    dispatch(addItemsToCart(id, newQty));
  };

  const deleteCartItems = (id) => {
    dispatch(removeItemsFromCart(id));
  };

  const checkoutHandler = (selectedCartIndex) => {
    console.log("checkoutHandler")
    if(selectedCartIndex || selectedCartIndex==0 ){
     console.log("Selected item",recommendations[selectedCartIndex].Items)
     console.log("Cart item",cartItems)
     dispatch(updateCartItems(recommendations[selectedCartIndex].Items))
     console.log("Modified Cart item",cartItems)
     history.push("/login?redirect=order/confirm");

    }
    else{
      console.log("select item")
      setShowAlert(true);
      // alert.error("Please select cart",{
      //   position: 'top center',
      //   effect: 'slide',
      //   offset: 50, 
      // zIndex: 10000, 
      // });
    }
   };
  

  const handleFormChange = async(timePriority, pricePriority, selectedStores, servicePreferences ) => {
    // setFormValues({
    //   ...formValues,
    //   [timePriority]: timePriority,
    //   [pricePriority]: pricePriority,
    //   [selectedStores]: selectedStores,
    //   [servicePreferences]: servicePreferences,
    // });
    console.log('Form recieved:', { timePriority, pricePriority, selectedStores, servicePreferences });
    console.log("Cart Items", cartItems)
    const requestData = {
      cart: cartItems,
      timePriority: timePriority,
      costPriority:pricePriority,
      storePreferences:selectedStores,
      servicePreferences:servicePreferences
    };
  
    try {
      const response = await axios.post("http://localhost:5001/communicate_data", requestData);
  
      console.log("Server Response:", response.data);
      setRecommendations(response.data)
      console.log("Recommendation",recommendations);

      setShowModal(true);
      // Handle the response as needed
  
    } catch (error) {
      console.error("Error communicating with the server:", error);
    }
    
  };

  const submitHandler = async (e) => {
    e.preventDefault();


    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/v1/payment/process",
        cartItems,
        formValues,
        config
      );

      const client_secret = data.client_secret;
    } catch (error) {
      alert.error(error.response.data.message);
    }
  };

  
  
  // const handleGenerate = async () => {
  //   // Call your API with cartItems and formValues
  //   try {
  //     const response = await axios.post("/api/generate", {
  //       cartItems,
  //       formValues,
  //     });
  //     // Display the response in a modal
  //     console.log(response.data); // Adjust this based on your API response structure
  //     setShowModal(true);
  //   } catch (error) {
  //     console.error("Error generating data:", error);
  //   }
  // };

  
  

  // const recommendations = [
  //   {
  //     Store:"Walmart",
  //     Service:"Delivery",
  //     TotalCost:100,
  //     CartCost:90,
  //     ServiceCost:10,
  //     TotalTime:"1hr 30min",
  //     Items:[{name:"apple",quantity:3,price:"30"},{name:"orange",quantity:2,price:"40"}],
  //     Time:["30min","1hr"] //[Storetime,servicetime]
  //   },
  //   {
  //       Store:"Aldi",
  //       Service:"pickup",
  //       TotalCost:90,
  //       CartCost:80,
  //       ServiceCost:10,
  //       TotalTime:"1hr 30min",
  //       Items:[{name:"apple",quantity:3,price:"30"},{name:"orange",quantity:2,price:"40"}],
  //       Time:["30min","1hr"] //[Storetime,servicetime]
  //   },
    
  //   {
  //       Store:"Costco",
  //       Service:"Store",
  //       TotalCost:110,
  //       CartCost:70,
  //       ServiceCost:10,
  //       TotalTime:"1hr 30min",
  //       Items:[{name:"apple",quantity:3,price:"30"},{name:"orange",quantity:2,price:"40"}],
  //       Time:["30min","1hr"] //[Storetime,servicetime]
  //   },  
  //   {
  //       Store:"Costco",
  //       Service:"Store",
  //       TotalCost:110,
  //       CartCost:70,
  //       ServiceCost:10,
  //       TotalTime:"1hr 30min",
  //       Items:[{name:"apple",quantity:3,price:"30"},{name:"orange",quantity:2,price:"40"}],
  //       Time:["30min","1hr"] //[Storetime,servicetime]
  //   },  
  // ];




  return (
    <Fragment>
      {cartItems.length === 0 ? (
        <div className="emptyCart">
          <RemoveShoppingCartIcon />

          <Typography>No Product in Your Cart</Typography>
          <Link to="/products">View Products</Link>
        </div>
      ) : (
        <Fragment>
          <div className="cartPage">
            <div className="cartHeader">
              <p>Product</p>
              <p>Quantity</p>
              {/* <p>Subtotal</p> */}
            </div>

            {cartItems &&
              cartItems.map((item) => (
                <div className="cartContainer" key={item.product}>
                  <CartItemCard item={item} deleteCartItems={deleteCartItems} />
                  <div className="cartInput">
                    <button
                      onClick={() =>
                        decreaseQuantity(item.product, item.quantity)
                      }
                    >
                      -
                    </button>
                    <input type="number" value={item.quantity} readOnly />
                    <button
                      onClick={() =>
                        increaseQuantity(
                          item.product,
                          item.quantity,
                          // item.stock
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                  {/* <p className="cartSubtotal">{`₹${
                    item.price * item.quantity
                  }`}</p> */}
                </div>
              ))}
            {/* <div className="cartGrossProfit">
              <div></div>
              <div className="cartGrossProfitBox">
                <p>Gross Total</p>
                <p>{`₹${cartItems.reduce(
                  (acc, item) => acc + item.quantity * item.price,
                  0
                )}`}</p>
              </div>
              <div></div>
              <div className="checkOutBtn">
                <button onClick={checkoutHandler}>Check Out</button>
              </div>
            </div> */}
            <Form handleFormChange={handleFormChange}/>
          </div>
          <RecommendationModal open={showModal} handleClose={() => setShowModal(false)} recommendations={recommendations}  checkoutHandler={checkoutHandler} showAlert={showAlert} setShowAlert={setShowAlert}/>
          
        </Fragment>
      )}
      
    </Fragment>
  );
};

export default Cart;