import { Router, type IRouter } from "express";
import healthRouter from "./health";
import identifyRouter from "./identify";

const router: IRouter = Router();

router.use(healthRouter);
router.use(identifyRouter);

export default router;
