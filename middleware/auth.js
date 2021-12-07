const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
    let token =
        req.body.token || req.query.token || req.headers['authorization'] || req.headers["x-access-token"];

    console.log("req.headers", req.headers)

    if (token && token.indexOf("Bearer ") > -1) {
        token = token.slice(7);
    }

    if (!token) {
        return res.status(403).send({message: "A token is required for authentication"});
    }
    try {
        const decoded = jwt.verify(token, "Acesso123#");
        console.log("decoded", decoded)
        req.user = decoded;
    } catch (err) {
        return res.status(401).send({message: "Invalid Token"});
    }
    return next();
};

module.exports = verifyToken;
