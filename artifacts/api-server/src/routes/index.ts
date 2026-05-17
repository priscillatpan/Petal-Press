import { Router, type IRouter } from "express";
import healthRouter from "./health";
import identifyRouter from "./identify";
import illustrateRouter from "./illustrate";

const router: IRouter = Router();

router.use(healthRouter);
router.use(identifyRouter);
router.use(illustrateRouter);

export default router;
