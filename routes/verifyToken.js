const jwt = require('jsonwebtoken');

module.exports = function (req,res,next) {
    const token = req.headers.cookie;
    if(!token) return res.status(401).render('index');

    try {
        const token = req.headers.cookie.slice(4);
        const verified = jwt.verify(token,process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        return res.status(401).render('index');
    }
    
}