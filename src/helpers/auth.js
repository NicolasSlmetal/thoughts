module.exports.checkAuth = function(req, res, next) {
    const userid = req.session.userid

    if (!userid) {
        res.redirect('/auth/login')
        return
    }

    next()
}