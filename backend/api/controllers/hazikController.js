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
      console.log("kakakakaaa",uploadedFiles)
      let nagycucc= await hazikService.uploadAssignmentFiles(uploadedFiles, assignmentId)
      res.status(200).json({ nagycucc });
    } catch (error) {
      console.error("File upload error:", error);
      res.status(500).json({ message: "Error uploading files" });
    }
};

exports.uploadCompletedAssignmentFiles = async (req, res, next) => {
  try {
    const uploadedFiles = req.files;
    const { completedAssignmentId } = req.body; 
    console.log("kakakakaaa",uploadedFiles)
    console.log("EZ MIÉRZT HA UNDEFINED AKKOR BSZAROK", completedAssignmentId)
    let nagycucc= await hazikService.uploadCompletedAssignmentFiles(uploadedFiles, completedAssignmentId)
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

exports.getAssignmentFiles = async (req,res,next) =>{
  const {assignmentId} = req.body;
  console.log("controllerbe a követrkező : ",assignmentId)
  const assignmentFilesArray = await hazikService.getAssignmentFiles(assignmentId)
  res.status(201).json(assignmentFilesArray)
}