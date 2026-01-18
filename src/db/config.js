import mongoose from "mongoose";

export const dbConfig = async (URL) => {
  try {
    await mongoose.connect(URL);
    console.log(`Connected to MongoDB`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
