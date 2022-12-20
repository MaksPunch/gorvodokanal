const model = require('./model.js')

module.exports = {
    getSectionPage: (req, res) => {
        model.getSectionPage(req, res);
    },
    getTestPage: (req, res) => {
        model.getTestPage(req, res);
    },
    postTest: (req, res) => {
        model.postTest(req.params.id, req.body, req, res);
    },
    getTestResult: (req, res) => {
        model.getTestResult(req, res);
    },
    getIndex: (req, res) => {
        model.getIndex(req, res);
    }
}