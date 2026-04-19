# API Documentation

## Base Info
- Framework: Next.js App Router API routes
- Base path: `/api`
- Content type: `application/json`
- Auth: JWT in header `Authorization: Bearer <token>` for protected routes

## Authentication

### POST /api/auth/signup
- Auth: No
- Purpose: Register a new user
- Request body:
```json 
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "yourPassword"
}
```
- Success (201):
```json
{
  "message": "User registered successfully",
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": null,
    "mobileNumber": null,
    "panNumber": null,
    "dateOfBirth": null,
    "address": null,
    "_id": "...",
    "__v": 0
  }
}
```
- Error codes: 400, 500

### POST /api/auth/login
- Auth: No
- Purpose: Login and receive JWT token
- Request body:
```json
{
  "email": "john@example.com",
  "password": "yourPassword"
}
```
- Success (200):
```json
{
  "message": "Login successful",
  "token": "jwt-token"
}
```
- Error codes: 400, 500

## Profile

### GET /api/profile
- Auth: Yes
- Purpose: Get current user profile
- Success (200):
```json
{
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```
- Error codes: 401, 404, 500

### PATCH /api/profile
- Auth: Yes
- Purpose: Update current user profile fields
- Request body (all optional):
```json
{
  "name": "John",
  "avatar": "https://...",
  "mobileNumber": "9999999999",
  "panNumber": "ABCDE1234F",
  "dateOfBirth": "1995-01-01",
  "address": "City, State"
}
```
- Success (200):
```json
{
  "message": "Profile updated successfully",
  "user": { "...": "updated user data" }
}
```
- Error codes: 401, 404, 500

## Funds and Market Data

### GET /api/mf
- Auth: No
- Purpose: Fetch schemes/funds list from DB with cache and fallbacks
- Success (200):
```json
[
  {
    "scheme_code": 123456,
    "scheme_name": "Fund Name",
    "fund_house": "AMC Name",
    "scheme_category": "Category"
  }
]
```
- Error codes: 500

### GET /api/scheme/:code
- Auth: No
- Purpose: Fetch full scheme data (metadata + NAV history) from mfapi
- Path params:
  - `code` (required): Scheme code
- Success (200): Returns upstream mfapi scheme payload
- Error codes: 500

### GET /api/virtual-coin
- Auth: No
- Purpose: Return simulated coin price and 30-day history
- Success (200):
```json
{
  "symbol": "RNDCOIN",
  "current": 101.23,
  "history": [
    { "date": "2026-04-01", "price": 99.12 }
  ]
}
```

## Watchlist

### GET /api/watchlist
- Auth: Yes
- Purpose: Fetch current user watchlist
- Success (200):
```json
{
  "watchlist": {
    "userId": "...",
    "funds": [
      { "schemeCode": 123456, "schemeName": "Fund Name" }
    ]
  }
}
```
- Error codes: 401, 500

### POST /api/watchlist
- Auth: Yes
- Purpose: Add fund to watchlist (if not already present)
- Request body:
```json
{
  "schemeCode": 123456,
  "schemeName": "Fund Name"
}
```
- Success (200):
```json
{
  "message": "Fund added to watchlist",
  "watchlist": { "...": "updated watchlist" }
}
```
- Error codes: 400, 401, 500

### DELETE /api/watchlist
- Auth: Yes
- Purpose: Remove fund from watchlist
- Request body:
```json
{
  "schemeCode": 123456
}
```
- Success (200):
```json
{
  "message": "Fund removed from watchlist",
  "watchlist": { "...": "updated watchlist" }
}
```
- Error codes: 400, 401, 500

## Virtual Portfolio

### GET /api/virtual-portfolio
- Auth: Yes
- Purpose: Fetch all portfolios of logged-in user
- Success (200):
```json
{
  "portfolios": [
    {
      "name": "Retirement",
      "investments": [
        {
          "_id": "...",
          "schemeCode": 123456,
          "schemeName": "Fund Name",
          "type": "SIP",
          "amount": 5000,
          "date": "2026-01-15"
        }
      ]
    }
  ]
}
```
- Error codes: 401, 404, 500

### POST /api/virtual-portfolio
- Auth: Yes
- Purpose: Create/update a named portfolio and optionally add investment entry
- Request body:
```json
{
  "portfolioName": "Retirement",
  "schemeCode": 123456,
  "schemeName": "Fund Name",
  "type": "SIP",
  "amount": 5000,
  "date": "2026-01-15"
}
```
- Minimum required: `portfolioName`
- Success (200):
```json
{
  "message": "Portfolio updated",
  "portfolios": ["..."]
}
```
- Error codes: 400, 401, 404, 500

