const express = require('express')
//Контроллер
const adminRouter = require('./adminPanel/adminRouter.js')
const sectionPagesRouter = require('./sections/sectionPagesRouter.js')
const sectionPageController = require('./sections/controller.js')
const app = express()
const session = require('express-session')
//Парсер запросов
var bodyParser = require('body-parser')
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

//В переменную задается значение body-parser, при котором нельзя в post запросе использовать вложенные объекты
const urlencodedParser = bodyParser.urlencoded({
  extended: false,
})  

app.use(express.json());
//Здесь для body-parser задается дефолтное значение, при котором запрос может содержать любой объект
app.use(express.urlencoded({ extended: true }));
app.disable("x-powered-by");
app.set('view engine', 'pug')

app.use(session({
  name : 'codeil',
  secret : 'something',
  resave : true,
  saveUninitialized: false,
  cookie : {
          maxAge:(1000 * 60 * 100)
  },
  resultTestData: []
}));

app.use('/admin', adminRouter)

app.use('/sectionPage', sectionPagesRouter)
app.get('/', sectionPageController.getIndex)
app.use('/public', express.static(__dirname + '/public'))

let server = app.listen(8081, (req, res) => {
  console.log('port 8081')
})