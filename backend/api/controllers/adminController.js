const adminService = require("../services/adminService")

exports.uploadTeachers = async (req,res,next) =>{
    const teachers = req.body
    const valasz =  await adminService.uploadTeachers(teachers);
    res.status(201).json(valasz)
}

exports.uploadStudents = async (req,res,next) =>{
    const students = req.body
    const valasz = await adminService.uploadStudents(students)
    res.status(201).json(valasz)
}

exports.addGuardianUsers = async (req,res,next) =>{
    const guardians = req.body
    const valasz = await adminService.uploadGuardians(guardians)
    res.status(201).json(valasz)
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
    const result = await adminService.deleteUser(userID)
    res.status(201).json(result)
}