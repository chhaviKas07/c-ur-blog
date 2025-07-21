import React, { useState } from "react";
import "./Contact.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
     console.log("Form submitted:", formData);
    toast.success("Thank you for contacting us!", {
      position: "top-center",
      autoClose: 3000
    });
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="contactContainer">
      <form className="contactForm" onSubmit={handleSubmit}>
        <Typography variant="h4" className="formTitle">Contact Us</Typography>
       <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit">Send</button>
      </form>
       <ToastContainer />
    </div>
  );
};

export default Contact;
