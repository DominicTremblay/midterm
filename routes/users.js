/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const { formatWidgets } = require("../helpers/dataHelpers");

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then((data) => {
        const users = data.rows;
        res.json({ users });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/", (req, res) => {
    // adding a new user

    // extract the info from the form => name
    const { name } = req.body;

    // Add the user in the db
    const queryStr = {
      text: `INSERT INTO users(name) VALUES($1) RETURNING *`,
      values: [name],
    };

    db.query(queryStr)
      .then((result) => res.json(result.rows[0]))
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });

    // send back the added user to the front-end
  });

  router.get("/widgets", (req, res) => {
    const queryStr = {
      text: `SELECT users.id AS user_id, users.name AS username, widgets.id AS widget_id, widgets.name AS widget_name FROM users INNER JOIN widgets ON users.id = widgets.user_id`,
    };

    db.query(queryStr)
      .then((result) => res.json(formatWidgets(result.rows)))
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
