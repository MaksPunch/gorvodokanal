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
var _ = require('underscore');

const question = require('../adminPanel/addQuestions/model.js')

/*Сортировка запроса на вид
{
    Название курса
    Тема: {
        id темы
        Название темы
    }
}
*/
function sortCoursesAndSections(coursesRes, sectionsRes) {
    let res = [];
    for (let course of coursesRes) {
      let courseObject = {
        name: course.name,
        sections: []
      }
      for (let section of sectionsRes) {
        if (course.id == section.course_id) {
          courseObject.sections.push({
            id: section.id,
            name: section.name
          })
        }
      }
      res.push(courseObject)
    }
    return res;
}

function sortTestData(queryResult) {
    let answers = [];
    let resultArr = [];
    for (let i = 0; i < queryResult.length; i++) {
        var question = {
            id: queryResult[i].id,
            answers: []
        }
        answers.push(queryResult[i].answer);
        if (i == queryResult.length - 1) {
            question.answers = answers;
            resultArr.push(question);
            answers = [];
        } 
        else if (queryResult[i+1].id != question.id) {
            question.answers = answers;
            resultArr.push(question);
            answers = [];
        }
    }
    return resultArr;
} 

module.exports = {
    getSectionPage: (req, res) => {
        let query = `
        select * from section where id = ${req.params.id}; 
        select * from course; 
        select s.id, s.name, sc.course_id from section s
        join sections_in_course sc on sc.section_id = s.id`;
        connection.query(query, (err, result) => {
          if (err)
            throw err;
          if (result[0][0].open) {
            //Выбор кода видео из ссылки на видео
            console.log(result[0][0].content)
            var link = result[0][0].content.match(/(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/) || 1;
            link = link.length > 1 ? link[1] : link
            let renderVariables = Object.assign({ link: link }, result[0][0], { courses: sortCoursesAndSections(result[1], result[2]) });
            console.log(renderVariables);
            res.render('./sections/sectionPage/sectionPage', renderVariables);
          }
        });
    },
    getTestPage: (req, res) => {
        let query = `
        SELECT
            q.id,
            q.name,
            a.answer,
            a.right_answer,
            q.type
        FROM
            test t
            JOIN test_questions tq ON t.id = tq.test_id
            JOIN question q ON tq.question_id = q.id
            JOIN answers_in_questions aq ON aq.question_id = q.id
            JOIN answer a ON aq.answer_id = a.id 
        WHERE
            test_id = ${req.params.id}; 
        select * from course; 
        select s.id, s.name, sc.course_id from section s
        join sections_in_course sc on sc.section_id = s.id`;
        connection.query(query, (err, result) => {
          if (err)
            throw err;
            let renderVariables = Object.assign({id: Number(req.params.id), questions: question.sortSqlQuery(result[0])}, { courses: sortCoursesAndSections(result[1], result[2]) });
            console.log(renderVariables);
            res.render('./sections/testPage/testPage', renderVariables);
        });
    },
    postTest: (id, body, req, res) => {
        let query = `
        SELECT
            q.id,
            q.name,
            a.answer,
            a.right_answer
        FROM
            test t
            JOIN test_questions tq ON t.id = tq.test_id
            JOIN question q ON tq.question_id = q.id
            JOIN answers_in_questions aq ON aq.question_id = q.id
            JOIN answer a ON aq.answer_id = a.id 
        WHERE
            test_id = ${id}
            AND
            a.right_answer = 1`
        connection.query(query, (err, result) => {
            result = sortTestData(result);
            let rightCount = 0;
            let wrongCount = 0;
            for (let i = 0; i < req.body.answers.length; i++) {
                let sentTest = req.body.answers[i].answers.sort()
                let rightTest = result[i].answers.sort()
                if (_.isEqual(sentTest, rightTest)) rightCount++;
                else wrongCount++;
            }
            req.session['resultTestData'] = {
                rightCount: rightCount,
                wrongCount: wrongCount,
                test_id: req.params.id
            }
            res.sendStatus(200);
        })
    },
    getTestResult: (req, res) => {
        let query = `
        select * from course; 
        select s.id, s.name, sc.course_id from section s
        join sections_in_course sc on sc.section_id = s.id`;
        connection.query(query, (err, result) => {
            if (err)
              throw err;
              let renderVariables = Object.assign({ courses: sortCoursesAndSections(result[0], result[1]) }, req.session['resultTestData']);
              console.log(renderVariables);
              res.render('./sections/testPage/resultTestPage', renderVariables);
          });
    },
    
    getIndex: (req, res) => {
    let query = `
          select * from course; 
          select s.id, s.name, sc.course_id from section s
          join sections_in_course sc on sc.section_id = s.id`;
          connection.query(query, (err, result) => {
              if (err)
                throw err;
                res.render('./index', { courses: sortCoursesAndSections(result[0], result[1]) });
          });
    }
}