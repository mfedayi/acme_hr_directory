const pg = require("pg");
require("dotenv").config();
const client = new pg.Client(process.env.DATABASE_URL);

const init = async () => {
  try {
    await client.connect();
    const SQL = `
     DROP TABLE IF EXISTS employees;
    DROP TABLE IF EXISTS departments;
    CREATE TABLE departments(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dep_name VARCHAR(202) 
    );
    CREATE TABLE employees(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(202) NOT NULL,
    created_at time DEFAULT CURRENT_TIMESTAMP,
    updated_at time DEFAULT CURRENT_TIMESTAMP,
    department_id UUID REFERENCES departments(id) NOT NULL,
    department_name VARCHAR(202) NOT NULL

    );
    INSERT INTO departments(dep_name) VALUES('operations');
    INSERT INTO departments(dep_name) VALUES('I.T');
    INSERT INTO departments(dep_name) VALUES('UAT');
    INSERT INTO employees(name, department_id, department_name) SELECT 'musio', id, dep_name FROM departments WHERE dep_name='I.T';
    INSERT INTO employees(name, department_id, department_name) SELECT 'armani', id, dep_name FROM departments WHERE dep_name='operations';
    INSERT INTO employees(name, department_id, department_name) SELECT 'sanai', id, dep_name FROM departments WHERE dep_name='UAT';
    `;

    await client.query(SQL);
    await client.end();
    console.log("******data seeded");
  } catch (error) {
    console.error(error);
  }
};

init();
