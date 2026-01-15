# Slack Flow

A real-time messaging backend inspired by Slack, built with Node.js, Express, Socket.io, MongoDB, and Redis. This project demonstrates core backend concepts including WebSocket authentication, real-time communication, background job processing, and clean architecture patterns.

> **Note:** This is a feature implementation showcasing key backend concepts, not a full Slack clone.

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/40275637-59665e76-e67a-4bc0-8d41-122b6630f015?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D40275637-59665e76-e67a-4bc0-8d41-122b6630f015%26entityType%3Dcollection%26workspaceId%3D79702739-7219-4e56-ba71-dae07e2cc86f)

## Features

### Authentication & Authorization

- JWT-based authentication for REST APIs
- Socket.io connection authentication via JWT handshake
- Role-based access control (Admin/Member) for workspaces

### Real-Time Messaging (Socket.io)

- **Channel Messages** — Send and receive messages in workspace channels
- **Direct Messages** — Private 1:1 conversations between users
- **Typing Indicators** — Real-time typing status for channels and DMs
- **Auto-Join Rooms** — Users automatically join all their channels/DM rooms on connection (Slack-like behavior)

### Workspace Management

- Create workspaces with unique join codes
- Add members with role assignment
- Create channels within workspaces
- Workspace-scoped messaging

### Background Job Processing (BullMQ + Redis)

- Asynchronous email delivery via job queue
- Retry mechanism with exponential backoff (3 attempts)
- Job monitoring via Bull Board dashboard (`/admin/queues`)

### API Design

- RESTful API with versioning (`/api/v1`)
- Request validation using Zod schemas
- Centralized error handling with custom error classes
- Correlation ID tracking for request tracing

---

## Tech Stack

| Category   | Technology                   |
| ---------- | ---------------------------- |
| Runtime    | Node.js with TypeScript      |
| Framework  | Express 5                    |
| Database   | MongoDB (Mongoose ODM)       |
| Real-time  | Socket.io                    |
| Queue      | BullMQ + Redis               |
| Auth       | JWT + bcrypt                 |
| Validation | Zod                          |
| Logging    | Winston (daily rotate files) |

---

## Architecture

```
src/
├── config/          # Environment & service configurations
├── controllers/     # Request handlers (REST + Socket)
├── middlewares/     # Auth, error handling, correlation ID
├── models/          # Mongoose schemas
├── repositories/    # Database access layer
├── services/        # Business logic
├── validators/      # Zod schemas for validation
├── producers/       # Job queue producers
├── workers/         # Background job processors
├── queues/          # Queue definitions
├── routes/          # API route definitions
└── utils/           # Helpers, constants, custom errors
```

---

## How It Works

### Socket Connection Flow

```
Client connects with JWT token
         │
         ▼
┌─────────────────────────────────┐
│  Socket Auth Middleware         │
│  - Validates JWT                │
│  - Attaches user to socket      │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Auto-Join Rooms                │
│  - Fetches user's workspaces    │
│  - Joins all channel rooms      │
│  - Joins all DM conversation    │
│    rooms                        │
└─────────────────────────────────┘
         │
         ▼
  User receives messages from
  ALL their channels & DMs
```

### Message Flow

```
User A sends message
         │
         ▼
┌─────────────────────────────────┐
│  Validate with Zod              │
│  Save to MongoDB                │
│  Broadcast to Socket.io room    │
└─────────────────────────────────┘
         │
         ▼
  All users in channel/DM
  receive the message instantly
```

### Email Queue Flow

```
Action triggers email (e.g., workspace invite)
         │
         ▼
┌─────────────────────────────────┐
│  Producer adds job to queue     │
│  (with retry config)            │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Worker picks up job            │
│  Sends email via Nodemailer     │
│  Retries on failure (3x)        │
└─────────────────────────────────┘
```

---

## API Endpoints

### Authentication

| Method | Endpoint               | Description       |
| ------ | ---------------------- | ----------------- |
| POST   | `/api/v1/users/signup` | Register new user |
| POST   | `/api/v1/users/signin` | Login and get JWT |

### Workspaces

| Method | Endpoint                          | Description                |
| ------ | --------------------------------- | -------------------------- |
| POST   | `/api/v1/workspaces`              | Create workspace           |
| GET    | `/api/v1/workspaces`              | Get user's workspaces      |
| GET    | `/api/v1/workspaces/:id`          | Get workspace details      |
| PUT    | `/api/v1/workspaces/:id`          | Update workspace           |
| DELETE | `/api/v1/workspaces/:id`          | Delete workspace           |
| GET    | `/api/v1/workspaces/join/:code`   | Get workspace by join code |
| POST   | `/api/v1/workspaces/:id/members`  | Add member                 |
| POST   | `/api/v1/workspaces/:id/channels` | Add channel                |

### Channels & Messages

| Method | Endpoint                      | Description            |
| ------ | ----------------------------- | ---------------------- |
| GET    | `/api/v1/channels/:id`        | Get channel details    |
| GET    | `/api/v1/messages/:channelId` | Get paginated messages |

---

## Socket Events

### Client → Server

| Event              | Payload                                  | Description          |
| ------------------ | ---------------------------------------- | -------------------- |
| `NewMessage`       | `{ body, channelId, workspaceId }`       | Send channel message |
| `NewDirectMessage` | `{ body, receiverId, workspaceId }`      | Send DM              |
| `Typing`           | `{ channelId?, recipientId?, isTyping }` | Typing indicator     |

### Server → Client

| Event              | Description                  |
| ------------------ | ---------------------------- |
| `NewMessage`       | New channel message received |
| `NewDirectMessage` | New DM received              |
| `Typing`           | Someone is typing            |

---

## Setup

### Prerequisites

- Node.js 18+
- MongoDB
- Redis

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your-secret-key
JWT_EXPIRY=1d
DEV_DB_URL=mongodb://localhost:27017/slack-flow-dev
REDIS_HOST=localhost
REDIS_PORT=6379
MAIL_ID=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

---

## Client Usage Example

```javascript
import { io } from "socket.io-client";

// Connect with authentication
const socket = io("http://localhost:3001", {
  auth: { token: "your-jwt-token" },
});

// Listen for messages (from ALL channels/DMs - auto-joined)
socket.on("NewMessage", (message) => {
  console.log("Channel message:", message);
});

socket.on("NewDirectMessage", (message) => {
  console.log("DM received:", message);
});

// Send a channel message
socket.emit(
  "NewMessage",
  {
    body: "Hello team!",
    channelId: "channel-id",
    workspaceId: "workspace-id",
  },
  (response) => {
    console.log("Sent:", response);
  }
);

// Send a direct message
socket.emit("NewDirectMessage", {
  body: "Hey!",
  receiverId: "user-id",
  workspaceId: "workspace-id",
});

// Typing indicator
socket.emit("Typing", { channelId: "channel-id", isTyping: true });
```

---

## License

MIT
