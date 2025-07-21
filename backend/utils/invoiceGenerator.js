const PDFDocument = require("pdfkit");
const path = require("path");

const generateInvoice = (order, stream) => {
  const doc = new PDFDocument({ margin: 50 });

  doc.pipe(stream);

  // Add logo image
  const logoPath = path.join(__dirname, "logo.png"); // Update path if needed
  doc.image(logoPath, 50, 45, { width: 120 });

  // Company Name & Invoice Title
  doc.fontSize(20).text("EcoCart Pvt. Ltd.", 200, 50, { align: "right" });
  doc.moveDown();
  doc.fontSize(14).text("Eco Invoice", { align: "center" });
  doc.moveDown();

  // Invoice Metadata
  doc.fontSize(12).text(`Invoice Date: ${new Date(order.createdAt).toLocaleString()}`);
  doc.text(`Order ID: ${order._id}`);
  doc.moveDown();

  // Customer Info
  doc.fontSize(14).text("Customer Details", { underline: true });
  doc.fontSize(12).text(`Name: ${order.user.name}`);
  doc.text(`Email: ${order.user.email}`);
  doc.moveDown();

  // Shipping Info
  doc.fontSize(14).text(" Shipping Information", { underline: true });
  doc.fontSize(12).text(`Address: ${order.shippingInfo.address}`);
  doc.text(`City: ${order.shippingInfo.city}`);
  doc.text(`State: ${order.shippingInfo.state}`);
  doc.text(`Country: ${order.shippingInfo.country}`);
  doc.text(`Pin Code: ${order.shippingInfo.pinCode}`);
  doc.text(`Phone No: ${order.shippingInfo.phoneNo}`);
  doc.moveDown();

  // Product Items
  doc.fontSize(14).text("Ordered Items", { underline: true });
  let totalCarbonSaved = 0;

order.orderItems.forEach((item, i) => {
  doc.fontSize(12).text(
    `${i + 1}. ${item.name} x${item.quantity} - ₹${item.price}${
      item.isEcoCertified ? " (Eco)" : ""
    }`
  );
  // doc.text(`   Category: ${item.category}`);
  // doc.text(`   Material: ${item.materialType}`);
  // doc.text(`   Weight: ${item.weightInGrams}g`);
  // doc.text(`   Shipping Distance: ${item.shippingDistanceKm} km`);
  // doc.text(`   Eco Score: ${item.ecoScore}/100`);
  // doc.text(`   Carbon Saved: ${(item.carbonSaved * item.quantity).toFixed(2)}g CO₂`);
  doc.text(`   Category: ${item.category || "N/A"}`);
doc.text(`   Material: ${item.materialType || "N/A"}`);
doc.text(`   Weight: ${item.weightInGrams || 0}g`);
doc.text(`   Shipping Distance: ${item.shippingDistanceKm || 0} km`);
doc.text(`   Eco Score: ${item.ecoScore || 0}/100`);

const carbonSaved = item.carbonSaved ? item.carbonSaved * item.quantity : 0;
doc.text(`   Carbon Saved: ${carbonSaved.toFixed(2)}g CO2`);
  doc.moveDown();

  if (item.isEcoCertified) {
    totalCarbonSaved += item.carbonSaved * item.quantity;
  }
});


  doc.moveDown();
  doc.fontSize(14).text("Payment Summary", { underline: true });
  doc.fontSize(12).text(`Items Price: ₹${order.itemsPrice}`);
  doc.text(`Tax: ₹${order.taxPrice}`);
  doc.text(`Shipping: ₹${order.shippingPrice}`);
  doc.text(`Total: ₹${order.totalPrice}`);
  doc.moveDown();

  // Carbon Summary
  doc.fontSize(14).text("Carbon Summary", { underline: true });
  doc.fontSize(12).fillColor("green").text(`Total Carbon Saved: ${totalCarbonSaved.toFixed(2)}g CO₂`);
  doc.fillColor("black");
  doc.moveDown();

  // Footer
  doc.fontSize(11).text("Thank you for supporting sustainable commerce!", {
    align: "center",
  });

  doc.end();
};

module.exports = generateInvoice;
