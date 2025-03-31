

exports.checkRole = async (req, res, next) =>
{
    if(req.decoded.role == "tanar")
    {
        console.log("TANAR PASS CHECK")
        next()
    }
    else{
        res.status(403).send("Nincs engedélyed!");
        return;
    }
}