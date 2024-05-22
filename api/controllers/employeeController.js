import employeeService from '../services/employeeService.js';
import { catchAsync } from '../utils/error.js';

const getDepartmentSalaryAndEmployeeStats = async (req, res, next) => {
  try {
    const { search_date = '1993-01-31' } = req.query;

    if (!search_date) {
      const error = new Error('Search date is required');
      error.status = 404;
      throw error;
    }

    const salaryByDept = await employeeService.getSalaryByDept(search_date);

    const totalSalary = salaryByDept.reduce((total, dept) => total + BigInt(dept.total_salary), BigInt(0)).toString();

    const [{ total_employees, male_count, female_count }] = await employeeService.getEmpCountByGender(search_date);

    const jobTurnover = await employeeService.jobTurnover(search_date);

    let getDepartmentInfo = await employeeService.getDepartmentInfo(search_date);

    getDepartmentInfo = await Promise.all(getDepartmentInfo.map(async (deptInfo) => {
      const matchingSalaryDept = salaryByDept.find(salaryDept => salaryDept.dept_no === deptInfo.dept_no);
      if (matchingSalaryDept) {
        return {
          ...deptInfo,
          total_employees: matchingSalaryDept.total_employees
        };
      } else {
        return deptInfo;
      }
    }));

    res.status(200).json({
      salaryByDept,
      totalSalary,
      total_employees,
      male_count,
      female_count,
      jobTurnover,
      getDepartmentInfo
    });
  } catch (error) {
    next(error);
  }
};

const getEmployeeList = catchAsync(async (req, res) => {
  const { page = 1, limit = 15, dep_no = 'd005', search_date = '1993-01-31' } = req.query;
  const [employeeList, totalPages] = await employeeService.getEmployeeList(page, limit, dep_no, search_date);
  res.status(200).json({ data: employeeList, totalPages });
});

const getEmployeeTurnoverDetails = catchAsync(async (req, res) => {
  const { search_date = '1993-01-31' } = req.query;
  const [ joinedEmployees, leftEmployees ] = await employeeService.getEmployeeTurnoverDetails(search_date);
  res.status(200).json({ joinedEmployees, leftEmployees });
});

export default {
  getDepartmentSalaryAndEmployeeStats,
  getEmployeeList,
  getEmployeeTurnoverDetails
};