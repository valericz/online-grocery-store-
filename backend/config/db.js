import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://valerieznb:eFV8nn7MfCbbz0md@cluster.m9i61xa.mongodb.net/');
        console.log("DB Connected");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};


// add your mongoDB connection string above.
// Do not use '@' symbol in your databse user's password else it will show an error.