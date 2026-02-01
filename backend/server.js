import express from "express";
import dotenv from "dotenv";

import session from "express-session";
import cors from "cors";
import MongoStore from "connect-mongo";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import publicRoutes from "./routes/public.js";
import userRoutes from "./routes/user.js";
import adminRoutes from "./routes/admin.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URL_ATLAS;
const SESSION_SECRET = process.env.SESSION_SECRET || "secret";
const SESSION_MAX_AGE =
  Number(process.env.SESSION_MAX_AGE) || 24 * 60 * 60 * 1000; // default 1 day

connectDB();

// Middlewares
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// CORS: allow frontend origin and credentials for session cookies
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:5175';
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(
  session({
    name: "connect.sid",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: false,
    cookie: {
      maxAge: SESSION_MAX_AGE,
      httpOnly: true,
      // secure: true, // Enable it when using https
      sameSite: "lax",
    },
    // Use Mongo-backed session store when MONGO_URI is provided, otherwise
    // fall back to the default MemoryStore (suitable for local development).
    store: MONGO_URI
      ? MongoStore.create({
          mongoUrl: MONGO_URI,
          ttl: SESSION_MAX_AGE / 1000,
          autoRemove: "native",
          touchAfter: 60,
        })
      : undefined,
  })
);

// Routes

app.use("/api/public", publicRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
