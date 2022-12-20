var mysql = require('mysql2');
//Соединение с базой данных, createPool для создания нескольких соединений
const connection = mysql.createPool({
  host     : '45.12.19.166',
  port     : '3306',
  user     : 'project',
  password : 'ORmQzJQ3',
  database : 'test',
  multipleStatements: true
});

module.exports = {
    createTest: (req, res) => {
        connection.query('insert into test (id) values (null)', (err, result) => {
          if (err) throw err;
          res.redirect(302, `/admin/testPage/${result.insertId}`);
        })
    },
    createSection: (req, res) => {
        connection.query('insert into section (id, test_id, open) values (null, null, 1)', (err, result) => {
          if (err) throw err;
          res.redirect(302, `/admin/sectionPage/${result.insertId}`);
        })
    },
    createCourse: (req, res) => {
      connection.query('insert into course (id, open) values (null, 1)', (err, result) => {
        if (err) throw err;
        res.redirect(302, `/admin/coursePage/${result.insertId}`);
      })
    } 
}