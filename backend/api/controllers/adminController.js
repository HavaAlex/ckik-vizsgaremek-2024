const { endsWith } = require("lodash")
const adminService = require("../services/adminService")
const hazikService = require("../services/hazikService")
const userRepository = require("../repositories/userRepository")
const studentRepository = require("../repositories/studentRepository")
const orarendService = require("../services/orarendService")
const groupRepository = require("../repositories/groupRepository")
const lessonRepository = require("../repositories/lessonRepository")

exports.uploadTeachers = async (req,res,next) =>{
    const teachers = req.body
    console.log("a: ", teachers)
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

exports.getAllStudents = async (req,res,next) =>{
    const students = await adminService.getAllStudents();
    res.status(201).json(students)
}


exports.modifyUser = async (req,res,next) => {

    const modifiedUser = req.body 

    const userWithThisID = await userRepository.getUserByID(modifiedUser.userSide)
    const result  = await adminService.modifyUser(modifiedUser, userWithThisID.username)
    if(result == -1){
        res.status(500).send("Ez az OM azonosító már foglalt")
        return
    }
    else if(result == -2 ){
        res.status(500).send("Ez a felhasználónév már foglalt")
        return
    }
    else{

        res.status(201).json(result)
        
    }
    
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

exports.deleteAbsence = async (req,res,next) => {
    const absenceID = req.params.userID;

    const result = await adminService.deleteAbsence(absenceID)
    res.status(201).json(result)
}
    


exports.addStudentsToGuardian = async(req,res,next) =>{
    const newStudentOMIDs = req.body 
    const students = [];
    for (const Id of newStudentOMIDs.newOMIDs) {
        const student = await studentRepository.getStudentByOmId(Id)
        
        if(!student){
            res.status(500).send("Helytelen OM azonosítót adott meg. Diákok hozzáadása sikertelen!")
            return
        }
        else{
            students.push(student)
        }

    }
    const response = await adminService.addStudentToGuardian(newStudentOMIDs.szuloID, students)

    
    res.status(201).json(response)
}

exports.getAllGroupsWithStudents = async (req,res,next) => {
    const eredmeny = await adminService.getAllGroupsWithStudents();
    res.status(201).json(eredmeny)
}

exports.getAllGroups = async (req,res,next) => {
    const response = await adminService.getAllGroups();
    res.status(201).json(response)
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
    console.log(".............................")
    console.log("a: ", ID)
    const response = await adminService.deleteGroup(ID);
    console.log("b: ", response)
    res.status(201).json(response)
}

exports.getGroupAsignments = async (req,res,next) => {
    const GroupID = JSON.parse(req.params.GroupID);
    const result = await hazikService.getAssignmentsAndAnswersByGroupID(GroupID)
    res.status(201).json(result)
}


exports.getAbsences = async (req,res,next) =>{
    const absences = await adminService.getAbsences();
    res.status(201).json(absences)
}

exports.modifyAbsence = async (req,res,next) => {
    const absenceToBeModified = req.body 
    console.log(absenceToBeModified)
    if(absenceToBeModified.excused == false){ // tehát most igazoljuk le
        var modifiedAbsence = await adminService.approveAbsence(absenceToBeModified);
    }
    else{ // tehat elveszuk az igazolast
        var modifiedAbsence = await adminService.disapproveAbsence(absenceToBeModified);
    }
    res.status(201).json(modifiedAbsence)

    
    
}

exports.getOrarend = async (req, res, next) =>
{
    const weekStart = req.query.weekStart
    console.log(req.params.id+"!!")
    let group = await groupRepository.getGroupByID(req.params.id)

    console.log(group,"767346")

    let combinedOrarend;
    try{
        combinedOrarend = await orarendService.getOrarend([group],weekStart)
        console.log(combinedOrarend)
        res.status(201).json(combinedOrarend)
    }
    catch(error)
    {
        next(error)
    }   
}


exports.getAllTeachers = async (req,res,next) => {
    const response = await adminService.getAllTeachers();
    res.status(201).json(response)
}


exports.uploadLessons = async (req, res, next) =>
{
    console.log(req.body)
    const lessons = req.body;
    try
    {
        const response = await adminService.uploadLessons(lessons)
        //console.log("adminController: vége a kérésnek!",response)
        if(response.message)
        {
            res.status(400).json(response)
        }
        else
        {
            res.status(201).json(response);
        }
    }
    catch(error)
    {
        next(error)
    }
}


exports.uploadDisruption = async (req, res, next) =>
{
    console.log(req.body,"ITT IDE HE")
    const disruption = req.body;
    try
    {
        const response = await adminService.uploadDisruption(disruption)
        //console.log("adminController: vége a kérésnek!",response)
        if(response.message)
        {
            res.status(400).json(response)
        }
        else
        {
            res.status(201).json(response);
        }
    }
    catch(error)
    {
        next(error)
    }
}

exports.modifyLesson = async (req,res,next) => {
    const modifiedLesson = req.body 
    console.log(modifiedLesson,"ITT IDE HE")
    try{
        const response  = await adminService.modifyLesson(modifiedLesson)
        res.status(201).json(response)
    }
    catch(error){
        next(error)
    }
    
}


exports.deleteLesson= async (req,res,next) => {
    const ID = JSON.parse(req.params.ID);
    const response = await adminService.deleteLesson(ID);
    res.status(201).json(response);
}