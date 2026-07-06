# SynergySphere Setup Guide

Follow these instructions to set up and run the SynergySphere platform locally for development and testing.

## Prerequisites

Ensure you have the following installed on your machine:
* **Python 3.10+** (for the FastAPI backend)
* **Node.js 18+** (for the Next.js frontend)
* **MongoDB** (running locally or a cloud instance like MongoDB Atlas)

---

## 1. Backend Setup

The backend is built with FastAPI and MongoDB.

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   * **Windows:**
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```
   * **macOS/Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install dependencies:**
   From the root of the project (if `requirements.txt` is in the root) or copy it to the backend folder:
   ```bash
   pip install -r ../requirements.txt
   ```

4. **Configure Environment Variables:**
   Create a `.env` file in the `backend/` directory with the following variables:
   ```env
   SECRET_KEY=your_super_secret_jwt_key
   MONGO_URI=mongodb://localhost:27017
   DB_NAME=synergysphere
   ```
   *(Update `MONGO_URI` if you are using MongoDB Atlas).*

5. **Initialize the Database:**
   Run the initialization script to set up collections, schema validation, and indexes.
   ```bash
   python init_db.py
   ```

6. **Start the Backend Server:**
   ```bash
   python main.py
   ```
   The API will be accessible at `http://localhost:8000`. You can view the interactive API documentation at `http://localhost:8000/docs`.

---

## 2. Frontend Setup

The frontend is built with Next.js and Tailwind CSS.

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   You can use `npm`, `yarn`, or `pnpm` (the project lockfile suggests `npm` and `pnpm`).
   ```bash
   npm install
   ```
   *or*
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables (Optional but recommended):**
   If you need to define the backend API URL for the frontend, create a `.env.local` file in the `frontend/` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

---

## 3. Usage & Testing

1. Open `http://localhost:3000` in your browser.
2. Register a new user account.
3. Create a new organization.
4. Start creating projects and tasks, and add comments to explore the platform's capabilities.
