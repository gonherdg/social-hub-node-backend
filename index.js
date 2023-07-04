// Imports
const serverless = require("serverless-http");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const postRoutes = require("./src/routes/posts.js");
const userRoutes = require("./src/routes/users.js");
const testRoutes = require("./src/routes/tests.js");

const app = express();

const development = true;

dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/posts", postRoutes);
app.use("/user", userRoutes);
app.use("/tests", testRoutes);

// MongoDB connection:
mongoose.connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
});

module.exports.handler = serverless(app);

// For local test environment:
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
// https://www.mongodb.com/cloud/atlas

// Old connection:
if (!development) return;
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.CONNECTION_URL)
    .then(() =>
        app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
    )
    .catch((error) => console.log(error.message));
