import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/wetube2");

mongoose.connection.on("error", (error) => console.log("DB error", error));
mongoose.connection.once("open", () => console.log("✅ connected to DB"));
