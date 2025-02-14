import React from "react";
import "./Button.css";

const Button = ({ label, onClick, className }) => {
  return (
    <button className={`btn ${className}`} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
