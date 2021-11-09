import { Router } from "express";
import { protect } from "../controllers/auth.controller";
import {
  createUser,
  deleteUser,
  getAllUser,
  updateUser,
} from "../controllers/user.controller";

const router = Router();

router.use(protect);

router.get("/", getAllUser);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
