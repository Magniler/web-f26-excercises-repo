/**
 * FACIT: Review Model - Komplet løsning
 * 
 * BEMÆRK: Denne fil er til underviserbrug!
 * Gem den separat eller slet før distribution til studerende.
 */

import mongoose, { model, Types, type InferSchemaType } from "mongoose";

// Sub-schema for reviewer (embedded document)
const reviewerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Reviewer name is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  { _id: false } // Ingen separat _id for embedded docs
);

const reviewSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Book reference is required"],
    },
    reviewer: {
      type: reviewerSchema,
      required: [true, "Reviewer information is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
    },
    comment: {
      type: String,
      maxLength: [500, "Comment must be at most 500 characters"],
    },
  },
  { timestamps: true }
);

// Create index for faster lookups
reviewSchema.index({ book: 1 });
reviewSchema.index({ rating: 1 });

export type ReviewerType = InferSchemaType<typeof reviewerSchema>;

export type ReviewType = InferSchemaType<typeof reviewSchema> & {
  _id: Types.ObjectId;
};

export default model<ReviewType>("Review", reviewSchema);
