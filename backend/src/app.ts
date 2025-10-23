import express, {
  type Application,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import loginRoutes from "./routes/authRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";
import "./config/dotenv.js";


const app: Application = express();

// Basic security headers
app.use(helmet());

// Logging
app.use(morgan("dev"));

app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use("/auth", loginRoutes);

// Health check
app.get("/health", (_req: Request, res: Response) => res.send("ok"));

// Centralized error handler
app.use(
  errorHandler as unknown as (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
  ) => void
);

export default app;
