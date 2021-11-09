import { Router } from "express";
// import { protect } from "../controllers/auth.controller";
import {
  getPasienMasuk,
  createPasienMasuk,
  deletePasienMasuk,
  getPasienKomorbid,
  createPasienKomorbid,
  createPasienNonKomorbid,
  getPasienNonKomorbid,
  getRefPasienKeluar,
  getPasienKeluar,
  createPasienKeluar,
  deletePasienKeluar,
  getIntervalPasienMasuk,
  setIntervalPasienMasuk,
  getIntervalPasienKomorbid,
  setIntervalPasienKomorbid,
  getIntervalPasienNonKomorbid,
  setIntervalPasienNonKomorbid,
  getIntervalPasienKeluar,
  setIntervalPasienKeluar,
  getPasienTriase,
  createPasienTriase,
  getIntervalPasienTriase,
  setIntervalPasienTriase,
} from "../controllers/pasien.controller";
const router = Router();

// router.use(protect);

// Rekap Pasien Masuk
router.get("/pasien-masuk", getPasienMasuk);
router.post("/pasien-masuk", createPasienMasuk);
router.delete("/pasien-masuk/:tanggal", deletePasienMasuk);
// Rekap Pasien Komorbid
router.get("/pasien-komorbid", getPasienKomorbid);
router.post("/pasien-komorbid", createPasienKomorbid);
// Rekap Pasien Non Komorbid
router.get("/pasien-non-komorbid", getPasienNonKomorbid);
router.post("/pasien-non-komorbid", createPasienNonKomorbid);
// Rekap Pasien Keluar
router.get("/ref-pasien-keluar", getRefPasienKeluar);
router.get("/pasien-keluar", getPasienKeluar);
router.post("/pasien-keluar", createPasienKeluar);
router.delete("/pasien-keluar/:tanggal", deletePasienKeluar);

// INTERVAL ROUTE
router.get("/interval/pasien-masuk", getIntervalPasienMasuk);
router.post("/interval/pasien-masuk/:status", setIntervalPasienMasuk);

router.get("/interval/pasien-komorbid", getIntervalPasienKomorbid);
router.post("/interval/pasien-komorbid/:status", setIntervalPasienKomorbid);

router.get("/interval/pasien-non-komorbid", getIntervalPasienNonKomorbid);
router.post(
  "/interval/pasien-non-komorbid/:status",
  setIntervalPasienNonKomorbid
);

router.get("/interval/pasien-keluar", getIntervalPasienKeluar);
router.post("/interval/pasien-keluar/:status", setIntervalPasienKeluar);

// PASIEN TRIASE
router.get("/pasien-triase", getPasienTriase);
router.post("/pasien-triase", createPasienTriase);

router.get("/interval/pasien-triase", getIntervalPasienTriase);
router.post("/interval/pasien-triase/:status", setIntervalPasienTriase);
export default router;
