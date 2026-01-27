/**
 * Author Model - Mongoose Schema Øvelse
 * 
 * OPGAVE: Definér et Mongoose schema til en forfatter med følgende felter:
 * 
 * - name (String, required)
 * - email (String, unique, lowercase, validér med regex for @)
 * - nationality (String)
 * - birthYear (Number, min: 1800, max: nuværende år)
 * - biography (String, max 1000 tegn)
 * - isActive (Boolean, default: true)
 * 
 * Se eksempel fra kandidatportalen (User.ts) for inspiration til email validering!
 */

import mongoose, { model, Types, type InferSchemaType } from "mongoose";

// TODO: Definér authorSchema her
const authorSchema = new mongoose.Schema(
  {
    // Tilføj felter her
  },
  { 
    timestamps: true 
  }
);

// TODO: Definér og eksportér TypeScript type
export type AuthorType = InferSchemaType<typeof authorSchema> & {
  _id: Types.ObjectId;
};

// TODO: Eksportér modellen
export default model<AuthorType>("Author", authorSchema);
