/**
 * Tests for Review Schema
 * 
 * Disse tests verificerer at Review schema er korrekt implementeret.
 * Kør med: npm run test:review
 */

import { describe, it, expect } from "vitest";
import "./setup";
import Review from "../src/models/Review";
import Book from "../src/models/Book";
import mongoose from "mongoose";

describe("Review Schema", () => {
  describe("Schema Definition", () => {
    it("should have required fields defined", () => {
      const paths = Review.schema.paths;
      
      expect(paths.book).toBeDefined();
      expect(paths.rating).toBeDefined();
    });

    it("should have embedded reviewer schema", () => {
      const paths = Review.schema.paths;
      
      expect(paths["reviewer.name"]).toBeDefined();
      expect(paths["reviewer.email"]).toBeDefined();
    });

    it("should have optional fields defined", () => {
      const paths = Review.schema.paths;
      
      expect(paths.comment).toBeDefined();
    });

    it("should have timestamps enabled", () => {
      const paths = Review.schema.paths;
      
      expect(paths.createdAt).toBeDefined();
      expect(paths.updatedAt).toBeDefined();
    });
  });

  describe("Validation", () => {
    const validBookId = new mongoose.Types.ObjectId();

    it("should require book reference", async () => {
      const review = new Review({
        reviewer: { name: "Test Reviewer" },
        rating: 5,
      });

      await expect(review.validate()).rejects.toThrow(/book/i);
    });

    it("should require rating", async () => {
      const review = new Review({
        book: validBookId,
        reviewer: { name: "Test Reviewer" },
      });

      await expect(review.validate()).rejects.toThrow(/rating/i);
    });

    it("should require reviewer name", async () => {
      const review = new Review({
        book: validBookId,
        reviewer: { email: "test@test.com" },
        rating: 5,
      });

      await expect(review.validate()).rejects.toThrow(/name/i);
    });

    it("should enforce minimum rating of 1", async () => {
      const review = new Review({
        book: validBookId,
        reviewer: { name: "Test Reviewer" },
        rating: 0,
      });

      await expect(review.validate()).rejects.toThrow();
    });

    it("should enforce maximum rating of 5", async () => {
      const review = new Review({
        book: validBookId,
        reviewer: { name: "Test Reviewer" },
        rating: 6,
      });

      await expect(review.validate()).rejects.toThrow();
    });

    it("should accept valid ratings 1-5", async () => {
      for (const rating of [1, 2, 3, 4, 5]) {
        const review = new Review({
          book: validBookId,
          reviewer: { name: "Test Reviewer" },
          rating,
        });

        await expect(review.validate()).resolves.toBeUndefined();
      }
    });

    it("should enforce comment max length of 500", async () => {
      const review = new Review({
        book: validBookId,
        reviewer: { name: "Test Reviewer" },
        rating: 5,
        comment: "A".repeat(501),
      });

      await expect(review.validate()).rejects.toThrow();
    });
  });

  describe("Embedded Documents", () => {
    const validBookId = new mongoose.Types.ObjectId();

    it("should not create _id for embedded reviewer", async () => {
      const review = new Review({
        book: validBookId,
        reviewer: { name: "Test Reviewer", email: "test@test.com" },
        rating: 5,
      });

      // Reviewer should not have _id due to { _id: false }
      expect(review.reviewer).toBeDefined();
      expect((review.reviewer as any)._id).toBeUndefined();
    });

    it("should store embedded reviewer data correctly", async () => {
      const review = new Review({
        book: validBookId,
        reviewer: { 
          name: "John Doe", 
          email: "john@example.com" 
        },
        rating: 4,
        comment: "Great book!",
      });

      const savedReview = await review.save();
      
      expect(savedReview.reviewer?.name).toBe("John Doe");
      expect(savedReview.reviewer?.email).toBe("john@example.com");
    });
  });

  describe("CRUD Operations", () => {
    it("should create and save a valid review", async () => {
      // First create a book to reference
      const book = await Book.create({
        title: "Test Book",
        author: new mongoose.Types.ObjectId(),
        isbn: "978-0-13-468599-1",
        price: 299,
      });

      const reviewData = {
        book: book._id,
        reviewer: {
          name: "Alice Smith",
          email: "alice@example.com",
        },
        rating: 5,
        comment: "Absolutely fantastic read!",
      };

      const review = new Review(reviewData);
      const savedReview = await review.save();

      expect(savedReview._id).toBeDefined();
      expect(savedReview.rating).toBe(5);
      expect(savedReview.reviewer?.name).toBe("Alice Smith");
    });

    it("should populate book reference", async () => {
      const book = await Book.create({
        title: "Populatable Book",
        author: new mongoose.Types.ObjectId(),
        isbn: "978-0-13-468599-2",
        price: 399,
      });

      await Review.create({
        book: book._id,
        reviewer: { name: "Reviewer" },
        rating: 4,
      });

      const reviewWithBook = await Review.findOne({ rating: 4 }).populate("book");
      
      expect(reviewWithBook?.book).toBeDefined();
      expect((reviewWithBook?.book as any).title).toBe("Populatable Book");
    });
  });
});
