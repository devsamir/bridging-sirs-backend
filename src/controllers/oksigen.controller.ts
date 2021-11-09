import axios from "axios";
import { Request, Response, NextFunction } from "express";
import { format } from "date-fns";
import catchAsync from "../utils/catchAsync";
import { formatDateUi } from "../utils/helper";
import { rsId, pass } from "../env";
// BPJS KEY
const url = "http://sirs.kemkes.go.id/fo/index.php/Logistik/oksigen";

let oksigenInterval: any;

// const updateTime = 1000;
const updateTime = 6 * 60 * 60 * 1000;
const intervalOksigen = async () => {
  const timeNow1 = Math.floor(new Date().getTime() / 1000);
  const { data } = await axios.get(`${url}`, {
    headers: {
      "X-rs-id": rsId,
      "X-Timestamp": timeNow1,
      "X-pass": pass,
    },
  });
  const today = format(new Date(), "yyyy-MM-dd");
  const one = data.Oksigenasi.find((item: any) => item.tanggal === today);
  if (!one) {
    const timeNow = Math.floor(new Date().getTime() / 1000);
    const body = {
      tanggal: today,
      p_cair: data.Oksigenasi[0].p_cair,
      p_tabung_kecil: data.Oksigenasi[0].p_tabung_kecil,
      p_tabung_sedang: data.Oksigenasi[0].p_tabung_sedang,
      p_tabung_besar: data.Oksigenasi[0].p_tabung_besar,
      k_isi_cair: data.Oksigenasi[0].k_isi_cair,
      k_isi_tabung_kecil: data.Oksigenasi[0].k_isi_tabung_kecil,
      k_isi_tabung_sedang: data.Oksigenasi[0].k_isi_tabung_sedang,
      k_isi_tabung_besar: data.Oksigenasi[0].k_isi_tabung_besar,
    };
    await axios.post(`${url}`, body, {
      headers: {
        "X-rs-id": rsId,
        "X-Timestamp": timeNow,
        "X-pass": pass,
      },
    });
    console.log("Berhasil Update Data Oksigen");
  }
};

export const setIntervalOksigen = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.params;
    if (status === "on" && !oksigenInterval) {
      await intervalOksigen();
      oksigenInterval = setInterval(intervalOksigen, updateTime);
    } else if (status === "off") {
      clearInterval(oksigenInterval);
      oksigenInterval = false;
    }
    res.status(200).json("success");
  }
);
export const getIntervalOksigen = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!oksigenInterval) {
      res.status(200).json("off");
    } else {
      res.status(200).json("on");
    }
  }
);

export const getAllOksigen = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const timeNow = Math.floor(new Date().getTime() / 1000);
    const { data } = await axios.get(`${url}`, {
      headers: {
        "X-rs-id": rsId,
        "X-Timestamp": timeNow,
        "X-pass": pass,
      },
    });
    const finalData = data.Oksigenasi.map((item: any) => {
      return {
        ...item,
        id: item.tanggal,
        tanggal: formatDateUi(item.tanggal),
        tgllapor: undefined,
      };
    });
    res.status(200).json(finalData);
  }
);

export const createOksigen = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const timeNow = Math.floor(new Date().getTime() / 1000);
    const body = { ...req.body, id: undefined };
    const { data } = await axios.post(`${url}`, body, {
      headers: {
        "x-rs-id": rsId,
        "x-timestamp": timeNow,
        "x-pass": pass,
      },
    });
    res.status(200).json(data);
  }
);
