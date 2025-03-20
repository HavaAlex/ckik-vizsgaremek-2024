const { endsWith } = require("lodash")
const adminService = require("../services/adminService")
const hazikService = require("../services/hazikService")

exports.uploadTeachers = async (req,res,next) =>{
    const teachers = req.body
    console.log("ezek azok: ",teachers)
    if(teachers.length < 1){
        res.status(500).send("Nincsenek elemek amiket feltölthetne, adjon hozzá a listához")
        return
    }
    const valasz =  await adminService.uploadTeachers(teachers);
    if(valasz == -1){
        res.status(500).send("Helytelen születési dátum! Pedagógusok feltöltése sikertelen!")
        return
    }
    res.status(201).json(valasz)
}

exports.uploadStudents = async (req,res,next) =>{
    const students = req.body

    if(students.length < 1){
        res.status(500).send("Nincsenek elemek amiket feltölthetne, adjon hozzá a listához")
        return
    }
    const valasz = await adminService.uploadStudents(students)
    if(valasz == -1){
        res.status(500).send("Helytelen születési dátum! Diákok feltöltése sikertelen!")
        return
    }
    if(valasz == -2){
        res.status(500).send("Foglalt OM azonosító beküldése! Diákok feltöltése sikertelen!")
        return
    }
    if(valasz == -3){
        res.status(500).send("Hiányzó mező! Diákok feltöltése sikertelen!")
        return
    }
    res.status(201).json(valasz)
}

exports.addGuardianUsers = async (req,res,next) =>{
    const guardians = req.body
    console.log("Ő A BIGYÓ: ", guardians)
    if(guardians.length < 1){
        res.status(500).send("Nincsenek elemek amiket feltölthetne, adjon hozzá a listához")
        return
    }
    const valasz = await adminService.uploadGuardians(guardians)
    if(valasz == -1){
        res.status(402).send("Nincs ilyen om azonosítóju diák, A gondviselők feltöltése sikertelen")
        return
    }
    if(valasz == -2){
        res.status(402).send("Egy felhasználó hibás születési dátumot kapott, A gondviselők feltöltése sikertelen")
        return
    }
    if(valasz == -3){
        res.status(402).send("Nem adta meg a gondviselőhöz tartozó diákok Om azonosítóját, A gondviselők feltöltése sikertelen")
        return
    }
    else{
        res.status(201).json(valasz)
    }
    
}

exports.getAllUsers = async (req,res,next) =>{
    const users = await adminService.getAllUsers();
    res.status(201).json(users)
}

exports.modifyUser = async (req,res,next) => {
    const modifiedUser = req.body 
    const result  = await adminService.modifyUser(modifiedUser)
    res.status(201).json(result)
}

exports.deleteUser = async (req,res,next) => {
    const userID = JSON.parse(req.params.userID);

    if(userID == req.decoded.ID){
        res.status(500).send("Nem törölheti ki az aktuálisan használt felhasználót")
        return
    }
    else {
        const result = await adminService.deleteUser(userID)
        res.status(201).json(result)
    }
    
}

exports.getAllGroupsWithStudents = async (req,res,next) => {
    const eredmeny = await adminService.getAllGroupsWithStudents();
    res.status(201).json(eredmeny)
}
exports.CreateGroup = async (req,res,next) => {
    const newGroup = req.body 
    
    if(newGroup.StudentOMIDs.length < 1){
        res.status(500).send("Nem adott meg OM azonosítókat. Csoport létrehozása sikertelen.")
        return
    }
    if(newGroup.name == ''){
        res.status(500).send("Nem adott meg nevet a csoportnak. Csoport létrehozása sikertelen.")
        return
    }
    const eredmeny = await adminService.CreatedGroup(newGroup);
   
    if(eredmeny == -1){
        res.status(500).send("Az adatbázisban nem szereplő OM azonosítót adott meg. Csoport létrehozása sikertelen.")
        return
    }
    if(eredmeny == -2){
        res.status(500).send("Egy tanulo a megadott OM azonosítók egyikével már tagja egy csoportnak. Csoport létrehozás sikertelen")
        return
    }
    if(eredmeny == -3){
        res.status(500).send("Ez a csoportnév már foglalt. Csoport létrehozása sikertelen")
        return
    }
    res.status(201).json(newGroup)
}

exports.addStudentsToGroup = async (req,res,next) => {
    console.log("bentvan")
    const newUsers  = req.body
    if(newUsers.StudentOMIDs.length < 1){
        res.status(500).send("Nem adott meg OM azonosítókat. Csoport modósítása sikertelen.")
        return
    }

    const response = await adminService.addStudentsToGroup(newUsers)
    if(response == -1 ){
        res.status(500).send("Az adatbázisban nem szereplő OM azonosítót adott meg. Csoport módosítása sikertelen.")
        return
    }
    if(response == -2){
        res.status(500).send("Egy tanulo a megadott OM azonosítók egyikével már tagja egy csoportnak. Csoport módosítása sikertelen")
        return
    }
    res.status(201).send("elérted")
}

exports.deleteStudentGroup= async (req,res,next) => {
    const ID = JSON.parse(req.params.ID);
    const response = await adminService.deleteStudentGroup(ID);
    res.status(201).json(response);
}

exports.deleteGroup = async (req,res,next) =>{
    const ID = JSON.parse(req.params.ID);
    const response = await adminService.deleteGroup(ID);
    res.status(201).json(response)
}

exports.getGroupAsignments = async (req,res,next) => {
    const GroupID = JSON.parse(req.params.GroupID);
    const result = await hazikService.getAssignmentsAndAnswersByGroupID(GroupID)

    
    res.status(201).json(result)
}