const express = require('express')
const addQuestionController = require('../adminPanel/addQuestions/controller.js')
const addTestController = require('../adminPanel/addTest/controller.js')
const createPagesController = require('../adminPanel/createPages/controller.js')
const adminRouter = express.Router()
var bodyParser = require('body-parser')
var mysql = require('mysql2');
const urlencodedParser = bodyParser.urlencoded({
  extended: false,
})
const connection = mysql.createPool({
    host     : '45.12.19.166',
    port     : '3306',
    user     : 'project',
    password : 'ORmQzJQ3',
    database : 'test',
    multipleStatements: true
});

adminRouter.post('/loginAdmin', addQuestionController.loginAdmin)
adminRouter.post('/addQuestion/:id', addQuestionController.addQuestion);
adminRouter.get('/getQuestionsLength', addQuestionController.getQuestionsLength)

adminRouter.delete('/deleteQuestion/:id', addQuestionController.deleteQuestion)
adminRouter.delete('/deleteSection/:id', addTestController.deleteSection)
adminRouter.delete('/deleteCourse/:id', addTestController.deleteCourse)

adminRouter.post('/addSection/:id', addTestController.addSection)
adminRouter.post('/addCourse/:id', addTestController.addCourse)
//У страниц addQuestion и addTest id одинаковый и зависит от id ТЕСТА
adminRouter.get('/addQuestion/:id', addQuestionController.getPageAddQuestion)
adminRouter.post('/addTest/:id', addTestController.addTest)

adminRouter.get('/testPage/:id', addTestController.getAddTestPage)
adminRouter.get('/sectionPage/:id', addTestController.getSectionPage)
adminRouter.get('/coursePage/:id', addTestController.getCoursePage)

adminRouter.post('/createTest', createPagesController.createTest)
adminRouter.post('/createSection', createPagesController.createSection)
adminRouter.post('/createCourse', createPagesController.createCourse)

adminRouter.get('/', (_req, res) => {
    connection.query('select * from test; select * from section; select * from course', (err, result) => {
      if (err) throw err
      res.render('adminPanel/index', {tests: result[0], sections: result[1], courses: result[2]})
    }) 
})

module.exports = adminRouter