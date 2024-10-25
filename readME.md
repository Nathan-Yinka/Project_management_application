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

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/project-management-backend.git
   cd project-management-backend
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
    docker build -t project-management-backend .
    ```

- Run the Docker container:
    ```bash
    docker-compose up
    ```

## 🚀 Running the Server
After completing the installation steps, the development server should be running at http://127.0.0.1:8000/. You can access the API endpoints and perform various operations on projects and organizations.

## 📜 Swagger Documentation
The project includes an interactive Swagger documentation that provides a comprehensive overview of all available API endpoints. You can access it by navigating to:

http://127.0.0.1:8000/swagger/
The Swagger documentation allows you to explore and test the API directly from your browser. It is a helpful tool for understanding how the endpoints work and for trying out different requests.
