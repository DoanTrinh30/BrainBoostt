import { NextFunction, Request, Response } from "express";

export const checkOrigin = (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    console.log("Origin: ", origin);
    return origin ? next() : res.status(403).send("Forbidden");
};
