import React from "react";
import "./aboutSection.css";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import aboutimg from '../../../assets/aboutimg.png';
const About = () => {
  const visitInstagram = () => {
    window.location = "https://instagram.com/meabhisingh";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Typography>Eco-friendly marketplace</Typography>
            <span>
            Welcome to our eco-friendly marketplace — where sustainability meets convenience.
  We are committed to offering environmentally-conscious products that support both
  people and the planet. Whether you're shopping for daily essentials, handcrafted items,
  or green alternatives, we ensure that every product aligns with ethical and sustainable values.
            </span>
          </div>
          <div className="aboutSectionContainer2">
           <img src={aboutimg} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
