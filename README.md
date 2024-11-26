# Blip: A Social Network Application

Blip is a React-based social network application where users can share their thoughts as "blips" which contains text and image and interact with others by commenting on their posts. It features user authentication, profile management, and a user-friendly interface for creating and viewing posts.

## Features

- **Authentication**:
  - Login and registration functionality with token-based authentication.
  - Automatic redirection for unauthenticated users.
 
- **Blips Viewing and Interacting**:
  - A list of blips showing in home page, enabling users view.
  - View blip details, including comments and the timestamp of creation or updates.
    
- **Profile Management**:
  - View profile information (e.g., username, email).
  - Upload and preview a new avatar image before saving.
  - View personal blips.

- **Comments**:
  - Add comments to any blip.
  - Display all comments for a specific blip.

- **Logout**:
  - Seamless logout with redirection to the home page.

## Backend API:
The backend is implemented in the api/ folder and provides RESTful endpoints for the application. API contains:

| Endpoint                  | Method | Description                                            |
|---------------------------|--------|--------------------------------------------------------|
| `/api/auth/login`         | POST   | Logs in a user with email and password.                |
| `/api/auth/register`      | POST   | Registers a new user.                                  |
| `/api/auth/me`            | GET    | Returns the authenticated user's data.                 |
| `/api/auth/logout`        | POST   | Logs out the user and clears their session.            |
| `/api/auth/upload-avatar` | PUT    | Allows the user to upload an avatar image.             |
| `/api/blips`              | GET    | Retrieves all blips (user's and others').              |
| `/api/blips`              | POST   | Creates a new blip with text and optional image.       |
| `/api/blips/:id`          | PUT    | Updates a blip.                                        |
| `/api/blips/:id`          | DELETE | Deletes a blip.                                        |
| `/api/blips/:id`          | GET    | Get a blip                                             |
| `/api/comments?blipid=id` | GET    | Retrieves comments for a specific blip.                |
| `/api/comments?blipid=id` | POST   | Adds a comment to a specific blip.                     |
| `/api/comments/:id`       | PUT    | Updates a comment.                                     |
| `/api/comments/:id`       | DElETE | Deletes a comment.                                     |

### Prerequisites
- **Node.js installed**
- **Prisma ORM**
- **Database(MySql)**

### Setup
1. Navigate to folder
   ```
   cd API/
   ```
2. Install dependencies
   ```
   npm install
   ```
3. Apply prisma
   ```
   npm prisma db push
   ```
4. start server
   ```
   npx nodemon service.js
   ```

## Frontend

### Prerequisites
- Node.js

### Installation
1. Navigate to folder
   ```
   cd client/
   ```
2. Install dependencies
   ```
   npm install
   ```
3. start development server
   ```
   npm start
   ```

## Example Usage
	1.	Register or log in using the provided forms.
	2.	View your profile, upload a new avatar, and browse your posts.
	3.	Create a new blip and see it appear in the feed.
	4.	Comment on your blips or others’.
	5.	Log out when done.

### Screenshot
| Screen                  | Screenshot Link   |
|-------------------------|-------------------|
| Login Page              | <img width="349" alt="image" src="https://github.com/user-attachments/assets/95a449ae-0bd7-4666-8f24-b0a3168a06df"> |
| Register Page           | <img width="344" alt="image" src="https://github.com/user-attachments/assets/debcefbe-e219-43e0-bab8-11e5e839bd63"> |
| Home Page               | <img width="749" alt="Screenshot 2024-11-25 at 17 43 03" src="https://github.com/user-attachments/assets/09d09a8a-a03d-458a-ba3d-f67265b70a8c"> |
| Profile Page            | <img width="527" alt="image" src="https://github.com/user-attachments/assets/f3aea166-98e5-4961-868c-b4cb127024f8"> |
| Blip Creation Page      | <img width="388" alt="image" src="https://github.com/user-attachments/assets/f625dda2-3617-4340-9cae-97b65eed8237">
 |
 
