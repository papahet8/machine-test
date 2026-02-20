# Machine Test Assignment - Product Dashboard

## Project Overview

This is a full-stack web application designed to manage and visualize product analytics. It provides a comprehensive dashboard with interactive charts, a paginated product list with search/filter capabilities, and a CSV file upload feature for bulk data ingestion.

## Tech Stack

### Frontend
- **Framework:** React (Vite)
- **State Management:** Redux Toolkit
- **UI Library:** Material UI (MUI)
- **Charts:** Recharts
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **File Handling:** Multer (Uploads), csv-parser/xlsx (Data Processing)

## Prerequisites

Before running the application, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [PostgreSQL](https://www.postgresql.org/)

## Installation & Setup

### 1. Database Setup

1.  Open your PostgreSQL client (e.g., pgAdmin or terminal).
2.  Create a new database (e.g., `product_db`).
3.  The application will automatically create the necessary `products` table upon starting the server.

### 2. Backend Setup

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `server` directory with your database credentials:
    ```env
    PORT=5003
    DB_USER=postgres
    DB_HOST=localhost
    DB_NAME=sales_db
    DB_PASSWORD=123456
    DB_PORT=5432
    ```
4.  Start the server:
    ```bash
    npm start
    ```
    The server will run on `http://localhost:5003`.

### 3. Frontend Setup

1.  Open a new terminal and navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Features

- **Dashboard Analytics:**
    - View total products, average ratings, and total reviews.
    - **Charts:**
        - Products per Category (Bar Chart)
        - Top Reviewed Products (Bar Chart)
        - Discount Distribution (Histogram)
        - Category-wise Average Rating (Bar Chart)

- **Product Management:**
    - **File Upload:** Upload CSV files to bulk import product data.
    - **Product List:** View products in a paginated table.
    - **Search & Filter:** Search by product name and filter by category or review content.

## Project Structure

```
machine-test/
├── client/                 # Frontend (React/Vite)
│   ├── src/
│   │   ├── components/     # UI Components (Charts, Tables, etc.)
│   │   ├── features/       # Redux Slices
│   │   └── ...
├── server/                 # Backend (Node/Express)
│   ├── routes/             # API Routes (dashboard, products, upload)
│   ├── db.js               # Database Connection
│   └── ...
└── README.md               # Project Documentation
```
