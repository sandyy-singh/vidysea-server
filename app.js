import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';
import { errorHandler } from "./middleware/errorMiddleware.js";
import authRoutes from './routes/userRoute.js';
import notesRoute from "./routes/notesRoutes.js";

dotenv.config();
const app = express();



// ✅ Middleware
app.use(cors({
  origin: "https://vidysea-client.onrender.com",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());



// ✅ Routes

app.use("/api/auth", authRoutes);
app.use("/api/note", notesRoute);


app.use(errorHandler);

// ✅ Server + DB
const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
     
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to DB", err);
  });
