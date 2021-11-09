import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import "reflect-metadata";
// Local
import { BASE_URL, PORT } from "./env";
import errorHandler from "./utils/errorHandler";
// Router
import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes";
import pasienRoutes from "./routes/pasien.routes";
import ruanganRoutes from "./routes/ruangan.routes";
import sdmRoutes from "./routes/sdm.routes";
import apdRoutes from "./routes/apd.routes";
import oksigenRoutes from "./routes/oksigen.routes";

const port = PORT || 8080;
(async () => {
  try {
    const app = express();
    app.use(express.json());
    app.use(morgan("dev"));

    app.use(cookieParser());
    app.use(helmet());
    app.use(
      cors({
        origin: BASE_URL,
        credentials: true,
      })
    );

    app.use("/api/user", userRouter);
    app.use("/api/auth", authRouter);
    app.use("/api/pasien", pasienRoutes);
    app.use("/api/ruangan", ruanganRoutes);
    app.use("/api/sdm", sdmRoutes);
    app.use("/api/apd", apdRoutes);
    app.use("/api/oksigen", oksigenRoutes);

    // Global Error Handler
    app.use(errorHandler);
    app.listen(port, (err?: any) => {
      if (err) throw err;
      console.log(`Launched on http://localhost:${port}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
