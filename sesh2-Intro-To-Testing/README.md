# Calculator Vitest Exercises

Dette projekt er en calculator-app bygget til at lære unit testing med **Vitest**.

## 📁 Projektstruktur

```
sesh2-Intro-To-Testing/
├── files/                          # Kildekode (det vi tester)
│   ├── calculator_backend.ts       # Beregningslogik (pure functions)
│   └── calculator_frontend_react.jsx  # React komponenter
├── tests/                          # Test-filer
│   ├── setup.ts                    # Test setup (køres før tests)
│   └── calculator_frontend_react.test.jsx # React tests
├── styles/
│   └── calculator.css              # Styling
├── index.html                      # React calculator entry
├── main.jsx                        # React app entry point
├── vite.config.ts                  # Vite + Vitest konfiguration
├── tsconfig.json                   # TypeScript konfiguration
└── package.json                    # Dependencies
```

## 🚀 Kom i gang

### 1. Installer dependencies

```bash
npm install
```

### 2. Kør tests

```bash
# Kør alle tests én gang
npm test

# Kør tests i watch mode (gentester ved ændringer)
npm test -- --watch

# Kør tests med UI
npm run test:ui

# Kør tests med code coverage
npm run test:coverage
```

### 3. Start udviklings-server (for at se calculatoren)

```bash
npm run dev
```

## 🔧 Nyttige Vitest features

### Basic assertions
```javascript
expect(result).toBe(5)          // Strict equality
expect(result).toEqual({a: 1})  // Deep equality
expect(result).toBeTruthy()     // Truthy check
expect(result).toBeNull()       // Null check
```

### Error testing
```javascript
expect(() => divide(1, 0)).toThrow()
expect(() => divide(1, 0)).toThrow('Cannot divide by zero')
```

### Async testing
```javascript
it('async test', async () => {
  const result = await fetchData()
  expect(result).toBe('data')
})
```

### Mocking
```javascript
import { vi } from 'vitest'

const mockFn = vi.fn()
mockFn.mockReturnValue(42)
```

## 💡 Tips

1. **Start med simple tests** - test én ting ad gangen
2. **Brug `describe` blokke** - gruppér relaterede tests
3. **Test edge cases** - nul, negative tal, tomme inputs
4. **Test fejl-scenarier** - hvad sker når noget går galt?
5. **Kør tests ofte** - brug watch mode under udvikling

## 📚 Ressourcer

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
