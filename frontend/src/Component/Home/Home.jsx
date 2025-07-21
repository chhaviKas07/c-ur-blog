import React, { Fragment, useEffect } from "react";
import "./Home.css";
import ProductCard from "./ProductCard.jsx";
import MetaData from "../layout/MetaData.jsx";
import { clearErrors, getProducts } from "../../productSlice.jsx";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader.jsx";

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
  
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="C_UR_PRODUCT" />

         <div className="banner">
            <p>Welcome to Eco-Friendly Marketplace</p>
            <h1>Shop Sustainably. Live Responsibly.</h1>
            <a href="#container">
              <button>Shop Now</button>
            </a>
          </div>

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
      <img src="/assets/eco-basket.png" alt="Eco Products" />
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

           <section className="ecoMission">
            <h2>Why EcoCart?</h2>
            <p>
              We're committed to reducing carbon footprints by offering sustainable,
              ethically sourced products. Every order you place helps plant trees,
              offset CO₂, and support eco-conscious brands.
            </p>
          </section>

         <section className="ecoBenefits">
            <h2>Our Eco Promise</h2>
            <div className="benefitCards">
              <div className="card">
                ♻️ Carbon Neutral Shipping
              </div>
              <div className="card">
                🌱 Organic & Recycled Materials
              </div>
              <div className="card">
                💚 You Save CO₂ With Every Order
              </div>
            </div>
          </section>
  <section className="testimonials">
            <h2>Happy Customers</h2>
            <div className="testimonialCards">
              <blockquote>
                “Amazing eco products and fast delivery! I love the mission.”
                <span>- Aditi R.</span>
              </blockquote>
              <blockquote>
                “I switched to EcoCart for everything – guilt-free shopping at last!”
                <span>- Rahul M.</span>
              </blockquote>
            </div>
          </section>

          <section className="newsletter">
            <h2>Join Our Green Community</h2>
            <p>Get exclusive deals and sustainability tips in your inbox.</p>
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </section>


          {/* <h2 className="homeHeading">Featured Products</h2>
          <div className="container" id="container">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div> */}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
