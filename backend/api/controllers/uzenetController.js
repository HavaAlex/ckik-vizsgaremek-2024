const uzenetService = require("../services/uzenetService")

exports.getUzenetek = async (req, res, next) =>
{
    const uzenetek = await uzenetService.getUzenetek(req.decoded.ID)
    console.log(uzenetek)
    res.status(201).json(uzenetek);
} 

exports.getPotentialReceivers = async (req, res, next) => {
    console.log("elindult: getPotentialReceivers")
    const PotentialReceivers = await uzenetService.getPotentialReceivers(req.decoded.ID)
    const PotentialReceiversFormed = [];
    for (let index = 0; index < PotentialReceivers.length; index++) {
        let newReciever = {
            id : PotentialReceivers[index].ID,
            name : PotentialReceivers[index].username,
            role : PotentialReceivers[index].role
        }
        PotentialReceiversFormed.push(newReciever)
    }
    res.status(201).json(PotentialReceiversFormed);
}

exports.modifyUzenet = async (req, res, next) =>
{
    
}
exports.createUzenet = async (req, res, next) =>
{
    console.log("uzenetcsinálas")
    let {message,date,receiverlist} = req.body;

    try
    {
        const newUzenet =
        {
            ID: null,
            senderUserID: req.decoded.ID,
            message: message,
            date: date,
        }
        console.log("elmentide")
        console.log(receiverlist)
        newUzenet = await uzenetService.createUzenet(newUzenet,receiverlist);

        
        if(newUzenet){
            console.log("SZŰŰŰŰŰŰŰŰŰŰŰŰű")
            res.status(201).json(newUzenet)
        }
        else{
            res.status(400).send("Failed to create a message")
        }
    }
    catch(error)
    {
        next(error);
    }
}