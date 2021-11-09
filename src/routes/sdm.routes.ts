import { Router } from "express";
// import { protect } from "../controllers/auth.controller";
import {
  getRefSdm,
  getAllSdm,
  createSdm,
  updateSdm,
  getIntervalSdm,
  setIntervalSdm,
} from "../controllers/sdm.controller";
const router = Router();

// router.use(protect);

// Rekap Ruangan
router.get("/ref", getRefSdm);
router.get("/", getAllSdm);
router.post("/", createSdm);
router.put("/", updateSdm);

router.get("/interval", getIntervalSdm);
router.post("/interval/:status", setIntervalSdm);

export default router;
