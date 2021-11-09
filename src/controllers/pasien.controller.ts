import axios from "axios";
import { Request, Response, NextFunction } from "express";
import { format } from "date-fns";
import catchAsync from "../utils/catchAsync";
import { formatDateUi } from "../utils/helper";
import { rsId, pass } from "../env";

// BPJS KEY
const url = "http://sirs.kemkes.go.id/fo/index.php/LapV2";

let pasienMasukInterval: any;
let pasienKomorbidInterval: any;
let pasienNonKomorbidInterval: any;
let pasienKeluarInterval: any;
let pasienTriaseInterval: any;

// const updateTime = 1000;
const updateTime = 6 * 60 * 60 * 1000;

// INTERVAL FOR AUTOMATIC UPDATE PASIEN MASUK
const intervalPasienMasuk = async () => {
  const timeNow1 = Math.floor(new Date().getTime() / 1000);
  const today = format(new Date(), "yyyy-MM-dd");
  const { data } = await axios.get(`${url}/PasienMasuk`, {
    headers: {
      "X-rs-id": rsId,
      "X-Timestamp": timeNow1,
      "X-pass": pass,
    },
  });
  const one = data.RekapPasienMasuk.find((item: any) => item.tanggal === today);
  if (!one) {
    const timeNow = Math.floor(new Date().getTime() / 1000);
    const body = {
      tanggal: format(new Date(), "yyyy-MM-dd"),
      igd_suspect_l: "0",
      igd_suspect_p: "0",
      igd_confirm_l: "0",
      igd_confirm_p: "0",
      rj_suspect_l: "0",
      rj_suspect_p: "0",
      rj_confirm_l: "0",
      rj_confirm_p: "0",
      ri_suspect_l: "0",
      ri_suspect_p: "0",
      ri_confirm_l: "0",
      ri_confirm_p: "0",
    };
    await axios.post(`${url}/PasienMasuk`, body, {
      headers: {
        "X-rs-id": rsId,
        "X-Timestamp": timeNow,
        "X-pass": pass,
      },
    });
    console.log("Berhasil Update Pasien Masuk");
  }
};

export const setIntervalPasienMasuk = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.params;
    if (status === "on" && !pasienMasukInterval) {
      await intervalPasienMasuk();
      pasienMasukInterval = setInterval(intervalPasienMasuk, updateTime);
    } else if (status === "off") {
      clearInterval(pasienMasukInterval);
      pasienMasukInterval = false;
    }
    res.status(200).json("success");
  }
);
export const getIntervalPasienMasuk = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!pasienMasukInterval) {
      res.status(200).json("off");
    } else {
      res.status(200).json("on");
    }
  }
);

// INTERVAL FOR AUTOMATIC UPDATE PASIEN KOMORBID
const intervalPasienKomorbid = async () => {
  const timeNow1 = Math.floor(new Date().getTime() / 1000);
  const { data } = await axios.get(`${url}/PasienDirawatKomorbid`, {
    headers: {
      "X-rs-id": rsId,
      "X-Timestamp": timeNow1,
      "X-pass": pass,
    },
  });
  const today = format(new Date(), "yyyy-MM-dd");
  const one = data.RekapPasienDirawatKomorbid.find(
    (item: any) => item.tanggal === today
  );
  if (!one) {
    const timeNow = Math.floor(new Date().getTime() / 1000);
    const body = {
      tanggal: today,
      icu_dengan_ventilator_suspect_l: "0",
      icu_dengan_ventilator_suspect_p: "0",
      icu_dengan_ventilator_confirm_l: "0",
      icu_dengan_ventilator_confirm_p: "0",
      icu_tanpa_ventilator_suspect_l: "0",
      icu_tanpa_ventilator_suspect_p: "0",
      icu_tanpa_ventilator_confirm_l: "0",
      icu_tanpa_ventilator_confirm_p: "0",
      icu_tekanan_negatif_dengan_ventilator_suspect_l: "0",
      icu_tekanan_negatif_dengan_ventilator_suspect_p: "0",
      icu_tekanan_negatif_dengan_ventilator_confirm_l: "0",
      icu_tekanan_negatif_dengan_ventilator_confirm_p: "0",
      icu_tekanan_negatif_tanpa_ventilator_suspect_l: "0",
      icu_tekanan_negatif_tanpa_ventilator_suspect_p: "0",
      icu_tekanan_negatif_tanpa_ventilator_confirm_l: "0",
      icu_tekanan_negatif_tanpa_ventilator_confirm_p: "0",
      isolasi_tekanan_negatif_suspect_l: "0",
      isolasi_tekanan_negatif_suspect_p: "0",
      isolasi_tekanan_negatif_confirm_l: "0",
      isolasi_tekanan_negatif_confirm_p: "0",
      isolasi_tanpa_tekanan_negatif_suspect_l: "0",
      isolasi_tanpa_tekanan_negatif_suspect_p: "0",
      isolasi_tanpa_tekanan_negatif_confirm_l: "0",
      isolasi_tanpa_tekanan_negatif_confirm_p: "0",
      nicu_khusus_covid_suspect_l: "0",
      nicu_khusus_covid_suspect_p: "0",
      nicu_khusus_covid_confirm_l: "0",
      nicu_khusus_covid_confirm_p: "0",
      picu_khusus_covid_suspect_l: "0",
      picu_khusus_covid_suspect_p: "0",
      picu_khusus_covid_confirm_l: "0",
      picu_khusus_covid_confirm_p: "0",
    };
    await axios.post(`${url}/PasienDirawatKomorbid`, body, {
      headers: {
        "X-rs-id": rsId,
        "X-Timestamp": timeNow,
        "X-pass": pass,
      },
    });
    console.log("Berhasil Update Pasien Komorbid");
  }
};

