

exports.checkRole = async (req, res, next) =>
{
    if(req.decoded.role == "szulo")
    {
        req.child = req.decoded.children.find((c)=>c.ID == req.params.ID)
        next()
    }
    else{
        res.status(403).send("Nincs engedélyed!");
        return;
    }
}