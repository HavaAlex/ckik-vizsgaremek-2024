

exports.checkRole = async (req, res, next) =>
{
    if(req.decoded.role == "admin")
    {
        next()
    }
    else{
        res.status(400).send("Nincs engedélyed!");
        return;
    }
}