const uzenetService = require("../services/uzenetService")

exports.getUzenetek = async (req, res, next) =>
{
    console.log("FINGO1")
    console.log(req.decoded)
    const uzenetek = await uzenetService.getUzenetek(req.decoded.ID)
    for(let i =0;i<uzenetek.length;i++){
        console.log(uzenetek[i].message)
    }
    console.log(uzenetek)
    console.log("FINGO2")
    res.status(201).json(uzenetek);
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