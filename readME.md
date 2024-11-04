# 📊 Project Management Application Backend

Welcome to the **Project Management Application Backend**! 🚀 This backend service is designed to aid organizations in managing their projects efficiently. It provides a robust API for listing, creating, updating, and managing projects, users, and their permissions using **Django** and **Django REST Framework**.

## 🌟 Features

### 1. User Authentication and Authorization
- **User Registration and Login**: Enables users to register for a new account or log in with existing credentials. 
- **Token-Based Authentication**: Secures endpoints using token-based authentication (like JSON Web Tokens).
- **Role-Based Access Control (RBAC)**: Ensures users can only perform actions permitted by their roles.

### 2. CRUD Operations for Projects
- **Standard CRUD Operations**: Perform Create, Read, Update, Delete operations on projects based on permissions.
- **Project Assignment**: Assign projects to specific users within the organization.
- **Project Status Updates**: Update project status (e.g., "In Progress," "Completed," "Pending").

### 3. Organization Management with Membership Roles
- **Create and Manage Organizations**: Users can create organizations and invite others to join.
- **Membership Roles**: Supports "Admin" and "Member" roles.
- **Leave Organization**: Users can leave an organization, removing access to associated projects.

### 4. User Role-Based Access Control Using Django Guardian
- **Object-Level Permissions**: Fine-grained access control to specific projects and tasks.
- **Dynamic Permission Checking**: Checks permissions based on user's roles and memberships.

### 5. Custom Permissions for Projects and Users
- **CanAddProjectPermission**: Restricts project creation to authorized users.
- **Dynamic Permission Management**: Admins can manage user permissions efficiently.

### 6. Project Assignment to Members
- **Validation**: Ensures users are members of the organization before project assignment.

### 7. Custom Validation for Data Integrity
- **Data Integrity Checks**: Prevents actions that could compromise data integrity.

### 8. User Membership Management
- **Invite and Manage Members**: Admins can invite users and manage roles.

### 9. Commenting System for Projects
- **Add Comments**: Users can discuss and update projects through comments.

### 10. API Security and Error Handling
- **Secure Endpoints**: Ensures authenticated access to API endpoints.
- **Input Validation**: Implements input validation to prevent errors.

### 11. Docker Support
- **Dockerized Environment**: Easily set up using Docker and Docker Compose.

### 12. Unit Testing and Test Coverage
- **Automated Tests**: Comprehensive tests for core functionalities.

### 13. Flexible Role and Permission Configuration
- **Custom Roles**: Extend the system with more roles and permissions.

### 14. Real-Time Project Updates (Optional)
- **Email Notifications**: Inform users about membership changes.
- **Real-Time Updates**: Provide immediate feedback on project changes.

## 🛠️ Technologies Used
- **Backend**: Python, Django, Django REST Framework
- **Database**: PostgreSQL (configurable)
- **Deployment**: Docker, Docker Compose (optional)

## 📋 Prerequisites
- Python 3.x
- PostgreSQL (or another configured database)
- Virtualenv
- Docker (optional)

## 🚀 Installation

## Running the backend server

1. **Clone the repository**:
   ```bash
   https://github.com/Nathan-Yinka/project_management_application.git
   cd project_management_application
   cd backend
   ```

2. Create a virtual environment and activate it:
    ```bash
    python3 -m venv venv    
    source venv/bin/activate    
    ```

3. Install the dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4. Run migrations and start the development server:
    ```bash
    python manage.py migrate
    python manage.py runserver
    ```

🐳 Running with Docker
- Build the Docker image:
    ```bash
    docker build -t django-backend .
    docker run -p 8000:8000 django-backend
    ```


## 🚀 Running the Server
After completing the installation steps, the development server should be running at http://127.0.0.1:8000/. You can access the API endpoints and perform various operations on projects and organizations.

## 📜 Swagger Documentation
The project includes an interactive Swagger documentation that provides a comprehensive overview of all available API endpoints. You can access it by navigating to:

http://127.0.0.1:8000
The Swagger documentation allows you to explore and test the API directly from your browser. It is a helpful tool for understanding how the endpoints work and for trying out different requests.



## 🚀 Running the Frontend

1. **Navigate to the frontend directory**:
    ```bash
    cd ../frontend
    ```

2. **Create a `.env` file**:
   In the `frontend` directory, create a `.env` file to store environment variables, including the backend server URL.

    ```bash
    touch .env
    ```

3. **Add the backend server URL**:
   Open the `.env` file and add the backend server URL using the `VITE_PUBLIC_BASEURL` variable name:

    ```env
    VITE_PUBLIC_BASEURL="http://127.0.0.1:8000/"
    ```

    Replace `http://127.0.0.1:8000/` with your actual backend server URL if it differs, such as a staging or production URL.

4. **Install frontend dependencies**:
    ```bash
    npm install
    ```

5. **Start the frontend server**:
    ```bash
    npm run dev
    ```

6. **Access the frontend application**:
   After the server starts, you can access the frontend application at [http://localhost:5173/](http://localhost:5173/) (or whichever port is specified).

### Notes
- Ensure that `VITE_PUBLIC_BASEURL` is correctly set up in your `.env` file, as this variable will allow your frontend application to communicate with the backend server.
- Restart the development server after making any changes to the `.env` file for the changes to take effect.

This setup provides a clean way to manage the backend URL for different environments without changing the code.


Access the frontend application: After the server starts, you can access the frontend application at http://localhost:5173/ (or whichever port is specified).


