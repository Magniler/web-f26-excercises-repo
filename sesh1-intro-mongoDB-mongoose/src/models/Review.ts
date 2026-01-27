/**
 * Review Model - Mongoose Schema Øvelse med Embedded Documents
 * 
 * OPGAVE: Definér et Mongoose schema til en anmeldelse med:
 * 
 * 1. Et embedded sub-schema for reviewer:
 *    - name (String, required)
 *    - email (String)
 *    - Brug { _id: false } option
 * 
 * 2. Hovedschema med:
 *    - book (ObjectId reference til Book, required)
 *    - reviewer (embedded reviewerSchema)
 *    - rating (Number, required, min: 1, max: 5)
 *    - comment (String, maxLength: 500)
 * 
 * Se eksempel fra kandidatportalen (Candidate.ts) for inspiration til embedded documents!
 */

import mongoose, { model, Types, type InferSchemaType } from "mongoose";

// TODO: Definér reviewerSchema (sub-schema) her
const reviewerSchema = new mongoose.Schema(
  {
    // Tilføj felter her
  },
  { _id: false }
);

// TODO: Definér reviewSchema her
const reviewSchema = new mongoose.Schema(
  {
    // Tilføj felter her
    // Husk at bruge reviewerSchema som type for reviewer feltet
  },
  { 
    timestamps: true 
  }
);

// TypeScript types
export type ReviewerType = InferSchemaType<typeof reviewerSchema>;

export type ReviewType = InferSchemaType<typeof reviewSchema> & {
  _id: Types.ObjectId;
};

// TODO: Eksportér modellen
export default model<ReviewType>("Review", reviewSchema);
