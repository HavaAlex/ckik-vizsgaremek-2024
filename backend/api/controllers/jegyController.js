const jegyService = require("../services/jegyService")

exports.getJegyek = async (req, res, next) =>
{
    const jegyek = await jegyService.getJegyek(req.decoded.ID)
    for(let i =0;i<jegyek.length;i++){
        console.log(jegyek[i])
    }
    res.status(201).json(jegyek);
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