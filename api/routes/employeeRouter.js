import express from 'express';
import employeeController from '../controllers/employeeController.js';

const employeeRouter = express.Router();

employeeRouter.get('/department-stats', employeeController.getDepartmentSalaryAndEmployeeStats);
employeeRouter.get('/list', employeeController.getEmployeeList);
employeeRouter.get('/job-turnover', employeeController.getEmployeeTurnoverDetails);

export default employeeRouter;