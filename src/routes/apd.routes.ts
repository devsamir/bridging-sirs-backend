import { Router } from "express";
// import { protect } from "../controllers/auth.controller";
import {
  getAllApd,
  updateApd,
  getIntervalApd,
  setIntervalApd,
} from "../controllers/apd.controller";
const router = Router();

// router.use(protect);

// Rekap Ruangan
router.get("/", getAllApd);
// router.post("/", createApd);
router.put("/", updateApd);

router.get("/interval", getIntervalApd);
router.post("/interval/:status", setIntervalApd);

export default router;
