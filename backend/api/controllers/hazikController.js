const group = require("../models/group");
const hazikService = require("../services/hazikService")


exports.getGroups = async (req, res, next) =>{
    const targetGroups = await hazikService.getGroups();
    res.status(201).json(targetGroups);
}

exports.postAssignment = async (req, res, next) =>{
    let {Groups,Description,DeadLine,UploadDate} = req.body;
    const newHazi = {
        ID: null,
        teacherID: req.decoded.ID,
        desc: Description,
        deadline: DeadLine,
        uploadDate: UploadDate
    }
    let cucc =  await hazikService.createAssignment(newHazi,Groups);
    res.status(200).json(cucc)
}

exports.uploadAssignmentFiles = async (req, res, next) => {
    try {
      const uploadedFiles = req.files;
      const { assignmentId } = req.body; 
  
      let nagycucc= await hazikService.uploadFiles(uploadedFiles, assignmentId)
      res.status(200).json({ nagycucc });
    } catch (error) {
      console.error("File upload error:", error);
      res.status(500).json({ message: "Error uploading files" });
    }
};
  
exports.getsentAssignments = async (req,res,next) =>{
      const hazik = await hazikService.getsentAssignments(req.decoded.ID)
      res.status(201).json(hazik);
}

exports.getReceivedAssignments = async (req,res,next) => {
      const hazik = await hazikService.getReceivedAssignments(req.decoded.ID)
      res.status(201).json(hazik);
}

exports.getTeacherAssignmentFiles = async (req,res,next) => {
  const haziFileok = await hazikService.getTeacherAssignmentFiles(req.decoded.ID)
  res.status(201).json(haziFileok)
}

exports.modifycompletedassignment = async (req,res,next) => {
  const {ID,assignmentID,date,status,studentID,textAnswer} = req.body
  const completedassignment = {
    ID: ID,
    assignmentID: assignmentID,
    date: date,
    status:status,
    studentID:studentID,
    textAnswer:textAnswer
  }
  console.log("EZAZ TTE SZAROS")
  console.log(completedassignment)
  const modositotthazik = await hazikService.modifycompletedassignment(req.decoded.ID,completedassignment)
  res.status(201).json(modositotthazik)
}