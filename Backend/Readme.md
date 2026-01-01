# Backend for Software Campaign Management

This is a backend application for managing software campaigns. It is built using Node.js, Express.js, and Sequelize as the ORM for interacting with a MySQL database.

## Features

- User authentication and authorization using JWT
- Creating, reading, updating, and deleting software campaigns
- Creating, reading, updating, and deleting users
- Creating, reading, updating, and deleting software packages
- Creating, reading, updating, and deleting campaigns
- Creating, reading, updating, and deleting OTP records
- Encrypting and decrypting files using public and private keys
- Sending softwares to the vehicle throug wirless

## Installation

1. Clone the repository
2. Install dependencies using `npm install`
3. Create a `.env` file and add the following variables:
   - `CORS_ORIGIN`: The origin of the frontend application
   - `ACCESS_TOKEN_SECRET`: The secret key for generating access tokens
   - `REFRESH_TOKEN_SECRET`: The secret key for generating refresh tokens
   - `ACCESS_TOKEN_EXPIRY`: The expiration time for access tokens
   - `REFRESH_TOKEN_EXPIRY`: The expiration time for refresh tokens
   - `NODE_ENV`: The environment of the application (development, production, etc.)
4. Run the application using `npm start`

## API Endpoints

- `/api/v1/users`: Get all users
- `/api/v1/users/register`: Register a new user
- `/api/v1/users/login`: Login an existing user
- `/api/v1/users/logout`: Logout an existing user
- `/api/v1/users/resetpassword`: Reset password for an existing user
- `/api/v1/users/updatepassword`: Update password for an existing user
- `/api/v1/users/update`: Update details of an existing user
- `/api/v1/users/delete`: Delete an existing user
- `/api/v1/software`: Get all software packages
- `/api/v1/software/create`: Create a new software package
- `/api/v1/software/update`: Update details of an existing software package
- `/api/v1/software/delete`: Delete an existing software package
- `/api/v1/campaign`: Get all campaigns
- `/api/v1/campaign/create`: Create a new campaign
- `/api/v1/campaign/update`: Update details of an existing campaign
- `/api/v1/campaign/delete`: Delete an existing campaign

## Testing

The application uses Jest as the testing framework. To run the tests, use the following command:
