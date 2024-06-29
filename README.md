# Node.js Express REST API Server

This project demonstrates knowledge in Node.js by implementing a simple REST API server using Express. It utilizes in-memory storage (arrays) instead of a database to showcase Node.js concepts.
## Installation and Setup

**Clone Repository**

   ```bash
   git clone https://github.com/your-username/your-repository.git
   cd your-repository
   ```

**Install Dependencies**

Ensure you have Node.js installed. Then, install the required packages:

    npm install

To start the server:

    npm start
    
The server will start running on http://localhost:3000.

## API Reference

```http
POST /api/user
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `user_id` | `string` | **Required**. Unique identifier for the user.|
| `login` | `string` | **Required**. User's login or username.|
| `password` | `string` | **Required**. User's password. |


```http
POST /api/authenticate
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `login` | `string` | **Required**. User's login or username.|
| `password` | `string` | **Required**. User's password. |

```http
POST /api/logout
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authenticator-header` | `string` | **Required**. Token for user authentication.|


```http
POST /api/articles
```
| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authenticator-header` | `string` | **Required**. Token for user authentication.|

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `article_id` | `string` | **Required**. User's login or username.|
| `title` | `string` | **Required**. Unique identifier for the article. |
| `content` | `string` | **Required**. Content of the article. |
| `visibility` | `string` | **Required**. Visibility setting (public, logged_in, private). |

```http
GET /api/articles
```
| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authenticator-header` | `string` | **Required**. Token for user authentication.|
