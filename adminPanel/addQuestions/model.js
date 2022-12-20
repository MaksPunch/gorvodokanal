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

/*Сортировка выборки из mysql 
SELECT 
        q.id,
        q.name, 
        a.answer, 
        a.right_answer 
FROM    question q 
JOIN    answers_in_questions ag ON ag.question_id = q.id 
JOIN    answer a ON a.id = ag.answer_id'
*/
function sortSqlQuery(queryResult) {
    let result = [];
    let answers = [];
    let count = 1;
    let answersCount = 1;
    for (let i = 0; i < queryResult.length; i++) {
        let questionType;
        switch(queryResult[i].type) {
            case 1:
                questionType = 'radio';
                break;
            case 2: 
                questionType = 'checkbox';
                break;
            case 3:
                questionType = 'text';
                break;
        }
        var question = {
            id: queryResult[i].id,
            name: queryResult[i].name,
            answers: [],
            count: count,
            type: questionType
        }
        answers.push([queryResult[i].answer, queryResult[i].right_answer, answersCount++]);
        if (i == queryResult.length - 1) {
            question.answers = answers;
            count++;
            result.push(question);
            answersCount = 1
            answers = [];
        } 
        else if (queryResult[i+1].id != question.id) {
            question.answers = answers;
            count++;
            result.push(question);
            answersCount = 1
            answers = [];
        }
    }
    return result
}

module.exports = {
    //Запрос на проверку является ли пользователь администратором
    loginAdmin: (req, res) => {
        const sql = 'select login, password, admin from profile'
        connection.query(sql, (err, result) => {
            if (err) throw err;
            const user = result.find(val => val.login == req.body.login)
            if (!user) res.send('User not found')
            else {
                const admin = req.body.login == user.login 
                && req.body.password == user.password 
                && user.admin == 1
                admin ? res.send(admin) : res.send('Вы не админ')
            }
        })
    },
    //Добавление вопроса
    addQuestion: (question, answers, id) => {
        //Группировка ответов в виде [[ответ, является ли он правильным],[ответ, является ли он правильным]]
        for (let i = 1; i <= question.answers.length; i++) {
            answers.push([question.answers[i-1], question.right.includes(i.toString()) == true ? 1 : 0])
        }
        let test_query = 'INSERT INTO question (name, open) VALUES (?, 1)'
        connection.query(test_query, question.name, (err, result1) => {
            if (err) throw err;
            let insertTest = 'insert into test_questions (test_id, question_id) values ('+id+', ?)';
            connection.query(insertTest, result1.insertId, (err, insertTestResult) => {
                if(err) throw err;
            })
            const answer_query = 'insert into answer (answer, right_answer) VALUES ?'
            connection.query(answer_query, [answers], (err, result2) => {
                if (err) throw err
                const lastrow = result2.insertId+result2.affectedRows;
                const answers_group = [];
                for (let i = result2.insertId; i < lastrow; i++) {
                    answers_group.push([result1.insertId, i])
                }
                answers_in_question_query = 'insert into answers_in_questions (question_id, answer_id) VALUES ?'
                connection.query(answers_in_question_query, [answers_group], (err, result) => {
                    if (err) throw err;
                })
            })
        })

    },
    getPageAddQuestion: (req, res) => {
        //Выборка id, названия и ответов вопроса и их отрисовка на странице
        const getQuestions = `
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
                test_id = 
            ` + req.params.id
        connection.query(getQuestions, (err, result) => {
            if (err) throw err;
            res.render('./adminPanel/addQuestions/test_constructor', {questions: sortSqlQuery(result), id: req.params.id})
        })
    },
    getQuestionsLength: (req, res) => {
        //Запрос, чтобы узнать количество всех вопросов
        connection.query('select max(id) as id from question', (err, result) => {
            if (err) throw err;
            res.send({number: result[0].id})
        })
    },
    deleteQuestion: (id) => {
        //Запрос на удаление вопроса из базы данных
        deleteAnswerIds = `delete from answer a
        where a.id between (select min(answer_id) from answers_in_questions where question_id = ${id})
        and (select max(answer_id) from answers_in_questions where question_id = ${id})`
        connection.query(deleteAnswerIds, (err, result) => {
            if (err) throw err;
            connection.query(`delete from question
            where id = ${id}`, (err, result) => {
                if (err) throw err;
            })
        })
    },
    sortSqlQuery: (result) => {
        return sortSqlQuery(result)
    }
}