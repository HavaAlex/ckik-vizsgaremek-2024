const adminService = require("../services/adminService")

exports.uploadTeachers = async (req,res,next) =>{
    const teachers = req.body
    console.log("coontrollerbe: ",teachers)
    const valasz =  await adminService.uploadTeachers(teachers);
    res.status(201).json(valasz)
}