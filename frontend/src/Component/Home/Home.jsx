import React, { Fragment, useEffect, useState } from "react";
import "./Home.css";
import ProductCard from "./ProductCard.jsx";
import MetaData from "../layout/MetaData.jsx";
import { clearErrors, getProducts } from "../../productSlice.jsx";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader.jsx";
import imgbg from "../../assets/imgbg.png";
import homesec from "../../assets/home-sec.png";
import SUSTAINABLEPRODUCTS from "../../assets/SUSTAINABLEPRODUCTS.jpg";
import track from "../../assets/track.jpg";
import carbon from "../../assets/carbon.jpg";
import { Link } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);
  useEffect(() => {
    if (error) {
      console.error("Error fetching products:", error);
      dispatch(clearErrors());
    }
    dispatch(getProducts({}));
  }, [dispatch, error]);

  const testimonials = [
    {
      quote:
        "The dinner table is a special place where everyone's family. It's where good food and company matter, where we gather to talk about things both big and small.",
      name: "Samantha Willams",
      location: "St. Louis, MO",
    },
    {
      quote:
        "EcoMarket has changed the way I shop. Their commitment to sustainability is real, and every product feels thoughtfully sourced.",
      name: "Liam Johnson",
      location: "Seattle, WA",
    },
    {
      quote:
        "Finally, a place where ethical choices don’t mean compromising on quality or style. Highly recommend to anyone looking to shop greener.",
      name: "Aisha Patel",
      location: "Austin, TX",
    },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const { quote, name, location } = testimonials[currentIndex];
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="C_UR_PRODUCT" />
          <section id="home" className="home-section">
            <h1 className="heading">Welcome to <span style={{ color: "#000000ff" }}>Eco-Friendly Marketplace</span></h1>
            <p className="subheading">
              Your one-stop eco-friendly marketplace for sustainable, plastic-free living.
            </p>
            <p className="tagline">Shop consciously. Live mindfully.</p>
          </section>
          <section className="ecoCategories">
            <h2 className="sectionTitle">Choose by Category</h2>
            <p className="sectionSubtext">WHAT WE OFFER</p>

            <div className="categoryGrid">
              {[
                { name: "Home Decor", icon: "🪴" },
                { name: "Fashion and Accessories", icon: "👗" },
                { name: "Stationery", icon: "✏️" },
                { name: "Personal Care", icon: "🧴" },
                { name: "Household Essentials", icon: "🧼" },
                { name: "Beauty", icon: "💄" },
              ].map((cat) => (
                <Link
                  key={cat.name}
                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                  className="categoryCard"
                >
                  <div className="categoryIcon">{cat.icon}</div>
                  <p>{cat.name}</p>
                </Link>
              ))}
            </div>
          </section>
          <section className="ecoHighlights">
            <h2 className="sectionTitle">We Grow Sustainability</h2>
            <p className="sectionSubtext">Empowering your lifestyle with conscious, planet-friendly choices.</p>
            <div className="ecoFeatureGrid">
              <div className="featureBox left">
                <ul>
                  <li><span>🌿</span> Sustainable</li>
                  <li><span>🍃</span> Organic Materials</li>
                  <li><span>🧼</span> Cruelty-Free</li>
                  <li><span>♻️</span> Plastic-Free Packaging</li>
                </ul>
              </div>

              <div className="featureImage">
                <img src={homesec} alt="Eco Products" />
              </div>

              <div className="featureBox right">
                <ul>
                  <li><span>🌎</span> Carbon-Neutral</li>
                  <li><span>🥬</span> Farm-to-Door</li>
                  <li><span>🌸</span> Toxin-Free</li>
                  <li><span>🛍️</span> Handmade Products</li>
                </ul>
              </div>
            </div>

            <div className="trustBadges">
              <div>
                <span>🚚</span>
                <h4>Fast Delivery</h4>
                <p>Delivery within 48 hours</p>
              </div>
              <div>
                <span>💬</span>
                <h4>24/7 Support</h4>
                <p>Chat or Email Anytime</p>
              </div>
              <div>
                <span>🌱</span>
                <h4>Eco Verified</h4>
                <p>Backed by Green Certifications</p>
              </div>
              <div>
                <span>❤️</span>
                <h4>Made With Love</h4>
                <p>By Local Artisans</p>
              </div>
            </div>
          </section>
          <section className="eco-features">
            {/* Card 1 */}
            <div className="eco-card green">
              <h3 className="eco-card-title">SUSTAINABLE PRODUCTS</h3>
              <img src={SUSTAINABLEPRODUCTS} alt="Sustainable Products" className="eco-card-image" />
              <p className="eco-card-text">
                Choose from eco-conscious products made with biodegradable, recyclable, and ethically sourced materials.
              </p>
              <button className="eco-card-button">
                <Link to="/products">SHOP ECO</Link>
              </button>
            </div>

            {/* Card 2 */}
            <div className="eco-card yellow">
              <h3 className="eco-card-title">CUSTOMER REVIEWS</h3>
              <img src={track} alt="Customer Reviews" className="eco-card-image" />
              <p className="eco-card-text">
                Read real experiences from eco-conscious shoppers. Share your voice and help others make greener choices.
              </p>
              <Link to="/products">
                <button className="eco-card-button">READ REVIEWS</button>
              </Link>
            </div>

            {/* Card 3 */}
            <div className="eco-card lightgreen">
              <h3 className="eco-card-title">OUR MISSION</h3>
              <img src={carbon} alt="Our Mission" className="eco-card-image" />
              <p className="eco-card-text">
                We’re on a journey to make sustainable shopping easy, affordable, and impactful for everyone.
              </p>
              <Link to="/about">
                <button className="eco-card-button">LEARN MORE</button>
              </Link>
            </div>
          </section>

          <section className="testimonials" aria-label="Testimonials about us">
            <div className="testimonials__overlay" />
            <div className="testimonials__content">
              <h2 className="testimonials__title">PEOPLE ABOUT US</h2>
              <blockquote className="testimonials__quote">“ {quote} ”</blockquote>
              <p className="testimonials__author">
                {name}, <span className="testimonials__location">{location}</span>
              </p>
              <div className="testimonials__dots">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    className={`dot ${idx === currentIndex ? "active" : ""}`}
                    aria-label={`View testimonial ${idx + 1}`}
                    onClick={() => setCurrentIndex(idx)}
                  />
                ))}
              </div>
            </div>
          </section>

          <h2 className="homeHeading">Featured Products</h2>
          <div className="container" id="container">
            {products &&
              // products.map((product) => (
              products.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
