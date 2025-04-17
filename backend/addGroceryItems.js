import mongoose from "mongoose";
import foodModel from "./models/foodModel.js";
import { connectDB } from "./config/db.js";

// Sample grocery items based on your SQL file
const groceryItems = [
    {
        name: "Fish Fingers",
        description: "Frozen fish fingers for a quick and easy meal",
        price: 2.55,
        category: "Frozen",
        image: "food_1.png" // Using existing images
    },
    {
        name: "Hamburger Patties",
        description: "Pack of 10 frozen hamburger patties",
        price: 2.35,
        category: "Frozen",
        image: "food_2.png"
    },
    {
        name: "Cheddar Cheese",
        description: "500 gram of premium cheddar cheese",
        price: 8.00,
        category: "Fresh",
        image: "food_3.png"
    },
    {
        name: "T Bone Steak",
        description: "1000 gram of premium T-bone steak",
        price: 7.00,
        category: "Fresh",
        image: "food_4.png"
    },
    {
        name: "Navel Oranges",
        description: "Bag of 20 fresh navel oranges",
        price: 3.99,
        category: "Fresh",
        image: "food_5.png"
    },
    {
        name: "Earl Grey Tea Bags",
        description: "Pack of 25 premium tea bags",
        price: 2.49,
        category: "Beverages",
        image: "food_6.png"
    },
    {
        name: "Instant Coffee",
        description: "200 gram of instant coffee",
        price: 2.89,
        category: "Beverages",
        image: "food_7.png"
    },
    {
        name: "Laundry Bleach",
        description: "2 Litre bottle of laundry bleach",
        price: 3.55,
        category: "Home",
        image: "food_8.png"
    },
    {
        name: "Garbage Bags Large",
        description: "Pack of 50 large garbage bags",
        price: 5.00,
        category: "Home",
        image: "food_9.png"
    },
    {
        name: "Dry Dog Food",
        description: "5 kg pack of premium dry dog food",
        price: 5.95,
        category: "Pet-food",
        image: "food_10.png"
    },
    {
        name: "Cat Food",
        description: "500g tin of premium cat food",
        price: 2.00,
        category: "Pet-food",
        image: "food_11.png"
    }
];

// Function to add food items
const addGroceryItems = async () => {
    try {
        await connectDB();
        console.log("Connected to database");

        // Clear existing food items
        await foodModel.deleteMany({});
        console.log("Cleared existing food items");

        // Add new food items
        await foodModel.insertMany(groceryItems);
        console.log("Added sample grocery items");

        mongoose.connection.close();
        console.log("Database connection closed");
    } catch (error) {
        console.error("Error:", error);
    }
};

// Run the function
addGroceryItems();