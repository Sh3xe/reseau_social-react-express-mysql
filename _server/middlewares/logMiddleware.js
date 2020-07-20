const chalk = require("chalk");

module.exports = function(req, res, next) {
    console.log(`${chalk.bgBlueBright(req.method)} ${chalk.blueBright(req.url)}`);
    next();
}