import { dataSource } from './dataSource.js';

const getEmpCountByGender = async (search_date) => {
  try {
    const query = `
    SELECT
      COUNT(DISTINCT e.emp_no) AS total_employees,
      SUM(CASE WHEN e.gender = 'M' THEN 1 ELSE 0 END) AS male_count,
      SUM(CASE WHEN e.gender = 'F' THEN 1 ELSE 0 END) AS female_count
    FROM
      employees e
    JOIN
      dept_emp de ON e.emp_no = de.emp_no
    WHERE
      ? BETWEEN de.from_date AND de.to_date
      AND (de.emp_no, de.to_date) IN (
          SELECT emp_no, MAX(to_date) as max_to_date
          FROM dept_emp
          WHERE ? BETWEEN from_date AND to_date
          GROUP BY emp_no
      );
    `;
    const values = [search_date, search_date];
    
    const totalEmpCount = await dataSource.query(query, values);
    return totalEmpCount;
  } catch (error) {
    throw error;
  }
};

// 부서별 직원 급여 총 합계
const getTotalSalaryByDept = async (search_date) => {
  try {
    const query = `
      SELECT
        de.dept_no,
        d.dept_name,
        SUM(s.salary) AS total_salary,
        COUNT(DISTINCT e.emp_no) AS total_employees
      FROM
        employees e
      JOIN
        dept_emp de ON e.emp_no = de.emp_no
      JOIN
        (SELECT emp_no, salary
         FROM salaries
         WHERE ? BETWEEN from_date AND to_date
         AND (emp_no, to_date) IN (
           SELECT emp_no, MAX(to_date) as max_to_date
           FROM salaries
           WHERE ? BETWEEN from_date AND to_date
           GROUP BY emp_no)) s ON e.emp_no = s.emp_no
      JOIN
        departments d ON de.dept_no = d.dept_no
      WHERE
        ? BETWEEN de.from_date AND de.to_date
        AND (de.emp_no, de.to_date) IN (
          SELECT emp_no, MAX(to_date) as max_to_date
          FROM dept_emp
          WHERE ? BETWEEN from_date AND to_date
          GROUP BY emp_no)
      GROUP BY
        de.dept_no, d.dept_name;
    `;
    const values = [search_date, search_date, search_date, search_date];
    
    const totalSalaryByDept = await dataSource.query(query, values);
    return totalSalaryByDept;
  } catch (error) {
    throw error;
  }
};

const getJoinEmployees = async (search_date,twelveMonthsAgo) => {
  try {
    const joinEmployee = await dataSource.query(
      `
      SELECT 
        DATE_FORMAT(hire_date, '%Y-%m') AS hire_year_month,
        COUNT(*) AS num_hires
      FROM 
        employees
      WHERE 
        hire_date >= ?
        AND hire_date <= ?
      GROUP BY 
        DATE_FORMAT(hire_date, '%Y-%m')
      ORDER BY 
        DATE_FORMAT(hire_date, '%Y-%m');
      `,
      [twelveMonthsAgo, search_date]
    );
    return joinEmployee;
  } catch (error) {
    throw error;
  }
};

const getLeaveEmployees = async (search_date,twelveMonthsAgo) => {
  try {
    const leaveEmployee = await dataSource.query(
      `
      SELECT 
        DATE_FORMAT(MAX(de.to_date), '%Y-%m') AS retirement_year_month,
        COUNT(*) AS num_retirements
      FROM 
        dept_emp de
      WHERE 
        de.to_date >= ?
        AND de.to_date <> '9999-01-01'
        AND de.to_date <= ?
      GROUP BY 
        DATE_FORMAT(de.to_date, '%Y-%m')
      ORDER BY 
        DATE_FORMAT(de.to_date, '%Y-%m');
      `,
      [twelveMonthsAgo, search_date]
    );
    return leaveEmployee;
  } catch (error) {
    throw error;
  }
};

const getDepartmentManagers = async (search_date) => {
  try {
    const query = `
      SELECT
        d.dept_no,
        d.dept_name,
        dm.emp_no AS manager_emp_no,
        CONCAT(m.first_name, ' ', m.last_name) AS manager_name
      FROM
        departments d
      JOIN
        dept_manager dm ON d.dept_no = dm.dept_no
      JOIN
        employees m ON dm.emp_no = m.emp_no
      WHERE
        dm.to_date = (
          SELECT MAX(to_date)
          FROM dept_manager
          WHERE dept_no = d.dept_no
            AND from_date <= ?
            AND to_date >= ?
        )
      ORDER BY d.dept_no;
    `;
    const values = [search_date, search_date];
    const departmentManagers = await dataSource.query(query, values);
    return departmentManagers;
  } catch (error) {
    throw error;
  }
};

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
  getEmpCountByGender,
  getTotalSalaryByDept,
  getJoinEmployees,
  getLeaveEmployees,
  getDepartmentManagers,
  getTotalEmployeesByDept,
  getEmployeeDetailsByDept,
  getJoinEmployeeDetails,
  getLeaveEmployeeDetails
};