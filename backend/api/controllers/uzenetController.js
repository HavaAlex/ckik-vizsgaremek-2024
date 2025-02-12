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
    for (let index = 0; index < PotentialReceivers.singleUsers.length; index++) {
        let newReciever = {
            id : PotentialReceivers.singleUsers[index].ID,
            name : PotentialReceivers.singleUsers[index].username,
            role : PotentialReceivers.singleUsers[index].role
        }
        PotentialReceiversFormed.push(newReciever)
    }

    PotentialReceivers.singleUsers = PotentialReceiversFormed
    res.status(201).json(PotentialReceivers);
}

exports.modifyUzenet = async (req, res, next) =>
{
    
}
exports.createUzenet = async (req, res, next) =>
{
    let {message,date,receiverlist,receiverGrouplist} = req.body;
    console.log("createuzenetbevan")
    try
    {
        console.log("megpróbálja")
        console.log(receiverlist)
        console.log(receiverlist.length)
        console.log(receiverGrouplist)
        console.log(receiverGrouplist.length)
        console.log(receiverGrouplist.studentList)

        const newUzenet =
        {
            ID: null,
            senderUserID: req.decoded.ID,
            message: message,
            date: date,
        }
        cleanedreceiverlist = [];
        
        for (let l = 0; l < receiverlist.length; l++) { //ahogy átjön ez a lista, benne van még a receiverek role-ja és name-je. Csak az ID kell ezért
            cleanedreceiverlist.push(receiverlist[l].id)//új listát csinálok nekik
        }
        if(receiverGrouplist != 'undefined'){
            for (let l = 0; l < receiverGrouplist.length; l++) {
                    receiverGrouplist[l].studentList.forEach(element => {
                        console.log(element)
                        cleanedreceiverlist.push(element)
                    });

            }
        }

        console.log("YYYYYYYYYYYYSYYYYYYYYYYYYYYYS")
        console.log(cleanedreceiverlist)
        newUzenet = await uzenetService.createUzenet(newUzenet,cleanedreceiverlist);

        
        if(newUzenet){
            res.status(201).json(newUzenet)
        }
        else{
            res.status(400).send("Failed to create a message")
        }
    }
    catch(error)
    {
        console.log("elbassza")
        console.log(error)
        next(error);
    }
}