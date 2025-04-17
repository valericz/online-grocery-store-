import mongoose from "mongoose";
import foodModel from "./models/foodModel.js";
import { connectDB } from "./config/db.js";

const checkFoods = async () => {
    try {
        console.log("Attempting to connect to database...");
        await connectDB();
        console.log("Connected to database successfully");

        console.log("Querying for food items...");
        const foods = await foodModel.find({});
        console.log("Query completed");

        if (foods.length === 0) {
            console.log("No food items found in the database.");
        } else {
            console.log("Found " + foods.length + " food items:");
            console.log(JSON.stringify(foods, null, 2));
        }

        mongoose.connection.close();
        console.log("Database connection closed");
    } catch (error) {
        console.error("Error occurred:", error);
    }
};

checkFoods();