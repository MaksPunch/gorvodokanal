const addTest = require('./model.js')

module.exports = {
    loginAdmin: (req, res) => {
        addTest.loginAdmin(req, res);
    },
    addQuestion: (req, res) => {
        //Формирование объекта, содержащего данные о вопросе, полученных из запроса
        const question = {
            name: req.body.name,
            answers: [],
            right: req.body.rightAnswer
        }
        //Обработчик ответов из отправленной формы
        var answers = Object.keys(req.body).filter( (key) => /^answer[0-9]+$/.test(key) );
        for(let i = 0; i < answers.length; i++) {
            question.answers.push(req.body[answers[i]]);
        }
        if (!question.right) res.sendStatus(400)
        addTest.addQuestion(question, [], req.params.id)
        res.sendStatus(200)
    },
    getPageAddQuestion: (req, res) => {
        addTest.getPageAddQuestion(req, res)
    },
    getQuestionsLength: (req, res) => {
        addTest.getQuestionsLength(req, res)
    },
    deleteQuestion: (req, res) => {
        addTest.deleteQuestion(req.params.id);
        res.send('success')
    }
}