export const setIntervalPasienKomorbid = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.params;
    if (status === "on" && !pasienKomorbidInterval) {
      await intervalPasienKomorbid();
      pasienKomorbidInterval = setInterval(intervalPasienKomorbid, updateTime);
    } else if (status === "off") {
      clearInterval(pasienKomorbidInterval);
      pasienKomorbidInterval = false;
    }
    res.status(200).json("success");
  }
);
export const getIntervalPasienKomorbid = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!pasienKomorbidInterval) {
      res.status(200).json("off");
    } else {
      res.status(200).json("on");
    }
  }
);

// INTERVAL FOR AUTOMATIC UPDATE PASIEN TANPA KOMORBID
const intervalPasienNonKomorbid = async () => {
  const timeNow1 = Math.floor(new Date().getTime() / 1000);
  const { data } = await axios.get(`${url}/PasienDirawatTanpaKomorbid`, {
    headers: {
      "X-rs-id": rsId,
      "X-Timestamp": timeNow1,
      "X-pass": pass,
    },
  });
  const today = format(new Date(), "yyyy-MM-dd");
  const one = data.RekapPasienDirawatTanpaKomorbid.find(
    (item: any) => item.tanggal === today
  );
  if (!one) {
    const timeNow = Math.floor(new Date().getTime() / 1000);
    const body = {
      tanggal: today,
      icu_dengan_ventilator_suspect_l: "0",
      icu_dengan_ventilator_suspect_p: "0",
      icu_dengan_ventilator_confirm_l: "0",
      icu_dengan_ventilator_confirm_p: "0",
      icu_tanpa_ventilator_suspect_l: "0",
      icu_tanpa_ventilator_suspect_p: "0",
      icu_tanpa_ventilator_confirm_l: "0",
      icu_tanpa_ventilator_confirm_p: "0",
      icu_tekanan_negatif_dengan_ventilator_suspect_l: "0",
      icu_tekanan_negatif_dengan_ventilator_suspect_p: "0",
      icu_tekanan_negatif_dengan_ventilator_confirm_l: "0",
      icu_tekanan_negatif_dengan_ventilator_confirm_p: "0",
      icu_tekanan_negatif_tanpa_ventilator_suspect_l: "0",
      icu_tekanan_negatif_tanpa_ventilator_suspect_p: "0",
      icu_tekanan_negatif_tanpa_ventilator_confirm_l: "0",
      icu_tekanan_negatif_tanpa_ventilator_confirm_p: "0",
      isolasi_tekanan_negatif_suspect_l: "0",
      isolasi_tekanan_negatif_suspect_p: "0",
      isolasi_tekanan_negatif_confirm_l: "0",
      isolasi_tekanan_negatif_confirm_p: "0",
      isolasi_tanpa_tekanan_negatif_suspect_l: "0",
      isolasi_tanpa_tekanan_negatif_suspect_p: "0",
      isolasi_tanpa_tekanan_negatif_confirm_l: "0",
      isolasi_tanpa_tekanan_negatif_confirm_p: "0",
      nicu_khusus_covid_suspect_l: "0",
      nicu_khusus_covid_suspect_p: "0",
      nicu_khusus_covid_confirm_l: "0",
      nicu_khusus_covid_confirm_p: "0",
      picu_khusus_covid_suspect_l: "0",
      picu_khusus_covid_suspect_p: "0",
      picu_khusus_covid_confirm_l: "0",
      picu_khusus_covid_confirm_p: "0",
    };
    await axios.post(`${url}/PasienDirawatTanpaKomorbid`, body, {
      headers: {
        "X-rs-id": rsId,
        "X-Timestamp": timeNow,
        "X-pass": pass,
      },
    });
    console.log("Berhasil Update Pasien Tanpa Komorbid");
  }
};

