/**
 * FACIT: Author Model - Komplet løsning
 * 
 * BEMÆRK: Denne fil er til underviserbrug!
 * Gem den separat eller slet før distribution til studerende.
 */

import mongoose, { model, Types, type InferSchemaType } from "mongoose";

const currentYear = new Date().getFullYear();

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      sparse: true, // Allows multiple null values (for optional unique)
      match: [/@/, "Please provide a valid email address containing '@'"],
    },
    nationality: {
      type: String,
      trim: true,
    },
    birthYear: {
      type: Number,
      min: [1800, "Birth year must be at least 1800"],
      max: [currentYear, `Birth year cannot be greater than ${currentYear}`],
    },
    biography: {
      type: String,
      maxLength: [1000, "Biography must be at most 1000 characters"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Create index for faster lookups
authorSchema.index({ name: 1 });

export type AuthorType = InferSchemaType<typeof authorSchema> & {
  _id: Types.ObjectId;
};

export default model<AuthorType>("Author", authorSchema);
