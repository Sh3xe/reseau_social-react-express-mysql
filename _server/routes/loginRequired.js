module.exports = function loginRequired(req, res, next){
    if(!req.session.user_token) {
        res.status(400);
        res.end();
    } else next();
}