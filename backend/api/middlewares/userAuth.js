const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) =>
{
    //console.log(req.headers)
    var token = req.headers["authorization"]?.split(" ")[1]; // Bearer <token>

    if(!token)
    {
        res.status(403).send("Access denied");

        return;
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY, (error, decoded)=>
    {
        if(error)
        {
            return error;
        }
        return decoded.userData
    });
    if(!decoded|| decoded == undefined || typeof(decoded) == jwt.JsonWebTokenError){
        console.log("BAJ VAN A BUGYIBAN")
        res.status(400).send("Invalid token");
        return;
    }
    req.decoded = decoded
    console.log(decoded)
    console.log("KÉRÉS")
    next()
}