import axios from "axios";
import { Request, Response, NextFunction } from "express";
import { format } from "date-fns";
import { DBFFile } from "dbffile";
import catchAsync from "../utils/catchAsync";
import { formatDateUi } from "../utils/helper";
import { rsId, pass } from "../env";
// BPJS KEY
const url = "http://sirs.kemkes.go.id/fo/index.php/Fasyankes/apd";

let apdInterval: any;

// const updateTime = 1000;
const updateTime = 24 * 60 * 60 * 1000;

const intervalApd = async () => {
  const timeNow = Math.floor(new Date().getTime() / 1000);
  const { data } = await axios.get(`${url}`, {
    headers: {
      "X-rs-id": rsId,
      "X-Timestamp": timeNow,
      "X-pass": pass,
    },
  });
  await Promise.allSettled(
    data.apd.map(async (item: any) => {
      const apd = {
        id_kebutuhan: item.id_kebutuhan,
        jumlah_eksisting: item.jumlah_eksisting,
        jumlah: item.jumlah,
        jumlah_diterima: item.jumlah_diterima,
      };

      await axios.put(`${url}`, apd, {
        headers: {
          "X-rs-id": rsId,
          "X-Timestamp": timeNow,
          "X-pass": pass,
        },
      });
      return true;
    })
  );
  console.log("Berhasil Update APD");
};
export const setIntervalApd = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.params;
    if (status === "on" && !apdInterval) {
      await intervalApd();
      apdInterval = setInterval(intervalApd, updateTime);
    } else if (status === "off") {
      clearInterval(apdInterval);
      apdInterval = false;
    }
    res.status(200).json("success");
  }
);
export const getIntervalApd = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!apdInterval) {
      res.status(200).json("off");
    } else {
      res.status(200).json("on");
    }
  }
);

export const getAllApd = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const timeNow = Math.floor(new Date().getTime() / 1000);
    const { data } = await axios.get(`${url}`, {
      headers: {
        "X-rs-id": rsId,
        "X-Timestamp": timeNow,
        "X-pass": pass,
      },
    });
    const finalData = data.apd.reduce((acc: any, curr: any) => {
      acc = { ...acc, [curr.id_kebutuhan]: curr };
      return acc;
    }, {});
    res.status(200).json(finalData);
  }
);

export const updateApd = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const timeNow = Math.floor(new Date().getTime() / 1000);
    const data = Object.keys(body).map(async (item) => {
      const apd = {
        id_kebutuhan: body[item].id_kebutuhan,
        jumlah_eksisting: body[item].jumlah_eksisting,
        jumlah: body[item].jumlah,
        jumlah_diterima: body[item].jumlah_diterima,
      };
      await axios.put(`${url}`, apd, {
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
