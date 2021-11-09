import { Router } from "express";
// import { protect } from "../controllers/auth.controller";
import {
  getRefTempatTidur,
  getTempatTidur,
  updateTempatTidur,
  createTempatTidur,
  deleteTempatTidur,
  getIntervalRuangan,
  setIntervalRuangan,
} from "../controllers/ruangan.controller";
const router = Router();

// router.use(protect);

// Rekap Ruangan
router.get("/ref", getRefTempatTidur);
router.get("/", getTempatTidur);
router.post("/", createTempatTidur);
router.put("/", updateTempatTidur);
router.delete("/:id", deleteTempatTidur);

router.get("/interval", getIntervalRuangan);
router.post("/interval/:status", setIntervalRuangan);

export default router;
