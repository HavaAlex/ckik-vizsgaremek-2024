const uzenetService = require("../services/uzenetService")

exports.getUzenetek = async (req, res, next) =>
{
    const uzenetek = await uzenetService.getUzenetek(next.ID)
    console.log(uzenetek)
    return uzenetek
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