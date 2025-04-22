const { client } = require("./common");
const express = require("express");
const app = express();
const pg = require("pg");
require("dotenv").config();
app.use(express.json());
const PORT = 3000;
app.use(require("morgan")("dev"));
// const client = new pg.Client(process.env.DATABASE_URL);

app.listen(PORT, () => {
  console.log("listening on PORT:", PORT);
});

app.get("/hello", (req, res, next) => {
  res.status(200).json({ message: "res is coming back!!" });
});

app.get("/employees", async (req, res, next) => {
  try {
    const SQL = `
    SELECT * from employees
    `;
    const response = await client.query(SQL);
    console.log("RESPONSE:", response);
    res.status(200).json(response.rows);
  } catch (error) {
    next(error);
  }
});

app.get("/departments", async (req, res, next) => {
  try {
    const SQL = `
    SELECT * from departments
    `;
    const response = await client.query(SQL);
    console.log("RESPONSE:", response);
    res.status(200).json(response.rows);
  } catch (error) {
    next(error);
  }
});

app.post("/employees", async (req, res, next) => {
  try {
    const { name, department_name } = req.body;
    const SQL = `
  INSERT INTO employees(name, department_id, department_name) SELECT $1, id, dep_name FROM departments WHERE dep_name= $2
  Returning *;
  `;
    const response = await client.query(SQL, [name, department_name]);
    res.status(201).json(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.post("/departments", async (req, res, next) => {
  try {
    const { dep_name } = req.body;
    const SQL = `
  INSERT INTO departments(dep_name) VALUES ($1)
  Returning *;
  `;
    const response = await client.query(SQL, [dep_name]);
    res.status(201).json(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.delete("/employees/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const SQL = `
    DELETE from employees WHERE id = $1
    `;
    await client.query(SQL, [id]);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

app.put("/employees/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, department_name } = req.body;
    const SQL = `
    UPDATE employees SET name = $1, department_id = (SELECT id from departments WHERE dep_name = $2), department_name = $2 WHERE id= $3 RETURNING *;
    `;
    const response = await client.query(SQL, [name, department_name, id]);
    res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error("could not update employee", error);
    next(error);
  }
});
const init = async () => {
  await client.connect();
};
init();
