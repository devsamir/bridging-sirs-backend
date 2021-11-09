import { Router } from "express";
// import { protect } from "../controllers/auth.controller";
import {
  getAllOksigen,
  getIntervalOksigen,
  setIntervalOksigen,
  createOksigen,
} from "../controllers/oksigen.controller";
const router = Router();

// router.use(protect);

// Rekap Ruangan
router.get("/", getAllOksigen);
router.post("/", createOksigen);

router.get("/interval", getIntervalOksigen);
router.post("/interval/:status", setIntervalOksigen);

export default router;
