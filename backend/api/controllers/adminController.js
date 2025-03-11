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