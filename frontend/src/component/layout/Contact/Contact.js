import React from "react";
import "./Contact.css";
import { Button } from "@material-ui/core";

const Contact = () => {
  return (
    <div className="contactContainer">
      <a className="mailBtn" href="nswaroop1999@gmail.com">
        <Button>Contact: Developer@gmail.com</Button>
      </a>
    </div>
  );
};

export default Contact;