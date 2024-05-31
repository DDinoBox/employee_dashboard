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

const getEmployeeTurnoverDetails = async (search_date) => {
  try {
    const formattedDate = new Date(search_date);
    formattedDate.setFullYear(formattedDate.getFullYear() - 1);
    formattedDate.setDate(1);
    const twelveMonthsAgo = formattedDate.toISOString().slice(0, 10);

    const [joinEmployeeDetails, leftEmployeeDetails] = await Promise.all([
      employeeDao.getJoinEmployeeDetails(search_date, twelveMonthsAgo),
      employeeDao.getLeaveEmployeeDetails(search_date, twelveMonthsAgo)
    ]);
    return [joinEmployeeDetails, leftEmployeeDetails];
  } catch (error) {
    throw error;
  }
};

export default { 
  getEmployeeList,
  getEmployeeTurnoverDetails
};