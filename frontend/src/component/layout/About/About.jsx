import React from "react";
import "./aboutSection.css";
import Typography from "@mui/material/Typography";
import aboutimg from '../../../assets/aboutimg.png';

const About = () => {
  return (
    <div className="aboutSection">
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">

        <Typography variant="h3" className="aboutTitle">About Us</Typography>

        <div className="aboutMainContent">
          <div className="aboutTextContainer">
            <Typography variant="h5" className="aboutSubtitle">Eco-Friendly Marketplace</Typography>
            <p className="aboutBody">
              Welcome to our eco-friendly marketplace — where sustainability meets convenience and conscious choices shape a better future.
            </p>
            <p className="aboutBody">
              Our mission is to empower individuals to make planet-positive decisions by offering a curated range of eco-conscious products.
            </p>
            <ul className="aboutHighlights">
              <li>Reusable everyday essentials</li>
              <li>Biodegradable & compostable products</li>
              <li>Locally made artisan goods</li>
            </ul>
            <p className="aboutBody">
              Join us in rethinking consumption — one mindful purchase at a time.
            </p>
          </div>

          <div className="aboutImgWrapper">
            <img src={aboutimg} alt="About EcoCart" className="aboutImg" />
          </div>
        </div>

        {/* Our Story */}
        <div className="aboutMilestones">
          <div><strong>2023:</strong> The idea of sustainable commerce was born.</div>
          <div><strong>2024:</strong> Our platform launched with 50+ eco-friendly vendors.</div>
          <div><strong>2025:</strong> Reached 10,000+ conscious customers across the country.</div>
        </div>

        {/* Vision and Mission */}
        <div className="aboutTextContainer">
          <Typography variant="h5" className="aboutSubtitle">Our Mission</Typography>
          <p className="aboutBody">
            To make eco-friendly living accessible, affordable, and inspiring — one product at a time.
          </p>

          <Typography variant="h5" className="aboutSubtitle">Our Vision</Typography>
          <p className="aboutBody">
            To become the most trusted marketplace for sustainable living globally, building a greener tomorrow together.
          </p>
        </div>

        {/* Why Choose Us */}
        <div className="aboutTextContainer">
          <Typography variant="h5" className="aboutSubtitle">What Makes Us Different</Typography>
          <ul className="aboutHighlights">
            <li>Carbon-neutral shipping options</li>
            <li>Verified eco-labels on all products</li>
            <li>Plastic-free packaging from our vendors</li>
            <li>Community-driven sustainability initiatives</li>
          </ul>
        </div>

        {/* Customer Trust (placeholder carousel) */}
        <div className="aboutTextContainer">
          <Typography variant="h5" className="aboutSubtitle">People About Us</Typography>
          <div className="aboutCarousel">
            <p>🌿 "Shopping here makes me feel like I'm giving back to the Earth." - Ananya</p>
            <p>🍃 "Their products are genuine, and I love how they care about packaging." - Raj</p>
            <p>🌱 "Finally, a place I trust for my zero-waste journey!" - Shruti</p>
          </div>
        </div>

        {/* Sustainability Stats */}
        <div className="aboutMilestones">
          <div><strong>20,000+</strong> plastic bottles saved from oceans</div>
          <div><strong>50+</strong> small businesses supported</div>
          <div><strong>98%</strong> of products shipped plastic-free</div>
        </div>

        {/* CTA */}
        <div className="aboutActions">
          <button className="ctaButton" onClick={() => window.location = "/products"}>Explore Eco Products</button>
        </div>

        <span className="aboutFooterNote">Thank you for supporting sustainable commerce 💚</span>
      </div>
    </div>
  );
};

export default About;
