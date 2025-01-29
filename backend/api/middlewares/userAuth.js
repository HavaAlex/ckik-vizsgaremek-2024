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
    console.log(token.substring(0,token.length-1))//Annyira szeretem bármelyik rendszer is felel azért HOGY VAN EGY KIBEBASZOTT ; A TOKENBEN MIÉRT IS LEGYEN EGYSZERŰ AZ EMBER ÉLETE
    jwt.verify(token.substring(0,token.length-1), process.env.JWT_KEY, function(error, decoded)
    {
        console.log(decoded)
        if(!decoded)
        {
            res.status(400).send("Invalid token");

            return;
        }
        req.decoded = decoded
    });
    console.log("KÉRÉS")
    //next(decodedGlobal);
}