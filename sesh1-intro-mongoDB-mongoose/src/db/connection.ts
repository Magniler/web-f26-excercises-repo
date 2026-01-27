/**
 * Database Connection Helper
 * 
 * Denne fil håndterer forbindelse til MongoDB.
 * I tests bruger vi mongodb-memory-server til at køre en in-memory database.
 */

import mongoose from "mongoose";

export async function connectDb(uri: string) {
  // I development/test: tillad at modeller overskrives
  mongoose.set("overwriteModels", true);

  // Tjek om der allerede er en forbindelse
  const readyState = mongoose.connection.readyState;
  if (readyState === 1) {
    console.log("Mongoose: Re-using existing connection");
    return;
  }

  // Forbind til MongoDB
  await mongoose.connect(uri);
  console.log("Mongoose: Connected to database");
}

export async function disconnectDb() {
  await mongoose.connection.close();
  console.log("Mongoose: Disconnected from database");
}

export async function clearDb() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}
