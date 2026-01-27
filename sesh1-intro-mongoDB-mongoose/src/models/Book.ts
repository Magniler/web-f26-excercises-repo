/**
 * Book Model - Mongoose Schema Øvelse
 * 
 * OPGAVE: Definér et Mongoose schema til en bog med følgende felter:
 * 
 * - title (String, required, max 200 tegn)
 * - author (ObjectId reference til Author, required)
 * - isbn (String, unique, required)
 * - price (Number, required, minimum 0)
 * - pages (Number, minimum 1)
 * - genres (Array af Strings)
 * - inStock (Boolean, default: true)
 * - publishedDate (Date)
 * - slug (String) - BONUS: Generér automatisk fra title
 * 
 * Husk at:
 * 1. Importere mongoose og nødvendige typer
 * 2. Definere schema med korrekte typer og validering
 * 3. Tilføje timestamps option
 * 4. Eksportere TypeScript type med InferSchemaType
 * 5. Eksportere modellen som default
 */

import mongoose, { model, Types, type InferSchemaType } from "mongoose";

// TODO: Definér bookSchema her
const bookSchema = new mongoose.Schema(
  {
    // Tilføj felter her
  },
  { 
    timestamps: true 
  }
);

// BONUS: Tilføj pre-save middleware til at generere slug
// bookSchema.pre("save", function(next) {
//   ...
// });

// TODO: Definér og eksportér TypeScript type
export type BookType = InferSchemaType<typeof bookSchema> & {
  _id: Types.ObjectId;
};

// TODO: Eksportér modellen
export default model<BookType>("Book", bookSchema);
