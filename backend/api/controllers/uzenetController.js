const uzenetService = require("../services/uzenetService")

exports.getUzenetek = async (req, res, next) =>
{
    const uzenetek = await uzenetService.getUzenetek(req.decoded.ID)
    res.status(201).json(uzenetek);
} 

exports.getPotentialReceivers = async (req, res, next) => {
    
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
        const newUzenet =
        {
            ID: null,
            senderUserID: req.decoded.ID,
            message: message,
            date: date,
        }
        if(!message){
            res.status(500).send("Szöveg nélkül nem lehet üzenetet küldeni!")
            return
        }
        console.log("EGYIK :", receiverGrouplist)
        console.log("MASKI : ", receiverlist)
        if(receiverlist.length< 1 && receiverGrouplist.length<1){
            res.status(500).send("Címzettek nélkül nem lehet üzenetet küldeni!")
            return
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


        let cucc = await uzenetService.createUzenet(newUzenet,cleanedreceiverlist);

        
        if(cucc){
            res.status(201).json(cucc)
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