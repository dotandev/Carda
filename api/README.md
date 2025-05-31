# 📚 Bookies Backend

A backend service for managing books, authors, and genres using **Express**, **TypeScript**, and **MongoDB**.

---

## 🚀 Getting Started

### 🛠 Installation

```bash
git clone https://github.com/dotandev/bookies.git
cd bookies
npm install
```

### ▶️ Run the app

```bash
npm run begin
```

> This will compile TypeScript and start the development server on `http://localhost:9999`.

---

##  Project Structure

```
bookies-backend/
├── src/
│   ├── controllers/       # Business logic
│   ├── models/            # Mongoose models
│   ├── routes/            # Express routes
│   ├── validators/        # Joi validation classes
│   ├── middlewares/       # Auth, error handling, etc.
│   ├── types/             # TypeScript interfaces
│   └── index.ts           # App entry point
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

---

## Environment Variables

Create a `.env` file in the root:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/bookies
JWT_SECRET=your-secret
```

---

##  API Reference (JSON Format)

Below is the API reference in JSON format. You can load this into tools like Postman, Swagger, or any OpenAPI-compatible viewer.

```json
{
  "baseUrl": "http://localhost:9999",
  "endpoints": [
    {
      "method": "GET",
      "path": "/books",
      "description": "Get all books"
    },
    {
      "method": "GET",
      "path": "/books/:bookId",
      "description": "Get a single book by ID"
    },
    {
      "method": "GET",
      "path": "/books/slug/:slug",
      "description": "Get a single book by slug"
    },
    {
      "method": "GET",
      "path": "/books/:bookId/authors",
      "description": "Get authors of a book"
    },
    {
      "method": "GET",
      "path": "/books/:bookId/genres",
      "description": "Get genres of a book"
    },
    {
      "method": "POST",
      "path": "/books",
      "auth": true,
      "description": "Create a new book"
    },
    {
      "method": "PUT",
      "path": "/books/:bookId",
      "auth": true,
      "description": "Update a book"
    },
    {
      "method": "DELETE",
      "path": "/books/:bookId",
      "auth": true,
      "description": "Delete a book"
    },
    {
      "method": "PATCH",
      "path": "/books/:bookId/authors",
      "auth": true,
      "description": "Assign authors to a book"
    },
    {
      "method": "PATCH",
      "path": "/books/:bookId/genres",
      "auth": true,
      "description": "Assign genres to a book"
    },
    {
      "method": "DELETE",
      "path": "/books/:bookId/authors",
      "auth": true,
      "description": "Remove authors from a book"
    },
    {
      "method": "DELETE",
      "path": "/books/:bookId/genres",
      "auth": true,
      "description": "Remove genres from a book"
    }
  ]
}
```

---

## ✅ Features

-  JWT-based authentication
-  CRUD operations for books, authors, and genres
-  Joi validators for robust input validation
- RESTful API structure
-  Typed with TypeScript
-  MongoDB with Mongoose

---

## 📦 Scripts

| Script         | Description              |
|----------------|--------------------------|
| `npm run begin`| Compile & run app        |

---

## 🧙‍♂️ Developer Notes

- Stick to the validator interface for input validation.
- Authentication middleware wraps all protected routes.
- Uses custom router abstraction for typed handlers.
- Built to scale — clean folder structure, extendable handlers, decoupled logic.

---

## 📬 Contributions

PRs are welcome. If you see something off, fork it, fix it, and send a PR.

---

## 📄 License

MIT License © 2025 dotandev
