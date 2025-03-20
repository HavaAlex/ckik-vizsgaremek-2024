const jwt = require("jsonwebtoken");
const roleService = require("../services/roleService")

exports.verifyToken = async (req, res, next) =>
{
    console.log(req.headers["authorization"])
    var token = req.headers["authorization"]?.split(" ")[1]; // Bearer <token>

    if(!token)
    {
        res.status(403).send("Access denied");

        return;
    }
    console.log(token.substring(0,token.length-1))//Annyira szeretem bármelyik rendszer is felel azért HOGY VAN EGY KIBEBASZOTT ; A TOKENBEN MIÉRT IS LEGYEN EGYSZERŰ AZ EMBER ÉLETE
    const decoded = jwt.verify(token, process.env.JWT_KEY, (error, decoded)=>
    {
        if(error)
        {
            return {error:error};
        }
        return decoded.userData
    });
    if(!decoded|| decoded == undefined || decoded.error){
        console.log("BAJ VAN A BUGYIBAN");
        res.status(400).send("Invalid token");
        return;
    }
    req.decoded = decoded
    req.role = await roleService.getRole(decoded.ID,decoded.role)
    console.log(decoded)
    console.log(req.role)
    console.log("KÉRÉS")
    next()
    //next(decodedGlobal);
}