/**
 * FACIT: Book Model - Komplet løsning
 * 
 * BEMÆRK: Denne fil er til underviserbrug!
 * Gem den separat eller slet før distribution til studerende.
 */

import mongoose, { model, Types, type InferSchemaType } from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      maxLength: [200, "Title must be at most 200 characters"],
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: [true, "Author is required"],
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be at least 0"],
    },
    pages: {
      type: Number,
      min: [1, "Pages must be at least 1"],
    },
    genres: {
      type: [String],
      default: [],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    publishedDate: {
      type: Date,
    },
    // BONUS: Slug field
    slug: {
      type: String,
    },
  },
  { timestamps: true }
);

// BONUS: Pre-save middleware til at generere slug
bookSchema.pre("save", function(next) {
  if (this.isModified("title") && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9æøå]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

// Create index for faster lookups
bookSchema.index({ isbn: 1 });
bookSchema.index({ author: 1 });

export type BookType = InferSchemaType<typeof bookSchema> & {
  _id: Types.ObjectId;
};

export default model<BookType>("Book", bookSchema);