### DELETE /api/virtual-portfolio
- Auth: Yes
- Purpose: Delete a full portfolio OR delete one investment from portfolio
- Request body:
```json
{
  "portfolioName": "Retirement",
  "investmentId": "optional-investment-id"
}
```
- Behavior:
  - If `investmentId` sent: removes only that investment.
  - If `investmentId` not sent: removes whole portfolio.
- Success (200):
```json
{
  "message": "Portfolio updated",
  "portfolios": ["..."]
}
```
- Error codes: 400, 401, 404, 500

## Stats

### GET /api/stats/users
- Auth: No
- Purpose: Get total users count
- Success (200):
```json
{
  "count": 42,
  "message": "User count fetched successfully"
}
```
- Error (500):
```json
{
  "count": 0,
  "message": "Error fetching user count"
}
```

## Chat - Users

### GET /api/chat/users?search=<text>
- Auth: Yes
- Purpose: List users (excluding current user) for starting chats
- Query params:
  - `search` (optional): Name/email search
- Success (200):
```json
{
  "users": [
    {
      "_id": "...",
      "name": "Jane",
      "email": "jane@example.com",
      "avatar": "..."
    }
  ]
}
```
- Error codes: 401, 500

## Chat - Conversations

### GET /api/chat/conversations
- Auth: Yes
- Purpose: Get active conversations of current user
- Success (200):
```json
{
  "conversations": [
    {
      "_id": "...",
      "type": "direct",
      "name": "Other User",
      "description": "",
      "participants": ["..."],
      "createdBy": "...",
      "lastMessage": "...",
      "lastMessageAt": "...",
      "createdAt": "...",
      "unreadCount": 0
    }
  ]
}
```
- Error codes: 401, 500

### POST /api/chat/conversations
- Auth: Yes
- Purpose: Create direct/group conversation
- Request body:
```json
{
  "type": "direct",
  "participantIds": ["user-id"],
  "name": "Group Name",
  "description": "Optional"
}
```
- Rules:
  - `type=direct`: exactly 1 participant in `participantIds` (plus current user)
  - `type=group`: at least 1 participant in `participantIds` (plus current user)
- Success (201):
```json
{
  "message": "Conversation created successfully",
  "conversation": { "...": "conversation object" }
}
```
- Existing direct conversation case (200):
```json
{
  "message": "Direct conversation already exists",
  "conversation": { "...": "existing conversation" }
}
```
- Error codes: 400, 401, 500

### GET /api/chat/conversations/:id
- Auth: Yes
- Purpose: Get one conversation and all its messages
- Path params:
  - `id` (required): Conversation ID
- Success (200):
```json
{
  "conversation": { "...": "conversation" },
  "messages": ["..."]
}
```
- Notes: Marks unread messages as read for current user.
- Error codes: 401, 404, 500

### PUT /api/chat/conversations/:id
- Auth: Yes (group admin required by implementation)
- Purpose: Update conversation name/description
- Request body:
```json
{
  "name": "New Group Name",
  "description": "Updated description"
}
```
- Success (200):
```json
{
  "message": "Conversation updated successfully",
  "conversation": { "...": "updated conversation" }
}
```
- Error codes: 401, 404, 500

### DELETE /api/chat/conversations/:id
- Auth: Yes
- Purpose:
  - Direct chat: deactivate conversation
  - Group chat: current user leaves group
- Success (200):
```json
{
  "message": "Left conversation successfully"
}
```
- Error codes: 401, 404, 500

## Chat - Conversation Members

### POST /api/chat/conversations/:id/members
- Auth: Yes (group admin)
- Purpose: Add member to group conversation
- Request body:
```json
{
  "userId": "new-member-user-id"
}
```
- Success (200):
```json
{
  "message": "Member added successfully",
  "conversation": { "...": "updated group conversation" }
}
```
- Error codes: 400, 401, 404, 500

### DELETE /api/chat/conversations/:id/members?memberId=<userId>
- Auth: Yes (group admin)
- Purpose: Remove member from group conversation
- Query params:
  - `memberId` (required): user ID to remove
- Success (200):
```json
{
  "message": "Member removed successfully",
  "conversation": { "...": "updated group conversation" }
}
```
- Notes: If participants become 0, conversation is deactivated.
- Error codes: 400, 401, 404, 500

## Chat - Messages

### GET /api/chat/messages?conversationId=<id>&page=1&limit=50
- Auth: Yes
- Purpose: Paginated messages of a conversation
- Query params:
  - `conversationId` (required)
  - `page` (optional, default 1)
  - `limit` (optional, default 50)
- Success (200):
```json
{
  "messages": ["...chronological..."],
  "hasMore": true,
  "page": 1
}
```
- Notes: Marks unread messages as read for current user.
- Error codes: 400, 401, 404, 500

