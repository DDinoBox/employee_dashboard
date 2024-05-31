import { dataSource } from './dataSource.js';

const getTotalEmployeesByDept = async (dept_no, search_date) => {
  try {
    const query = `
      SELECT COUNT(*) AS total_employees
      FROM employees e
      JOIN dept_emp de ON e.emp_no = de.emp_no
      JOIN salaries s ON e.emp_no = s.emp_no
      JOIN titles t ON e.emp_no = t.emp_no
      JOIN departments d ON de.dept_no = d.dept_no
      WHERE ? BETWEEN de.from_date AND de.to_date
        AND ? BETWEEN s.from_date AND s.to_date
        AND ? BETWEEN t.from_date AND t.to_date
        AND de.dept_no = ?;
    `;
    const values = [search_date, search_date, search_date, dept_no];
    
    const totalEmployees = await dataSource.query(query, values);
    return totalEmployees[0].total_employees;
  } catch (error) {
    throw error;
  }
};

const getEmployeeDetailsByDept = async (offset, limit, dept_no, search_date) => {
  try {
    const query = `
      SELECT
        e.emp_no,
        e.first_name,
        e.last_name,
        de.dept_no,
        d.dept_name,
        t.title,
        s.salary,
        DATE_FORMAT(e.hire_date, '%Y-%m-%d') AS hire_date,
        DATE_FORMAT(de.from_date, '%Y-%m-%d') AS dept_from_date,
        DATE_FORMAT(e.birth_date, '%Y-%m-%d') AS birth_date,
        e.gender
      FROM employees e
      JOIN dept_emp de ON e.emp_no = de.emp_no
      JOIN salaries s ON e.emp_no = s.emp_no
      JOIN titles t ON e.emp_no = t.emp_no
      JOIN departments d ON de.dept_no = d.dept_no
      WHERE ? BETWEEN de.from_date AND de.to_date
        AND ? BETWEEN s.from_date AND s.to_date
        AND ? BETWEEN t.from_date AND t.to_date
        AND de.dept_no = ?
      ORDER BY e.emp_no
      LIMIT ?, ?;
    `;
    const values = [search_date, search_date, search_date, dept_no, offset, limit];
    
    const employeeDetails = await dataSource.query(query, values);
    return employeeDetails;
  } catch (error) {
    throw error;
  }
};

const getJoinEmployeeDetails = async (search_date) => {
  try {
    const joinEmployees = await dataSource.query(
      `
      SELECT 
        emp_no,
        first_name,
        last_name,
        gender,
        DATE_FORMAT(birth_date, '%Y-%m-%d') AS birth_date,
        DATE_FORMAT(hire_date, '%Y-%m-%d') AS hire_date
      FROM 
        employees
      WHERE 
        DATE_FORMAT(hire_date, '%Y-%m') = DATE_FORMAT(?, '%Y-%m')
      ORDER BY 
        hire_date;
      `,
      [search_date]
    );
    return joinEmployees;
  } catch (error) {
    throw error;
  }
};

const getLeaveEmployeeDetails = async (search_date) => {
  try {
    const leftEmployeeDetails = await dataSource.query(
      `
      SELECT
        e.emp_no,
        e.first_name,
        e.last_name,
        e.gender,
        DATE_FORMAT(e.birth_date, '%Y-%m-%d') AS birth_date,
        DATE_FORMAT(de.to_date, '%Y-%m-%d') AS leave_date
      FROM
        employees e
      JOIN
        dept_emp de ON e.emp_no = de.emp_no
      WHERE 
        DATE_FORMAT(de.to_date, '%Y-%m') = DATE_FORMAT(?, '%Y-%m')
        AND de.to_date <> '9999-01-01'
      ORDER BY
        de.to_date;
      `,
      [search_date]
    );
    return leftEmployeeDetails;
  } catch (error) {
    throw error;
  }
};

export default {
  getTotalEmployeesByDept,
  getEmployeeDetailsByDept,
  getJoinEmployeeDetails,
  getLeaveEmployeeDetails
};