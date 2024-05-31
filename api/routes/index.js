import express from 'express';
import employeeRouter from './employeeRouter.js';

const router = express.Router();

router.use('/employee', employeeRouter);

export { router };