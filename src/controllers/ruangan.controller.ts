import axios from "axios";
import { Request, Response, NextFunction } from "express";
import { format } from "date-fns";
import { DBFFile } from "dbffile";
import catchAsync from "../utils/catchAsync";
import { formatDateUi } from "../utils/helper";
import { rsId, pass } from "../env";

// BPJS KEY
const url = "http://sirs.kemkes.go.id/fo/index.php/Fasyankes";
const ruanganDbf: any = new URL("file://X:/al_rs/DATA/RUANGAN.DBF");

// Array of Object pair ruangan
const pairRuangan = [
  { local: "RMAR1", bpjs: "4282" },
  { local: "RARO1", bpjs: "4300" },
  { local: "RMIN1", bpjs: "4301" },
  { local: "RMAR2", bpjs: "4302" },
  { local: "RMIN2", bpjs: "4303" },
  { local: "RSHO1", bpjs: "4304" },
  { local: "RSHO2", bpjs: "4305" },
  { local: "RSHO3", bpjs: "4306" },
  { local: "RMIN3", bpjs: "4307" },
  { local: "RARO3", bpjs: "4309" },
  { local: "RMINV", bpjs: "4310" },
  { local: "RSHOV", bpjs: "4311" },
  { local: "RMULV", bpjs: "4313" },
  { local: "RAROV", bpjs: "4314" },
  { local: "RMAR3", bpjs: "5934930" },
  { local: "RARO2", bpjs: "5934947" },
  { local: "RMARH", bpjs: "5934959" },
  { local: "RMINH", bpjs: "5934963" },
];
const ruangCovid = [
  "66978",
  "66979",
  "66980",
  "66981",
  "66982",
  "66983",
  "66984",
  "66985",
  "78742",
  "78743",
];

let ruanganInterval: any;

// const updateTime = 1000;
const updateTime = 12 * 60 * 60 * 1000;

const intervalRuangan = async () => {
  const timeNow = Math.floor(new Date().getTime() / 1000);

  let dbf = await DBFFile.open(ruanganDbf);
  const records = await dbf.readRecords(100);
  await Promise.all(
    pairRuangan.map(async (item) => {
      const local: any = records.find((r) => r.KODE === item.local);
      const ruangan = {
        id_t_tt: item.bpjs,
        jumlah_ruang: 0,
        jumlah: `${local.J_BED}`,
        terpakai: `${local.J_ISI}`,
        antrian: 0,
        prepare: 0,
        prepare_plan: 0,
        covid: 0,
      };
      await axios.put(`${url}`, ruangan, {
        headers: {
          "X-rs-id": rsId,
          "X-Timestamp": timeNow,
          "X-pass": pass,
        },
      });
      return true;
    })
  );
  const icua: any = records.find((r) => r.KODE === "RICUA");
  const icub: any = records.find((r) => r.KODE === "RICUB");
  const ruangan = {
    id_t_tt: "4317",
    jumlah_ruang: 0,
    jumlah: `${Number(icua.J_BED) + Number(icub.J_BED)}`,
    terpakai: `${Number(icua.J_ISI) + Number(icub.J_ISI)}`,
    antrian: 0,
    prepare: 0,
    prepare_plan: 0,
    covid: 0,
  };
  await axios.put(`${url}`, ruangan, {
    headers: {
      "X-rs-id": rsId,
      "X-Timestamp": timeNow,
      "X-pass": pass,
    },
  });
  await Promise.all(
    ruangCovid.map(async (item) => {
      const body = {
        id_t_tt: item,
        jumlah_ruang: 0,
        jumlah: 0,
        terpakai: 0,
        antrian: 0,
        prepare: 0,
        prepare_plan: 0,
        covid: 0,
      };

      await axios.put(`${url}`, body, {
        headers: {
          "X-rs-id": rsId,
          "X-Timestamp": timeNow,
          "X-pass": pass,
        },
      });
      return true;
    })
  );
  console.log("Berhasil Update Ruangan");
};
export const setIntervalRuangan = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.params;
    if (status === "on" && !ruanganInterval) {
      await intervalRuangan();
      ruanganInterval = setInterval(intervalRuangan, updateTime);
    } else if (status === "off") {
      clearInterval(ruanganInterval);
      ruanganInterval = false;
    }
    res.status(200).json("success");
  }
);
export const getIntervalRuangan = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!ruanganInterval) {
      res.status(200).json("off");
    } else {
      res.status(200).json("on");
    }
  }
);

// Data Ruangan Dan Tempat Tidur

export const getRefTempatTidur = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const timeNow = Math.floor(new Date().getTime() / 1000);
    const { data } = await axios.get(
      `http://sirs.kemkes.go.id/fo/index.php/Referensi/tempat_tidur`,
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

export const getTempatTidur = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const timeNow = Math.floor(new Date().getTime() / 1000);
    const { data } = await axios.get(`${url}`, {
      headers: {
        "X-rs-id": rsId,
        "X-Timestamp": timeNow,
        "X-pass": pass,
      },
    });

    const finalData = data.fasyankes.reduce((acc: any, curr: any) => {
      if (curr.id_t_tt !== null && curr.id_tt > 23)
        acc = { ...acc, [curr.id_t_tt]: { ...curr } };
      return acc;
    }, {});
    res.status(200).json(finalData);
  }
);
export const createTempatTidur = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const timeNow = Math.floor(new Date().getTime() / 1000);
    const ruangan = {
      id_tt: body.id_tt,
      ruang: body.ruang,
      jumlah_ruang: body.jumlah_ruang,
      jumlah: body.jumlah,
      terpakai: body.terpakai,
      antrian: body.antrian,
      prepare: body.prepare,
      prepare_plan: body.prepare_plan,
      covid: body.covid,
    };
    const { data } = await axios.post(`${url}`, ruangan, {
      headers: {
        "X-rs-id": rsId,
        "X-Timestamp": timeNow,
        "X-pass": pass,
      },
    });

    res.status(200).json(data);
  }
);

export const deleteTempatTidur = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const timeNow = Math.floor(new Date().getTime() / 1000);
    const { data } = await axios.delete(`${url}`, {
      data: { id_t_tt: id },
      headers: {
        "X-rs-id": rsId,
        "X-Timestamp": timeNow,
        "X-pass": pass,
      },
    });

    res.status(200).json(data);
  }
);
export const updateTempatTidur = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const timeNow = Math.floor(new Date().getTime() / 1000);
    const data = Object.keys(body).map(async (item) => {
      const ruangan = {
        id_t_tt: body[item].id_t_tt,
        jumlah_ruang: body[item].jumlah_ruang,
        jumlah: body[item].jumlah,
        terpakai: body[item].terpakai,
        antrian: body[item].antrian,
        prepare: body[item].prepare,
        prepare_plan: body[item].prepare_plan,
        covid: body[item].covid,
      };
      await axios.put(`${url}`, ruangan, {
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
