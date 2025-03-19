

exports.checkRole = async (req, res, next) =>
{
    if(req.decoded.role == "szulo")
    {
        next()
    }
    else{
        res.status(400).send("Nincs engedélyed!");
        return;
    }
}