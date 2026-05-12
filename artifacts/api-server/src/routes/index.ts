import { Router, type IRouter } from "express";
import healthRouter from "./health";
import meRouter from "./me";
import chatRouter from "./chat";
import uploadRouter from "./upload";
import quizRouter from "./quiz";
import paymentRouter from "./payment";
import adminRouter from "./admin";
import controlRouter from "./control";

const router: IRouter = Router();

router.use(healthRouter);
router.use(meRouter);
router.use(chatRouter);
router.use(uploadRouter);
router.use(quizRouter);
router.use(paymentRouter);
router.use(adminRouter);
router.use(controlRouter);

export default router;
