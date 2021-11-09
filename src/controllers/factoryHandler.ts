import { EntityTarget, getManager } from "typeorm";
import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import { validate } from "class-validator";
import formError from "../utils/formError";
import AppError from "../utils/appError";
const { unlink } = require("fs").promises;
export const createOne = (Model: EntityTarget<any>, options: any) =>
  catchAsync(
    async (req: any, res: Response, next: NextFunction): Promise<any> => {
      const body = req.body;
      const image = {} as any;
      if (req.file && options?.image) image[options.image] = req.file.path;
      const manager = getManager();
      const newData = manager.create(Model, { ...body, ...image });
      const errors = await validate(newData);
      if (errors.length > 0) return formError(errors, res);
      await manager.save(newData);
      res.status(201).json(newData);
    }
  );
export const getOne = (Model: EntityTarget<any>) =>
  catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const { id } = req.params;
      const manager = getManager();
      const data = await manager.findOne(Model, { where: { id } });
      if (!data)
        return next(
          new AppError("data dengan ID yang diberikan tidak ditemukan", 400)
        );
      res.status(200).json(data);
    }
  );
export const updateOne = (Model: EntityTarget<any>, options: any) =>
  catchAsync(
    async (req: any, res: Response, next: NextFunction): Promise<any> => {
      const { id } = req.params;
      const body = req.body;
      const image = {} as any;
      if (req.file && options?.image) image[options.image] = req.file.path;
      const manager = getManager();
      const cekData = await manager.findOne(Model, { where: { id } });
      if (!cekData)
        return next(
          new AppError("data dengan ID yang diberikan tidak ditemukan", 400)
        );
      let oldPath = "";
      if (options?.image) oldPath = cekData[options.image];
      const newData = manager.create(Model, { ...body, ...image });
      const errors = await validate(newData);
      if (errors.length > 0) return formError(errors, res);
      await manager.update(Model, { id }, { ...body, ...image });
      if (req.file && options?.image)
        await unlink(oldPath).catch((err: any) => {});
      res.status(200).json({ ...newData, id });
    }
  );
export const deleteOne = (Model: EntityTarget<any>, options: any) =>
  catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const { id } = req.params;
      const manager = getManager();
      if (options?.image) {
        const cekData = await manager.findOne(Model, { where: { id } });
        if (!cekData)
          return next(
            new AppError("data dengan ID yang diberikan tidak ditemukan", 400)
          );
        const oldPath = cekData[options.image];
        await manager.delete(Model, { id });
        await unlink(oldPath).catch((err: any) => {});
        res.status(204).json(null);
      } else {
        await manager.delete(Model, { id });
        res.status(204).json(null);
      }
    }
  );
export const softDeleteOne = (Model: EntityTarget<any>) =>
  catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const { id } = req.params;
      const manager = getManager();
      await manager.update(Model, { id }, { active: false } as any);
      res.status(204).json(null);
    }
  );
