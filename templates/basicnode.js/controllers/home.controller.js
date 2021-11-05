const { processResponse } = require('../services/home.service');

module.exports = {
    homeController: async (req, res) => {
        res.sendFile(__dirname + "/views/index.html");
    },

    homeApiController: async (req, res) => {
        const response = processResponse();
        res.send(response);
    }
}