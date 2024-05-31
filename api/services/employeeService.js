import employeeDao from '../models/employeeDao.js';

const getEmployeeList = async (page, limit, dep_no, search_date) => {
  try {
    const offset = (page - 1) * limit;
    const [employeeDetails, totalEmployees] = await Promise.all([
      employeeDao.getEmployeeDetailsByDept(offset, limit, dep_no, search_date),
      employeeDao.getTotalEmployeesByDept(dep_no, search_date)
    ]);
    const totalPages = Math.ceil(totalEmployees / limit);
    return [employeeDetails, totalPages];
  } catch (error) {
    throw error;
  }
};

export default { 
  getEmployeeList
};