const express = require("express");
const app = express();
const PORT = 5000;
const routes = require("./src/routes/routes");
const cors = require("cors");
const { connectDB } = require("./src/db/db");
connectDB();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", routes);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})