export const setIntervalPasienNonKomorbid = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.params;
    if (status === "on" && !pasienNonKomorbidInterval) {
      await intervalPasienNonKomorbid();
      pasienNonKomorbidInterval = setInterval(
        intervalPasienNonKomorbid,
        updateTime
      );
    } else if (status === "off") {
      clearInterval(pasienNonKomorbidInterval);
      pasienNonKomorbidInterval = false;
    }
    res.status(200).json("success");
  }
);
export const getIntervalPasienNonKomorbid = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!pasienNonKomorbidInterval) {
      res.status(200).json("off");
    } else {
      res.status(200).json("on");
    }
  }
);

// INTERVAL FOR AUTOMATIC UPDATE PASIEN KELUAR
const intervalPasienKeluar = async () => {
  const timeNow1 = Math.floor(new Date().getTime() / 1000);
  const { data } = await axios.get(`${url}/PasienKeluar`, {
    headers: {
      "X-rs-id": rsId,
      "X-Timestamp": timeNow1,
      "X-pass": pass,
    },
  });
  const today = format(new Date(), "yyyy-MM-dd");
  const one = data.RekapPasienKeluar.find(
    (item: any) => item.tanggal === today
  );
  if (!one) {
    const timeNow = Math.floor(new Date().getTime() / 1000);
    const body = {
      tanggal: today,
      sembuh: "0",
      discarded: "0",
      meninggal_komorbid: "0",
      meninggal_tanpa_komorbid: "0",
      meninggal_prob_pre_komorbid: "0",
      meninggal_prob_neo_komorbid: "0",
      meninggal_prob_bayi_komorbid: "0",
      meninggal_prob_balita_komorbid: "0",
      meninggal_prob_anak_komorbid: "0",
      meninggal_prob_remaja_komorbid: "0",
      meninggal_prob_dws_komorbid: "0",
      meninggal_prob_lansia_komorbid: "0",
      meninggal_prob_pre_tanpa_komorbid: "0",
      meninggal_prob_neo_tanpa_komorbid: "0",
      meninggal_prob_bayi_tanpa_komorbid: "0",
      meninggal_prob_balita_tanpa_komorbid: "0",
      meninggal_prob_anak_tanpa_komorbid: "0",
      meninggal_prob_remaja_tanpa_komorbid: "0",
      meninggal_prob_dws_tanpa_komorbid: "0",
      meninggal_prob_lansia_tanpa_komorbid: "0",
      meninggal_discarded_komorbid: "0",
      meninggal_discarded_tanpa_komorbid: "0",
      dirujuk: "0",
      isman: "0",
      aps: "0",
    };
    await axios.post(`${url}/PasienKeluar`, body, {
      headers: {
        "X-rs-id": rsId,
        "X-Timestamp": timeNow,
        "X-pass": pass,
      },
    });
    console.log("Berhasil Update Pasien Keluar");
  }
};

export const setIntervalPasienKeluar = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.params;
    if (status === "on" && !pasienKeluarInterval) {
      await intervalPasienKeluar();
      pasienKeluarInterval = setInterval(intervalPasienKeluar, updateTime);
    } else if (status === "off") {
      clearInterval(pasienKeluarInterval);
      pasienKeluarInterval = false;
    }
    res.status(200).json("success");
  }
);
export const getIntervalPasienKeluar = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!pasienKeluarInterval) {
      res.status(200).json("off");
    } else {
      res.status(200).json("on");
    }
  }
);
// API PASIEN MASUK

