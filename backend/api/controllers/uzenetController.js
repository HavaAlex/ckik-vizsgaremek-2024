const uzenetService = require("../services/uzenetService")

exports.getUzenetek = async (req, res, next) =>
{
    const uzenetek = await uzenetService.getUzenetek(req.decoded.ID)
    console.log("UUU ", uzenetek)
    res.status(201).json(uzenetek);
} 

exports.getPotentialReceivers = async (req, res, next) => {
    
    const PotentialReceivers = await uzenetService.getPotentialReceivers(req.decoded.ID)
    res.status(201).json(PotentialReceivers);
}

exports.getAllMessages = async (req,res,next) => {
    const response = await uzenetService.getAllMessages();
    res.status(201).json(response)
}

exports.deleteMessage = async (req,res,next) => {
    const ID = JSON.parse(req.params.ID);
    const response = await uzenetService.deleteMessage(ID);
    res.status(201).json(response);
}

exports.createUzenet = async (req, res, next) =>
{
    let {message,date,receiverlist,receiverGrouplist} = req.body;
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
        if(receiverlist.length< 1 && receiverGrouplist.length<1){
            res.status(500).send("Címzettek nélkül nem lehet üzenetet küldeni!")
            return
        }
        cleanedreceiverlist = [];
        
        for (let l = 0; l < receiverlist.length; l++) { //ahogy átjön ez a lista, benne van még a receiverek role-ja és name-je. Csak az ID kell ezért
            cleanedreceiverlist.push(receiverlist[l].ID)//új listát csinálok nekik
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

        console.log(" e ", cucc)
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