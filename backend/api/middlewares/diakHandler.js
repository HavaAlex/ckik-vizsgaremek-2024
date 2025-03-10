

exports.checkRole = async (req, res, next) =>
{
    if(req.decoded.role == "diak")
    {
        next()
    }
    else{
        res.status(400).send("Nincs engedélyed!");
        return;
    }
}