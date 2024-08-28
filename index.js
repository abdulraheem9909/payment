const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection
const connectionString =
  "mongodb+srv://abdul9909:XQnlys6phmvrCyUY@paymentsystem.ndraz.mongodb.net/";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(connectionString, options)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Middleware
app.use(morgan("dev"));
app.use(bodyParser.json());

// Routes
const userRoutes = require("./routes/userRoutes");
const beneficiaryRoutes = require("./routes/beneficiaryRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

// app.use("/", (req, res) => {
//   res.status(200).json("Payment server");
// });
app.use("/users", userRoutes);
app.use("/beneficiaries", beneficiaryRoutes);
app.use("/transactions", transactionRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
