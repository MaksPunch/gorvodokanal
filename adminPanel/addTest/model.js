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
    getAddTestPage: (req, res) => {
        const getSections = `SELECT id, name, test_id FROM section; select * from test`
        
        connection.query(getSections, (err, result) => {
            if (err) throw err;
            let testObj = {test: result[1].find(x => x.id == req.params.id)};
            if (testObj.test.name == null) testObj.test.name = '';
            let renderVars = {id: req.params.id, sections: result[0]};
            if (testObj.test) renderVars = Object.assign(testObj, renderVars);
            res.render('./adminPanel/addTest/add_test', renderVars)
        })
    },
    addTest: (name, id) => {
        connection.query('update test set name = \"'+name+'\" where id = '+id, (err) => {
            if (err) throw err;
        })
    },
    getSectionPage: (req, res) => {
        connection.query(`
        select id as testId, name from test; 
        select name, test_id, content from section where id = ?; 
        SELECT
            c.id as course_id
        FROM
            section s
        join sections_in_course sc on s.id = sc.section_id
        join course c on c.id = sc.course_id
        WHERE
            s.id IN ( SELECT s.id FROM section s JOIN sections_in_course sc ON s.id = sc.section_id where section_id = `+req.params.id+` );
        select * from course
        `, req.params.id, (err, result) => {
            if (err) throw err
            let course_id = result[2][0] == null ? 0 : result[2][0];
            let renderVars = {id: req.params.id, tests: result[0], section: result[1][0], course_id: course_id, courses: result[3]};
            if (result[1][0].name == null) result[1][0].name = '';
            renderVars = Object.assign({section_name: result[1][0].name}, renderVars)
            res.render('./adminPanel/addSection/add_section', renderVars);
        })
    },
    addSection: (name, id, test_id, content, course_id) => {
        const updateQuery = `update section set name = "${name}", test_id = ${test_id}, content = "${content}" where id = "${id}";`
        connection.query(updateQuery, (err) => {
            if (err) throw err;
        })
        connection.query(`
        INSERT INTO sections_in_course (course_id, section_id) VALUES (${course_id}, ${id})
        ON DUPLICATE KEY UPDATE course_id=VALUES(course_id);`, (err) => {
            if (err) throw err;
        })
    },
    getCoursePage: (req, res) => {
        connection.query(`
            select s.* from section s 
            join sections_in_course sc on s.id = sc.section_id
            join course c on c.id = sc.course_id
            where c.id = ?;
            select name from course where id = ?;
        `, [req.params.id, req.params.id], (err, result) => {
            if (err) throw err
            let renderVars = {id: req.params.id, course_sections: result[0]};
            if (result[1][0].name == null) result[1][0].name = '';
            renderVars = Object.assign({course_name: result[1][0].name}, renderVars)
            res.render('./adminPanel/addCourse/add_course', renderVars);
        })
    },
    addCourse: (name, id) => {
        const updateQuery = `update course set name = "${name}" where id = "${id}";`
        connection.query(updateQuery, (err) => {
            if (err) throw err;
        })
    },
    deleteSection: (id) => {
        connection.query('delete from section where id = ?', id, (err) => {
            if (err) throw err
        })
    },
    deleteCourse: (id) => {
        connection.query('delete from course where id = ?', id, (err) => {
            if (err) throw err
        })
    }
}