# Mutual Funds App

Ye project Next.js (App Router) me bana hai. Isme frontend aur backend dono ek hi server par run hote hain.

- Frontend pages: `src/app/...`
- Backend APIs: `src/app/api/...`

## 1. Setup

```bash
npm install
```

Environment variable set karein:

1. `.env.local` file create karein (already added).
2. Isme 2 alag DB config set karein:

```env
MONGODB_URI_USERS="mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority"
MONGODB_USER_DB_NAME="mutualfunds"

MONGODB_URI_COMPANY="mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority"
MONGODB_COMPANY_DB_NAME="mutualfund"
JWT_SECRET="your-jwt-secret"
```

Current behavior:

- User auth/profile/watchlist/chat data -> `mutualfunds` DB
- Mutual fund/company listing (`/api/mf`) -> `mutualfund` DB

## 2. Frontend + Backend Run

```bash
npm run dev
```

App open karein: `http://localhost:3000`

Important: Next.js me alag se backend start karne ki zarurat nahi hoti. `npm run dev` se frontend + API routes dono run ho jate hain.

## 3. API Test

Browser/Postman me check karein:

- `GET http://localhost:3000/api/mf`
- `GET http://localhost:3000/api/scheme/119551` (example scheme code)

## 4. MongoDB Me Funds Update Karna (Optional)

Ye command MFAPI se data laake MongoDB me update karti hai:

```bash
npm run update:funds
```

## Notes

- `MONGODB_URI_USERS` / `MONGODB_URI_COMPANY` missing hoga to app DB connect nahi karega.
- `.env.local` git me commit mat karein.
- Agar aapne plain credentials share kiye hain to Atlas password rotate karna recommended hai.
