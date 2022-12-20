const model = require('./model.js')

module.exports = {
    getAddTestPage: (req, res) => {
        model.getAddTestPage(req, res)
    },
    addTest: (req, res) => {
        model.addTest(req.body.name, req.params.id);
        res.sendStatus(200)
    },
    getSectionPage: (req, res) => {
        model.getSectionPage(req, res)
    },
    addSection: (req, res) => {
        model.addSection(req.body.name, req.params.id, req.body.test_id, req.body.content, req.body.course_id)
    },
    deleteSection:  (req, res) => {
        model.deleteSection(req.params.id)
        res.sendStatus(200)
    },
    getCoursePage: (req, res) => {
        model.getCoursePage(req, res);
    },
    addCourse: (req, res) => {
        model.addCourse(req.body.name, req.params.id)
    },
    deleteCourse:  (req, res) => {
        model.deleteCourse(req.params.id)
        res.sendStatus(200)
    }
}