export const getPasienMasuk = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const timeNow = Math.floor(new Date().getTime() / 1000);
    const { data } = await axios.get(`${url}/PasienMasuk`, {
      headers: {
        "X-rs-id": rsId,
        "X-Timestamp": timeNow,
        "X-pass": pass,
      },
    });
    const finalData = data.RekapPasienMasuk.map((item: any) => ({
      ...item,
      id: item.tanggal,
      tanggal: formatDateUi(item.tanggal),
    }));
    res.status(200).json(finalData);
  }
);

export const createPasienMasuk = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const timeNow = Math.floor(new Date().getTime() / 1000);
    const body = req.body;

    const { data } = await axios.post(`${url}/PasienMasuk`, body, {
      headers: {
        "X-rs-id": rsId,
        "X-Timestamp": timeNow,
        "X-pass": pass,
      },
    });

    res.status(201).json(data);
  }
);

export const deletePasienMasuk = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { tanggal } = req.params;
    const timeNow = Math.floor(new Date().getTime() / 1000);
    await axios.delete(`${url}/PasienMasuk`, {
      data: { tanggal },
      headers: {
        "X-rs-id": rsId,
        "X-Timestamp": timeNow,
        "X-pass": pass,
      },
    });
    res.status(204).json(null);
  }
);

// API PASIEN KOMORBID
export const getPasienKomorbid = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const timeNow = Math.floor(new Date().getTime() / 1000);
    const { data } = await axios.get(`${url}/PasienDirawatKomorbid`, {
      headers: {
        "X-rs-id": rsId,
        "X-Timestamp": timeNow,
        "X-pass": pass,
      },
    });
    const finalData = data.RekapPasienDirawatKomorbid.map((item: any) => ({
      ...item,
      id: item.tanggal,
      tanggal: formatDateUi(item.tanggal),
    }));
    res.status(200).json(finalData);
  }
);
export const createPasienKomorbid = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const timeNow = Math.floor(new Date().getTime() / 1000);
    const body = req.body;
    await axios.post(`${url}/PasienDirawatKomorbid`, body, {
      headers: {
        "X-rs-id": rsId,
        "X-Timestamp": timeNow,
        "X-pass": pass,
      },
    });

    res
      .status(200)
      .json({ status: "200", message: "Berhasil Update Data Pasien Komorbid" });
  }
);

// API PASIEN NON KOMORBID
export const getPasienNonKomorbid = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const timeNow = Math.floor(new Date().getTime() / 1000);
    const { data } = await axios.get(`${url}/PasienDirawatTanpaKomorbid`, {
      headers: {
        "X-rs-id": rsId,
        "X-Timestamp": timeNow,
        "X-pass": pass,
      },
    });
    const finalData = data.RekapPasienDirawatTanpaKomorbid.map((item: any) => ({
      ...item,
      id: item.tanggal,
      tanggal: formatDateUi(item.tanggal),
    }));
    res.status(200).json(finalData);
  }
);
export const createPasienNonKomorbid = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const timeNow = Math.floor(new Date().getTime() / 1000);
    const body = req.body;
    await axios.post(`${url}/PasienDirawatTanpaKomorbid`, body, {
      headers: {
        "X-rs-id": rsId,
        "X-Timestamp": timeNow,
        "X-pass": pass,
      },
    });

    res.status(200).json({
      status: "200",
      message: "Berhasil Tambah/Update Data Pasien Tanpa Komorbid",
    });
  }
);

// API Pasien Keluar
export const getRefPasienKeluar = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const timeNow = Math.floor(new Date().getTime() / 1000);
    const { data } = await axios.get(
      `http://sirs.kemkes.go.id/fo/index.phpReferensi/usia_meninggal_probable`,
      {
        headers: {
          "X-rs-id": rsId,
          "X-Timestamp": timeNow,
          "X-pass": pass,
        },
      }
    );
    res.status(200).json(data);
  }
);

