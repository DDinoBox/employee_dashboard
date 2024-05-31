import express from 'express';
import employeeController from '../controllers/employeeController.js';

const employeeRouter = express.Router();

employeeRouter.get('/list', employeeController.getEmployeeList);

export default employeeRouter;