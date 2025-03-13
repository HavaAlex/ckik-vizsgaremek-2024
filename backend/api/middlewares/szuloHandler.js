

exports.checkRole = async (req, res, next) =>
{
    console.log("FING")
    console.log(req.decoded)
    if(req.decoded.role == "szulo")
    {
        next()
    }
    else{
        res.status(400).send("Nincs engedélyed!");
        return;
    }
}