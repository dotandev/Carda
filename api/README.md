# 📚 Carda Backend

A backend service for managing patients, doctors, and genes data using **Express**, **TypeScript**, and **MongoDB**.

---

## 🚀 Getting Started

### 🛠 Installation

```bash
git clone https://github.com/dotandev/carda.git
cd doctories
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
doctories-backend/
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
MONGO_URI=mongodb://localhost:27017/doctories
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
      "path": "/doctors",
      "description": "Get all doctors"
    },
    {
      "method": "GET",
      "path": "/doctors/:doctorId",
      "description": "Get a single doctor by ID"
    },
    {
      "method": "GET",
      "path": "/doctors/slug/:slug",
      "description": "Get a single doctor by slug"
    },
    {
      "method": "GET",
      "path": "/doctors/:doctorId/patients",
      "description": "Get patients of a doctor"
    },
    {
      "method": "GET",
      "path": "/doctors/:doctorId/genes",
      "description": "Get genes of a doctor"
    },
    {
      "method": "POST",
      "path": "/doctors",
      "auth": true,
      "description": "Create a new doctor"
    },
    {
      "method": "PUT",
      "path": "/doctors/:doctorId",
      "auth": true,
      "description": "Update a doctor"
    },
    {
      "method": "DELETE",
      "path": "/doctors/:doctorId",
      "auth": true,
      "description": "Delete a doctor"
    },
    {
      "method": "PATCH",
      "path": "/doctors/:doctorId/patients",
      "auth": true,
      "description": "Assign patients to a doctor"
    },
    {
      "method": "PATCH",
      "path": "/doctors/:doctorId/genes",
      "auth": true,
      "description": "Assign genes to a doctor"
    },
    {
      "method": "DELETE",
      "path": "/doctors/:doctorId/patients",
      "auth": true,
      "description": "Remove patients from a doctor"
    },
    {
      "method": "DELETE",
      "path": "/doctors/:doctorId/genes",
      "auth": true,
      "description": "Remove genes from a doctor"
    }
  ]
}
```

---

## ✅ Features

-  JWT-based authentication
-  CRUD operations for doctors, patients, and genes
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
