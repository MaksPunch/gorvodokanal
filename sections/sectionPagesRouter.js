const express = require('express');
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
const sectionPagesRouter = express.Router();

const controller = require('./controller.js')

sectionPagesRouter.get('/:id', controller.getSectionPage)
sectionPagesRouter.get('/testPage/:id', controller.getTestPage)
sectionPagesRouter.post('/testPage/:id', controller.postTest)
sectionPagesRouter.get('/testPage/:id/result', controller.getTestResult)


module.exports = sectionPagesRouter