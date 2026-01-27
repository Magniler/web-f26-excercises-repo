/**
 * Tests for Author Schema
 * 
 * Disse tests verificerer at Author schema er korrekt implementeret.
 * Kør med: npm run test:author
 */

import { describe, it, expect } from "vitest";
import "./setup";
import Author from "../src/models/Author";

describe("Author Schema", () => {
  describe("Schema Definition", () => {
    it("should have required fields defined", () => {
      const paths = Author.schema.paths;
      
      expect(paths.name).toBeDefined();
    });

    it("should have optional fields defined", () => {
      const paths = Author.schema.paths;
      
      expect(paths.email).toBeDefined();
      expect(paths.nationality).toBeDefined();
      expect(paths.birthYear).toBeDefined();
      expect(paths.biography).toBeDefined();
      expect(paths.isActive).toBeDefined();
    });

    it("should have timestamps enabled", () => {
      const paths = Author.schema.paths;
      
      expect(paths.createdAt).toBeDefined();
      expect(paths.updatedAt).toBeDefined();
    });
  });

  describe("Validation", () => {
    it("should require name", async () => {
      const author = new Author({
        email: "test@example.com",
      });

      await expect(author.validate()).rejects.toThrow(/name/i);
    });

    it("should validate email format with @", async () => {
      const author = new Author({
        name: "Test Author",
        email: "invalid-email",
      });

      await expect(author.validate()).rejects.toThrow();
    });

    it("should accept valid email", async () => {
      const author = new Author({
        name: "Test Author",
        email: "valid@example.com",
      });

      await expect(author.validate()).resolves.toBeUndefined();
    });

    it("should convert email to lowercase", async () => {
      const author = new Author({
        name: "Test Author",
        email: "TEST@EXAMPLE.COM",
      });

      await author.validate();
      expect(author.email).toBe("test@example.com");
    });

    it("should enforce birthYear minimum of 1800", async () => {
      const author = new Author({
        name: "Test Author",
        birthYear: 1799,
      });

      await expect(author.validate()).rejects.toThrow();
    });

    it("should enforce birthYear maximum", async () => {
      const author = new Author({
        name: "Test Author",
        birthYear: 3000, // Unlikely future year
      });

      await expect(author.validate()).rejects.toThrow();
    });

    it("should enforce biography max length of 1000", async () => {
      const author = new Author({
        name: "Test Author",
        biography: "A".repeat(1001),
      });

      await expect(author.validate()).rejects.toThrow();
    });
  });

  describe("Defaults", () => {
    it("should default isActive to true", () => {
      const author = new Author({
        name: "Test Author",
      });

      expect(author.isActive).toBe(true);
    });
  });

  describe("CRUD Operations", () => {
    it("should create and save a valid author", async () => {
      const authorData = {
        name: "Robert C. Martin",
        email: "uncle.bob@cleancode.com",
        nationality: "American",
        birthYear: 1952,
        biography: "Known as Uncle Bob, a software engineer and author.",
        isActive: true,
      };

      const author = new Author(authorData);
      const savedAuthor = await author.save();

      expect(savedAuthor._id).toBeDefined();
      expect(savedAuthor.name).toBe("Robert C. Martin");
      expect(savedAuthor.email).toBe("uncle.bob@cleancode.com");
    });

    it("should find author by name", async () => {
      await Author.create({
        name: "Martin Fowler",
        nationality: "British",
      });

      const found = await Author.findOne({ name: "Martin Fowler" });
      expect(found).not.toBeNull();
      expect(found?.nationality).toBe("British");
    });

    it("should enforce unique email", async () => {
      await Author.create({
        name: "Author One",
        email: "unique@test.com",
      });

      const duplicate = new Author({
        name: "Author Two",
        email: "unique@test.com",
      });

      await expect(duplicate.save()).rejects.toThrow();
    });
  });
});
