const jwt = require("jsonwebtoken");
const roleService = require("../services/roleService")

exports.verifyToken = async (req, res, next) =>
{

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

            
            return {error:error};
        }
        
        return decoded.userData
    });
    if(!decoded|| decoded == undefined || decoded.error){

        res.status(400).send("Invalid token");
        return;
    }
    req.decoded = decoded
    req.role = await roleService.getRole(decoded.ID,decoded.role) 
    next()
}