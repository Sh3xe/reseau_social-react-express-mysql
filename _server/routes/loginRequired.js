const users = require("../database/users.js");

module.exports = async function(req, res, next) {
    if(req.session.user_id){
        const {error, data} = await users.getUserById(req.session.user_id);
        if(!error) {
            req.user = data;
            next();
        } else res.redirect("/login");

    } else res.redirect("/login");
}