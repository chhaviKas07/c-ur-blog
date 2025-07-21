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
  Welcome to our eco-friendly marketplace — where sustainability meets convenience and conscious choices shape a better future.
  <br /><br />
  Our mission is to empower individuals to make planet-positive decisions by offering a curated range of eco-conscious products. From reusable everyday essentials and biodegradable alternatives to artisan-made sustainable goods, every item in our marketplace is handpicked to reduce waste, promote ethical practices, and support local and green businesses.
  <br /><br />
  We believe that sustainability shouldn't be a compromise. That’s why we’ve built a platform that brings together functionality, affordability, and environmental responsibility. By choosing our marketplace, you're not just shopping — you're becoming part of a community that cares for the planet and invests in a greener tomorrow.
  <br /><br />
  Join us in rethinking consumption — one mindful purchase at a time.
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
