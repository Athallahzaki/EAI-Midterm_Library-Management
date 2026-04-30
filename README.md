# EAI-Midterm_Library-Management
Tugas UTS Enterprise Application Development - Membuat Microservice Integration dengan API

Project Library Management - Manajemen Perpustakaan, Sistem Peminjaman dan Pemgembalian Buku

## Tech Stack

**Backend:** NodeJS, Express

**Auth:** JWT Stateless Token

# Setup Project

## Prerequisites

Before you begin, make sure you have the following prerequisites installed on your system:

-   [NodeJS](https://nodejs.org/en) Version 22.x or latest.
-   [MySQL/MariaDB](https://mariadb.org) Database Server.

## Step 1: Clone The Repository

```bash
  git clone https://github.com/Athallahzaki/EAI-Midterm_Library-Management.git
```

## Step 2: Install Required Dependencies

Navigate to project root directory and use npm to install the project's dependencies:

```bash
  cd EAI-Midterm_Library-Management

  npm run install-all
```

## Step 3: Create .env files

In this step you can open your preference code editor or IDE or stick to the terminal.

### linux system

linux bash

```bash
  cp .env.example .env
```

### windows system

On windows, there are 2 terminals that have different syntax:

1. windows command prompt

```bash
  cat .env.example > .env
```

2. windows powershell

```bash
  cp .env.example .env
```

### Another way

```
  Or you can copy .env.example manually and rename it to .env
```

## Step 4: Configure Your .env file

Edit the .env file that you copied earlier.

```
  # JWT
  USER_JWT_SECRET=secret-changeme
  SERVICE_JWT_SECRET=service-secret-changeme

  # Book Service
  BOOK_SERVICE_BASE_URL=http://localhost
  BOOK_SERVICE_PORT=4001
  BOOK_SERVICE_DB_URL=mysql://user:password@localhost:3306/library_mgmt_db

  # User Service
  USER_SERVICE_BASE_URL=http://localhost
  USER_SERVICE_PORT=4002
  USER_SERVICE_DB_URL=mysql://user:password@localhost:3306/library_mgmt_db

  # Auth Service
  AUTH_SERVICE_BASE_URL=http://localhost
  AUTH_SERVICE_PORT=4003
  AUTH_SERVICE_DB_URL=mysql://user:password@localhost:3306/library_mgmt_db

  # Borrow Service
  BORROW_SERVICE_BASE_URL=http://localhost
  BORROW_SERVICE_PORT=4004
  BORROW_SERVICE_DB_URL=mysql://user:password@localhost:3306/library_mgmt_db

  # Gateway API
  GATEWAY_BASE_URL=http://localhost
  GATEWAY_PORT=4000

```

## Step 5: Import the Database

Import the database `.sql` file provided using PHPMyAdmin or manually.

## Step 6: Start the Development Server

Run this code in the terminal to start the development server.

```bash
  npm run dev-all
```

### Running a Production Build

To deploy the project for production, run this command.

```bash
  npm run start-all
```

## Step 7: Accessing the Server

You can now access the server by opening a browser or using tools like postman and going to this site.

```
  http://localhost:4000/ (Gateway Endpoint)
  http://localhost:4000/api-docs/ (API Docs)
```