### POST /api/chat/messages
- Auth: Yes
- Purpose: Send message in conversation
- Request body:
```json
{
  "conversationId": "conversation-id",
  "content": "Hello",
  "replyTo": "optional-message-id"
}
```
- Success (201):
```json
{
  "message": "Message sent successfully",
  "message": { "...": "created message" }
}
```
- Error codes: 400, 401, 404, 500

### GET /api/chat/messages/:id
- Auth: Yes
- Purpose: Fetch one message by ID (if user belongs to its conversation)
- Success (200):
```json
{
  "message": { "...": "message object" }
}
```
- Error codes: 401, 403, 404, 500

### PUT /api/chat/messages/:id
- Auth: Yes (sender only)
- Purpose: Edit message content
- Request body:
```json
{
  "content": "Updated text"
}
```
- Success (200):
```json
{
  "message": "Message updated successfully",
  "message": { "...": "updated message" }
}
```
- Error codes: 400, 401, 404, 500

### DELETE /api/chat/messages/:id
- Auth: Yes (sender only)
- Purpose: Soft delete a message
- Success (200):
```json
{
  "message": "Message deleted successfully"
}
```
- Error codes: 401, 404, 500

## Scheme Calculators

### POST /api/scheme/:code/lampsum
- Auth: No
- Purpose: Lumpsum return calculation using NAV history
- Request body:
```json
{
  "amount": 100000,
  "from": "2022-01-01",
  "to": "2026-01-01"
}
```
- Success (200):
```json
{
  "investedAmount": 100000,
  "currentValue": 132500,
  "absoluteReturn": 32.5,
  "annualizedReturn": 7.3,
  "units": 1234.5678,
  "startDate": "...",
  "endDate": "..."
}
```
- Error codes: 400, 500

### GET /api/scheme/:code/returns?period=1y
### GET /api/scheme/:code/returns?from=2025-01-01&to=2026-01-01
- Auth: No
- Purpose: Point-to-point returns for selected period/range
- Query options:
  - `period`: one of `1m`, `2m`, `3m`, `6m`, `1y`
  - OR `from` and `to` (ISO date)
- Success (200):
```json
{
  "schemeCode": "...",
  "startDate": "...",
  "endDate": "...",
  "startNAV": 12.34,
  "endNAV": 15.67,
  "simpleReturn": 27.02,
  "annualizedReturn": 12.11,
  "count": 250,
  "navHistory": ["..."]
}
```
- Error codes: 400, 404, 500

### GET /api/scheme/:code/rolling?period=12
- Auth: No
- Purpose: Rolling returns for N months
- Query params:
  - `period` (required): months as integer (e.g., `12`)
- Success (200):
```json
[
  {
    "startDate": "...",
    "endDate": "...",
    "startNAV": 12.34,
    "endNAV": 13.21,
    "simpleReturn": 7.05,
    "annualizedReturn": 7.05
  }
]
```
- Error codes: 400, 500

### POST /api/scheme/:code/sip
- Auth: No
- Purpose: SIP return calculation
- Request body:
```json
{
  "amount": 5000,
  "frequency": "monthly",
  "from": "2022-01-01",
  "to": "2026-01-01"
}
```
- `frequency`: `monthly` | `quarterly` | `weekly`
- Success (200):
```json
{
  "totalInvested": 240000,
  "currentValue": 289000,
  "totalUnits": 18000.1234,
  "absoluteReturn": 20.42,
  "annualizedReturn": 4.76
}
```
- Error codes: 400, 500

### POST /api/scheme/:code/stepup
- Auth: No
- Purpose: Step-up SIP return calculation
- Request body:
```json
{
  "amount": 5000,
  "frequency": "monthly",
  "stepUpPercent": 10,
  "from": "2022-01-01",
  "to": "2026-01-01"
}
```
- Success (200):
```json
{
  "totalInvested": 300000,
  "currentValue": 356000,
  "totalUnits": 21000.1234,
  "absoluteReturn": 18.67,
  "annualizedReturn": 4.39
}
```
- Error codes: 400, 500

### POST /api/scheme/:code/swp
- Auth: No
- Purpose: SWP (Systematic Withdrawal Plan) calculation
- Request body:
```json
{
  "initialAmount": 500000,
  "withdrawalAmount": 10000,
  "frequency": "monthly",
  "from": "2022-01-01",
  "to": "2026-01-01"
}
```
- Success (200):
```json
{
  "initialAmount": 500000,
  "totalWithdrawn": 480000,
  "remainingValue": 120000,
  "absoluteReturn": 20,
  "annualizedReturn": 4.66
}
```
- Error codes: 400, 500

## Common Error Patterns
- 400: Missing/invalid parameters
- 401: Missing/invalid authorization token
- 403: Authenticated but not allowed
- 404: Resource not found
- 500: Server/internal error

## Auth Header Example
```http
Authorization: Bearer <jwt-token>
```
