

exports.checkRole = async (req, res, next) =>
{
    if(req.decoded.role == "szulo")
    {
        req.child = req.decoded.children.find((c)=>c.ID == req.params.ID)
        console.log("FFFFFINNNGGG")
        console.log(req.child)
        next()
    }
    else{
        res.status(400).send("Nincs engedélyed!");
        return;
    }
}