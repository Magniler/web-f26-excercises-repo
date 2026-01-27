# Mongoose ODM Øvelser - WEB-SQL F26

Dette repository indeholder øvelser til introduktion af Mongoose ODM (Object Document Mapper) til MongoDB.

## 📋 Forudsætninger

- Node.js v18+ installeret
- Grundlæggende kendskab til MongoDB (fra tidligere øvelser)
- TypeScript kendskab

## 🚀 Kom i gang

1. Installér dependencies:
```bash
npm install
```

2. Kør alle tests:
```bash
npm test
```

3. Kør tests i watch-mode (opdateres ved ændringer):
```bash
npm run test:watch
```

## 📁 Projektstruktur

```
sesh1-intro-mongoDB-mongoose/
├── src/
│   ├── models/
│   │   ├── Book.ts       # 📝 Opgave 1: Definer Book schema
│   │   ├── Author.ts     # 📝 Opgave 2: Definer Author schema
│   │   └── Review.ts     # 📝 Opgave 3: Definer Review schema med embedded docs
│   ├── db/
│   │   └── connection.ts # Database connection helper
│   └── index.ts          # Barrel exports
├── tests/
│   ├── setup.ts          # Test setup (MongoDB Memory Server)
│   ├── book.test.ts      # Tests for Book schema
│   ├── author.test.ts    # Tests for Author schema
│   └── review.test.ts    # Tests for Review schema
└── package.json
```

## 📝 Opgaver

### Opgave 1: Book Schema (`src/models/Book.ts`)

Definer et Mongoose schema til en bog med følgende felter:
- `title` (String, required, max 200 tegn)
- `author` (ObjectId reference til Author, required)
- `isbn` (String, unique, required)
- `price` (Number, required, minimum 0)
- `pages` (Number, minimum 1)
- `genres` (Array af Strings)
- `inStock` (Boolean, default: true)
- `publishedDate` (Date)

Kør tests: `npm run test:book`

### Opgave 2: Author Schema (`src/models/Author.ts`)

Definer et Author schema med:
- `name` (String, required)
- `email` (String, unique, lowercase, regex validering for @)
- `nationality` (String)
- `birthYear` (Number, min: 1800, max: current year)
- `biography` (String, max 1000 tegn)
- `isActive` (Boolean, default: true)

Kør tests: `npm run test:author`

### Opgave 3: Review Schema (`src/models/Review.ts`)

Definer et Review schema med embedded documents:
- `book` (ObjectId reference, required)
- `reviewer` (embedded sub-schema med name og email)
- `rating` (Number, 1-5, required)
- `comment` (String, max 500 tegn)

Kør tests: `npm run test:review`

## 🔧 Nyttige Mongoose Koncepeter

### Schema Types
```typescript
{
  stringField: String,
  numberField: Number,
  booleanField: Boolean,
  dateField: Date,
  arrayField: [String],
  objectIdField: mongoose.Schema.Types.ObjectId
}
```

### Validering
```typescript
{
  field: {
    type: String,
    required: [true, "Fejlbesked"],
    unique: true,
    minLength: 2,
    maxLength: 100,
    enum: ["option1", "option2"],
    match: [/regex/, "Fejlbesked"]
  }
}
```

### References
```typescript
{
  authorRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author"
  }
}
```

## 📚 Ressourcer

- [Mongoose Documentation](https://mongoosejs.com/docs/guide.html)
- [Kandidatportalen kode](../candidatedk/app/db/models/) - se rigtige eksempler!
