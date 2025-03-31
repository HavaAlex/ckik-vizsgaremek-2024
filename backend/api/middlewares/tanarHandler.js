

exports.checkRole = async (req, res, next) =>
{
    if(req.decoded.role == "tanar" || req.decoded.role == "admin")
    {
        next()
    }
    else{
        res.status(403).send("Nincs engedélyed!");
        return;
    }
}

