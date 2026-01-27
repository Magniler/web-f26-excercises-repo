/**
 * Tests for Book Schema
 * 
 * Disse tests verificerer at Book schema er korrekt implementeret.
 * Kør med: npm run test:book
 */

import { describe, it, expect } from "vitest";
import "./setup";
import Book from "../src/models/Book";

describe("Book Schema", () => {
  describe("Schema Definition", () => {
    it("should have required fields defined", () => {
      const paths = Book.schema.paths;
      
      expect(paths.title).toBeDefined();
      expect(paths.author).toBeDefined();
      expect(paths.isbn).toBeDefined();
      expect(paths.price).toBeDefined();
    });

    it("should have optional fields defined", () => {
      const paths = Book.schema.paths;
      
      expect(paths.pages).toBeDefined();
      expect(paths.genres).toBeDefined();
      expect(paths.inStock).toBeDefined();
      expect(paths.publishedDate).toBeDefined();
    });

    it("should have timestamps enabled", () => {
      const paths = Book.schema.paths;
      
      expect(paths.createdAt).toBeDefined();
      expect(paths.updatedAt).toBeDefined();
    });
  });

  describe("Validation", () => {
    it("should require title", async () => {
      const book = new Book({
        author: "507f1f77bcf86cd799439011",
        isbn: "978-0-13-468599-1",
        price: 299,
      });

      await expect(book.validate()).rejects.toThrow(/title/i);
    });

    it("should require isbn", async () => {
      const book = new Book({
        title: "Test Book",
        author: "507f1f77bcf86cd799439011",
        price: 299,
      });

      await expect(book.validate()).rejects.toThrow(/isbn/i);
    });

    it("should require price", async () => {
      const book = new Book({
        title: "Test Book",
        author: "507f1f77bcf86cd799439011",
        isbn: "978-0-13-468599-1",
      });

      await expect(book.validate()).rejects.toThrow(/price/i);
    });

    it("should require author", async () => {
      const book = new Book({
        title: "Test Book",
        isbn: "978-0-13-468599-1",
        price: 299,
      });

      await expect(book.validate()).rejects.toThrow(/author/i);
    });

    it("should enforce minimum price of 0", async () => {
      const book = new Book({
        title: "Test Book",
        author: "507f1f77bcf86cd799439011",
        isbn: "978-0-13-468599-1",
        price: -10,
      });

      await expect(book.validate()).rejects.toThrow();
    });

    it("should enforce minimum pages of 1", async () => {
      const book = new Book({
        title: "Test Book",
        author: "507f1f77bcf86cd799439011",
        isbn: "978-0-13-468599-1",
        price: 299,
        pages: 0,
      });

      await expect(book.validate()).rejects.toThrow();
    });

    it("should enforce max title length of 200", async () => {
      const book = new Book({
        title: "A".repeat(201),
        author: "507f1f77bcf86cd799439011",
        isbn: "978-0-13-468599-1",
        price: 299,
      });

      await expect(book.validate()).rejects.toThrow();
    });
  });

  describe("Defaults", () => {
    it("should default inStock to true", () => {
      const book = new Book({
        title: "Test Book",
        author: "507f1f77bcf86cd799439011",
        isbn: "978-0-13-468599-1",
        price: 299,
      });

      expect(book.inStock).toBe(true);
    });

    it("should default genres to empty array", () => {
      const book = new Book({
        title: "Test Book",
        author: "507f1f77bcf86cd799439011",
        isbn: "978-0-13-468599-1",
        price: 299,
      });

      expect(book.genres).toEqual([]);
    });
  });

  describe("CRUD Operations", () => {
    it("should create and save a valid book", async () => {
      const bookData = {
        title: "Clean Code",
        author: "507f1f77bcf86cd799439011",
        isbn: "978-0-13-235088-4",
        price: 299.95,
        pages: 464,
        genres: ["programming", "software engineering"],
        inStock: true,
        publishedDate: new Date("2008-08-01"),
      };

      const book = new Book(bookData);
      const savedBook = await book.save();

      expect(savedBook._id).toBeDefined();
      expect(savedBook.title).toBe("Clean Code");
      expect(savedBook.price).toBe(299.95);
      expect(savedBook.genres).toContain("programming");
    });

    it("should find book by title", async () => {
      await Book.create({
        title: "Test Book",
        author: "507f1f77bcf86cd799439011",
        isbn: "978-0-13-468599-1",
        price: 199,
      });

      const found = await Book.findOne({ title: "Test Book" });
      expect(found).not.toBeNull();
      expect(found?.title).toBe("Test Book");
    });
  });
});
