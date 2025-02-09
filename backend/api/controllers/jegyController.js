const jegyService = require("../services/jegyService")

exports.getJegyek = async (req, res, next) =>
{
    console.log("JEGY KEZD")
    const jegyek = await jegyService.getJegyek(req.decoded.ID)
    console.log(jegyek)
    res.status(201).json(jegyek);
    console.log("JEGY VÉG")
}

exports.modifyUzenet = async (req, res, next) =>
{
    
}
exports.createUzenet = async (req, res, next) =>
{
    let {ID,senderUserID,message,date} = req.body;

    try
    {
        var newUzenet =
        {
            ID: ID,
            senderUserID: senderUserID,
            message: message,
            date: date,
        }

        newUzenet = await uzenetService.createUzenet(newUzenet);

        res.status(201).json(newUzenet);
    }
    catch(error)
    {
        next(error);
    }
}