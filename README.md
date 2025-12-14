# 📚 NGO Impact Tracker Application

This application is designed to help NGOs submit monthly reports (individually or in bulk via CSV) and provides an authenticated dashboard for administrators to track aggregated impact metrics. The backend is designed for scalability, featuring asynchronous background processing for bulk uploads and database idempotency to prevent double-counting.

## 🔗 Live Demo & Credentials

The application is deployed live with the following details:

| Component | Link |
| **Frontend Demo Link** | **`https://ngos-report-managment.vercel.app/dashboard`** |
| **Backend Demo Link** | **`https://ngos-report-managment-1.onrender.com`**

### Admin Demo Credentials

To access the secured **Admin Dashboard** on the live link or locally:

| Field | Value |
| **Username** | `admin` |
| **Password** | `password123` |

***Note:** The Vercel frontend relies on a separate backend API deployed on Render to function.*

## 🚀 1. Tech Stack

| Component | Technology | Rationale / Key Feature |

| **Frontend** | **React** (Vite) + **Tailwind CSS** | Modern UI framework with utility-first CSS for fast, responsive development. |
| **Backend** | **Node.js** (Express) | High-performance, minimalist server environment. |
| **Database** | **SQLite** | Chosen for ease of installation, setup, and portability during development. |
| **Asynchronous Jobs** | **In-memory Queue** | Handles bulk CSV file processing in the background, preventing HTTP timeouts. |
| **Security** | **dotenv** + **Token Middleware** | Secure handling of secrets and protected API routes for the dashboard. |

## ⚙️ 2. Setup Instructions

The project is structured into two folders: `backend` (Node.js API) and `frontend` (React Application).

### Prerequisites

* Node.js (v18+) and npm
* Git (for version control)

### 2.1. Backend Setup

1.  **Navigate to Backend:**
    ```bash
    cd backend
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Create `.env` File:**
    Create a file named **`.env`** in the `backend` directory. This is crucial for security.
    ```env
    # Replace this with a strong, random key generated using:
    # node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
    ADMIN_API_KEY=YOUR_GENERATED_API_KEY_HERE
    ADMIN_USERNAME=admin
    ADMIN_PASSWORD=password123
    PORT=3000
    ```
4.  **Start Server:**
    ```bash
    npm start
    ```
    The server will run on `http://localhost:3000`. The `impact.db` file will be created automatically.

### 2.2. Frontend Setup

1.  **Navigate to Frontend:**
    ```bash
    cd frontend
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Create `.env` File:**
    Create a file named **`.env`** in the `frontend` directory. The variable must be prefixed with `VITE_` for Vite to expose it to the browser.
    ```env
    # IMPORTANT: Use the URL where your backend is running/deployed (e.g., http://localhost:3000)
    VITE_REACT_APP_API_BASE_URL=http://localhost:3000 
    ```
4.  **Start Development Server:**
    ```bash
    npm run dev
    ```
    The application will open in your browser, typically at `http://localhost:5173`.

## 📊 3. Key Application Features

### Report Submission
* **Single Report:** Direct form submission to `/api/report`.
* **Bulk Upload:** Allows submission of a CSV file.
    * **Required CSV Headers:** `ngo_id,month,people_helped,events_conducted,funds_utilized`
    * **Asynchronous Processing:** The server immediately returns a `job_id` and processes rows in the background.
    * **Partial Failure Handling:** Invalid rows are logged as failures, but processing continues for valid rows.
    * **Idempotency:** The database ensures reports are not double-counted using a unique constraint on (`ngo_id`, `month`).

### Admin Dashboard
* **Authenticated Access:** Access is protected by a Bearer Token (Admin Login required).
* **Filtering:** Data is filtered by the selected **Month**.
* **Summary View:** Displays aggregated totals (Total NGOs Reporting, People Helped, Events Conducted, Funds Utilized).

## 🗃️ 4. API Endpoints

| Endpoint | Method | Security | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/login` | `POST` | Open | Authenticate Admin credentials and receive the API Bearer Token. |
| `/api/report` | `POST` | Open | Submits a single report record. |
| `/api/reports/upload` | `POST` | Open | Submits a CSV file, initiates background processing, and returns a `job_id`. |
| `/api/job-status/{job_id}` | `GET` | Open | Returns progress, status, and failure details for a bulk upload job. |
| `/api/dashboard?month=YYYY-MM` | `GET` | **Protected** | Retrieves aggregated impact data for the specified month. |

## Screenshots of UI

**Login Page**

  Desktop View :
  <img width="1919" height="911" alt="image" src="https://github.com/user-attachments/assets/1745e7fb-b5d2-4d32-a7af-84dca8b617d5" />

  Mobile View:
  <img width="370" height="799" alt="image" src="https://github.com/user-attachments/assets/386ce046-da21-4ac0-bbeb-d168e8060542" />


**Single Report** `/api/report`

  Desktop View :
  <img width="1919" height="912" alt="image" src="https://github.com/user-attachments/assets/1d48a6ad-e6eb-43ff-9e33-e284138c2843" />

  Mobile View :
  <img width="368" height="799" alt="image" src="https://github.com/user-attachments/assets/5121aafa-7346-4574-b75e-6379dbad4474" />


**Bulk Upload** `/api/upload`

  Desktop View :
  <img width="1919" height="909" alt="image" src="https://github.com/user-attachments/assets/47207481-c02c-48a6-88f9-bc468f79ddb4" />

  Mobile View :
  <img width="368" height="799" alt="image" src="https://github.com/user-attachments/assets/c7810385-d00c-43f8-9d28-348a54d6b4b1" />


**Admin Dashboard** `/api/dashboard`

  Desktop View :
  <img width="1919" height="916" alt="image" src="https://github.com/user-attachments/assets/722fc3fb-e982-4f76-a5d7-7c7954ad3150" />

  Mobile View :
  <img width="367" height="798" alt="image" src="https://github.com/user-attachments/assets/117dbf0f-6f96-492d-8dac-afc246e64bd0" />


## Demo Screenrecord

**Link** : `https://drive.google.com/file/d/1TS84jIQYaOHi4--IPof6Euw3mNv7z4VJ/view?usp=sharing`
