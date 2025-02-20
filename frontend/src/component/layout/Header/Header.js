import React from "react";
import { ReactNavbar } from "overlay-navbar";
import logo from "../../../images/shoplogo.jpg";

const options = {
  burgerColorHover: "rgb(147, 142, 142)",
  logo,
  logoWidth: "20vmax",
  navColor1: "white",
  logoHoverSize: "10px",
  logoHoverColor: "rgb(147, 142, 142)",
  link1Text: "Home",
  link2Text: "Products",
  link3Text: "Contact",
  link4Text: "About",
  link1Url: "/",
  link2Url: "/products",
  link3Url: "/contact",
  link4Url: "/about",
  link1Size: "1.5vmax",
  link2Size: "1.5vmax",
  link3Size: "1.5vmax",
  link4Size: "1.5vmax",
  link1Color: "rgba(35, 35, 35,0.8)",
  nav1justifyContent: "flex-end",
  nav2justifyContent: "flex-end",
  nav3justifyContent: "flex-start",
  nav4justifyContent: "flex-start",
  link1ColorHover: "rgb(147, 142, 142)",
  link1Margin: "1vmax", 
  profileIconUrl: "/login",
  profileIconColor: "rgba(35, 35, 35,0.8)",
  searchIconColor: "rgba(35, 35, 35,0.8)",
  cartIconColor: "rgba(35, 35, 35,0.8)",
  profileIconColorHover: "rgb(147, 142, 142)",
  searchIconColorHover: "rgb(147, 142, 142)",
  cartIconColorHover: "rgb(147, 142, 142)",
  cartIconMargin: "1vmax",
};

const Header = () => {
  return <ReactNavbar {...options} />;
};

export default Header;