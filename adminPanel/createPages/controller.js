const model = require('./model.js')

module.exports = {
    createTest: (req, res) => {
        model.createTest(req, res);
    },
    createSection: (req, res) => {
        model.createSection(req, res);
    },
    createCourse: (req, res) => {
        model.createCourse(req, res);
    }
}