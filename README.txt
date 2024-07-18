Overview
This project is a simple RESTful API service that manages a to-do list. The API is built using Node.js and Express, leveraging JWT for authentication. It showcases effective usage of large language models (LLMs) for code generation, testing, documentation, deployment, and monitoring.



Setup
Prerequisites
Node.js
SQL Server
Postman or any HTTP client for testing the API

Installation
Clone the repository:
git clone https://github.com/M-Zeineddine/Y76_Task.git
cd Y76Backend

Install dependencies:
npm install

Set up environment variables:
Copy the .env.example file to a new file named .env.
Update the .env file with your database credentials and JWT secret.

Start the application:
npm start



API Endpoints
Login:
Method: POST
Endpoint: /api/login
Description: Authenticates users and returns a JWT.
Request Body: {"username": "admin", "password": "password"}

Get All Tasks:
Method: GET
Endpoint: /api/tasks
Description: Retrieves all tasks from the database.

Create Task:
Method: POST
Endpoint: /api/tasks
Description: Adds a new task to the database.
Request Body: {"name": "New Task", "description": "Details about the new task.", "is_completed": false}

Update Task:
Method: PUT
Endpoint: /api/tasks/{id}
Description: Updates an existing task.
Request Body: {"name": "Updated Task", "description": "Updated description.", "is_completed": true}

Delete Task:
Method: DELETE
Endpoint: /api/tasks/{id}
Description: Deletes a task.



Monitoring
Access the Express Status Dashboard at http://localhost:3300/status to view real-time metrics such as CPU usage, memory usage, response times, and request rates.



Testing
Run tests using:
npm test



Deployment
Deployment scripts and CI/CD configurations are set up using GitHub Actions, which automate the deployment process upon commits to the repository.
