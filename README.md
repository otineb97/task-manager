# Task Manager Web Application

Task Manager is a web application designed to help users manage their tasks efficiently. Users can register an account, log in, add new tasks, mark tasks as completed, update task details, and delete tasks.

## Features

- **User Authentication**: Users can register an account and log in securely.
- **Task Management**: Users can add new tasks, view pending and completed tasks, mark tasks as completed, update task details, and delete tasks.
- **Responsive Design**: The application is designed to be responsive and works well on desktop and mobile devices.

## Technologies Used

- **Frontend**: HTML, CSS (Bootstrap), JavaScript (Vanilla JS)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JWT (JSON Web Tokens), bcryptjs for password hashing
- **Deployment**: Heroku for backend, Netlify/Vercel for frontend

## Installation

1. Clone the repository

```bash
git clone https://github.com/otineb97/task-manager.git
```

2. Install dependencies

- **cd task-manager**
- **npm init -y**
- **npm install**
- **bcryptjs**: Used for password hashing.
- **dotenv**: Used for loading environment variables from a .env file.
- **ejs**: Template engine used for server-side rendering.
- **express-session**: Middleware for managing user sessions in Express.
- **express**: Web framework for Node.js.
- **jsonwebtoken**: Used for generating and verifying JSON Web Tokens (JWT).
- **mongoose**: MongoDB object modeling tool designed to work in an asynchronous environment.
- **morgan**: HTTP request logger middleware for Node.js.
- **pug**: Template engine used for server-side rendering (optional, as it may not be directly related to your project).

3. Set up environment variables

- Create a **.env** file in the root directory and add the following variables

```bash
require('dotenv').config(); MONGODB_URI=your_mongodb_uri JWT_SECRET=your_jwt_secret
```

- Replace 'your_mongodb_uri' with your MongoDB connection string and 'your_jwt_secret' with a secret key for JWT.

4. Run the application

```bash
npm run start
```

- The application will be running at 'http://localhost:3000/'.

## Usage

1. Register an account or log in if you already have one.
2. Add new tasks with titles, descriptions, and deadlines.
3. View your pending tasks and mark them as completed when done.
4. Update task details or delete tasks as needed.
5. Log out when finished.

# Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

# License

This project is licensed under the [MIT License](LICENSE).

Feel free to customize it further based on your project's specific details and requirements!
