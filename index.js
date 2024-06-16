const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const main_router = require("./routes/main_router");



const app = express();
const port = process.env.PORT || 8000;

app.use(cors({origin: "*"}));
app.use(express.json());
app.use("/", main_router);


mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connected to MongoDB");
});



app.get("/", (req, res) => {

    res.json({data: "Hello World"});
});





app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


