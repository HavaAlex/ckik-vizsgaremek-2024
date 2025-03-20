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

    if(!newHazi.deadline ){
      res.status(500).send("Nincs határidő megadva")
      return
    }
    if(Groups.length<1){
      res.status(500).send("Nincs csoport megadva")
      return
    }
    if(new Date(newHazi.deadline) < Date.now()){
      res.status(500).send("Nem athad meg eleve lejárt határidőt")
      return
    }
    if(!newHazi.desc){
      res.status(500).send("Nincs megadva leírás")
      return
    }
    console.log("MINEN OKÉÉÉÉÉ JIPPPIIIII ", newHazi)
    console.log("JELENLEGI IDŐP ",  Date.now())
    let cucc =  await hazikService.createAssignment(newHazi,Groups);
    res.status(200).json(cucc)
}

exports.uploadAssignmentFiles = async (req, res, next) => {
    try {
      const uploadedFiles = req.files;
      const { assignmentId } = req.body; 
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
  const modositotthazik = await hazikService.modifycompletedassignment(completedassignment)
  res.status(201).json(modositotthazik)
}

exports.getAssignmentFiles = async (req,res,next) =>{
  const {assignmentId} = req.body;
  const assignmentFilesArray = await hazikService.getAssignmentFiles(assignmentId)
  res.status(201).json(assignmentFilesArray)
}

exports.getCompletedAssignmentFiles = async (req,res,next) =>{
  const {assignmentId} = req.body;
  const assignmentIds = new Set(assignmentId)
  const completedassignmentFilesArray = await hazikService.getCompletedAssignmentFiles(assignmentIds)
  res.status(201).json(completedassignmentFilesArray)
}

exports.deleteAssignment = async (req,res,next) =>{
  const assignmentId = req.params.assignmentId;
  const cucc = await hazikService.deleteAssignment(assignmentId)
  res.status(201).json(cucc)
}
exports.deleteCompletedAssignmentFile = async (req,res,next) =>{
  const fileId = req.params.fileId;
  const cucc = hazikService.deleteCompletedAssignmentFile(fileId)
  res.status(201).json(cucc)
}