export const getPasienKeluar = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const timeNow = Math.floor(new Date().getTime() / 1000);
    const { data } = await axios.get(`${url}/PasienKeluar`, {
      headers: {
        "X-rs-id": rsId,
        "X-Timestamp": timeNow,
        "X-pass": pass,
      },
    });
    const finalData = data.RekapPasienKeluar.map((item: any) => ({
      ...item,
      id: item.tanggal,
      tanggal: formatDateUi(item.tanggal),
    }));
    res.status(200).json(finalData);
  }
);

export const createPasienKeluar = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const timeNow = Math.floor(new Date().getTime() / 1000);
    const body = req.body;
    await axios.post(`${url}/PasienKeluar`, body, {
      headers: {
        "X-rs-id": rsId,
        "X-Timestamp": timeNow,
        "X-pass": pass,
      },
    });

    res.status(200).json({
      status: "200",
      message: "Berhasil Tambah/Update Data Pasien Keluar",
    });
  }
);

export const deletePasienKeluar = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { tanggal } = req.params;
    const timeNow = Math.floor(new Date().getTime() / 1000);
    await axios.delete(`${url}/PasienKeluar`, {
      data: { tanggal },
      headers: {
        "X-rs-id": rsId,
        "X-Timestamp": timeNow,
        "X-pass": pass,
      },
    });
    res.status(204).json(null);
  }
);

// API PASIEN IGD TRIASE
export const getPasienTriase = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const timeNow = Math.floor(new Date().getTime() / 1000);
    const { data } = await axios.get(
      "http://sirs.kemkes.go.id/fo/index.php/Pasien/igd_triase",
      {
        headers: {
          "x-rs-id": rsId,
          "x-timestamp": timeNow,
          "x-pass": pass,
        },
      }
    );
    const finalData = data.IGDTriase.map((item: any, index: number) => ({
      ...item,
      id: item.tanggal,
      tanggal: formatDateUi(item.tanggal),
    }));
    res.status(200).json(finalData);
  }
);
export const createPasienTriase = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const timeNow = Math.floor(new Date().getTime() / 1000);
    const body = { ...req.body, tgllapor: undefined, id: undefined };
    const { data } = await axios.post(
      "http://sirs.kemkes.go.id/fo/index.php/Pasien/igd_triase",
      body,
      {
        headers: {
          "x-rs-id": rsId,
          "x-timestamp": timeNow,
          "x-pass": pass,
        },
      }
    );
    res.status(200).json(data);
  }
);

// INTERVAL FOR AUTOMATIC UPDATE PASIEN Triase
const intervalPasienTriase = async () => {
  const timeNow1 = Math.floor(new Date().getTime() / 1000);
  const { data } = await axios.get(
    "http://sirs.kemkes.go.id/fo/index.php/Pasien/igd_triase",
    {
      headers: {
        "X-rs-id": rsId,
        "X-Timestamp": timeNow1,
        "X-pass": pass,
      },
    }
  );
  const today = format(new Date(), "yyyy-MM-dd");
  const one = data.IGDTriase.find((item: any) => item.tanggal === today);
  if (!one) {
    const timeNow = Math.floor(new Date().getTime() / 1000);
    const body = {
      tanggal: today,
      igd_suspek: "0",
      igd_konfirmasi: "0",
      g_ringan_murni_covid: "0",
      g_ringan_komorbid: "0",
      g_ringan_koinsiden: "0",
      g_sedang: "0",
      g_berat: "0",
      igd_dirujuk: "0",
    };
    await axios.post(
      "http://sirs.kemkes.go.id/fo/index.php/Pasien/igd_triase",
      body,
      {
        headers: {
          "X-rs-id": rsId,
          "X-Timestamp": timeNow,
          "X-pass": pass,
        },
      }
    );
    console.log("Berhasil Update Pasien IGD Triase");
  }
};

export const setIntervalPasienTriase = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.params;
    if (status === "on" && !pasienTriaseInterval) {
      await intervalPasienTriase();
      pasienTriaseInterval = setInterval(intervalPasienTriase, updateTime);
    } else if (status === "off") {
      clearInterval(pasienTriaseInterval);
      pasienTriaseInterval = false;
    }
    res.status(200).json("success");
  }
);
export const getIntervalPasienTriase = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!pasienTriaseInterval) {
      res.status(200).json("off");
    } else {
      res.status(200).json("on");
    }
  }
);
