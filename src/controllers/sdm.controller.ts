import axios from "axios";
import { Request, Response, NextFunction } from "express";
import { format } from "date-fns";
import { DBFFile } from "dbffile";
import catchAsync from "../utils/catchAsync";
import { formatDateUi } from "../utils/helper";
import { rsId, pass } from "../env";
// BPJS KEY
const url = "http://sirs.kemkes.go.id/fo/index.php/Fasyankes/sdm";

let sdmInterval: any;

// const updateTime = 1000;
const updateTime = 12 * 60 * 60 * 1000;

const intervalSdm = async () => {
  const timeNow = Math.floor(new Date().getTime() / 1000);
  const { data } = await axios.get(`${url}`, {
    headers: {
      "X-rs-id": rsId,
      "X-Timestamp": timeNow,
      "X-pass": pass,
    },
  });
  await Promise.allSettled(
    data.sdm.map(async (item: any) => {
      const sdm = {
        id_kebutuhan: item.id_kebutuhan,
        jumlah_eksisting: item.jumlah_eksisting,
        jumlah: item.jumlah,
        jumlah_diterima: item.jumlah_diterima,
      };

      await axios.put(`${url}`, sdm, {
        headers: {
          "X-rs-id": rsId,
          "X-Timestamp": timeNow,
          "X-pass": pass,
        },
      });
      return true;
    })
  );
  console.log("Berhasil Update SDM");
};
export const setIntervalSdm = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.params;
    if (status === "on" && !sdmInterval) {
      await intervalSdm();
      sdmInterval = setInterval(intervalSdm, updateTime);
    } else if (status === "off") {
      clearInterval(sdmInterval);
      sdmInterval = false;
    }
    res.status(200).json("success");
  }
);
export const getIntervalSdm = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!sdmInterval) {
      res.status(200).json("off");
    } else {
      res.status(200).json("on");
    }
  }
);

export const getRefSdm = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const timeNow = Math.floor(new Date().getTime() / 1000);
    const { data } = await axios.get(
      `http://sirs.kemkes.go.id/fo/index.php/Referensi/kebutuhan_sdm`,
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

export const getAllSdm = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const timeNow = Math.floor(new Date().getTime() / 1000);
    const { data } = await axios.get(`${url}`, {
      headers: {
        "X-rs-id": rsId,
        "X-Timestamp": timeNow,
        "X-pass": pass,
      },
    });
    const finalData = data.sdm.filter((item: any) => item.jumlah !== null);
    res.status(200).json(finalData);
  }
);
export const createSdm = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const timeNow = Math.floor(new Date().getTime() / 1000);
    const { data } = await axios.post(`${url}`, body, {
      headers: {
        "X-rs-id": rsId,
        "X-Timestamp": timeNow,
        "X-pass": pass,
      },
    });
    res.status(200).json(data);
  }
);
export const updateSdm = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const timeNow = Math.floor(new Date().getTime() / 1000);
    const data = Object.keys(body).map(async (item) => {
      const sdm = {
        id_kebutuhan: body[item].id_kebutuhan,
        jumlah_eksisting: body[item].jumlah_eksisting,
        jumlah: body[item].jumlah,
        jumlah_diterima: body[item].jumlah_diterima,
      };

      await axios.put(`${url}`, sdm, {
        headers: {
          "X-rs-id": rsId,
          "X-Timestamp": timeNow,
          "X-pass": pass,
        },
      });
      return true;
    });

    res.status(200).json(data);
  }
);
