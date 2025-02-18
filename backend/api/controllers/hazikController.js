const group = require("../models/group");
const hazikService = require("../services/hazikService")


exports.getGroups = async (req, res, next) =>{
    const targetGroups = await hazikService.getGroups();
    res.status(201).json(targetGroups);
}

exports.postAssignment = async (req, res, next) =>{
    let {Groups,Description,DeadLine,UploadDate,} = req.body;
    console.log("groups: ")
    console.log(Groups)
    console.log("desc")
    console.log(Description)
    console.log("dedlinge")
    console.log(DeadLine)
    console.log("uploaddate")
    console.log(UploadDate)
    console.log("fileok")
    console.log()
    const newHazi = {
        ID: null,
        teacherID: req.decoded.ID,
        desc: Description,
        deadline: DeadLine
    }
    let cucc =  await hazikService.createAssignment(newHazi,Groups);
    res.status(200).json(cucc)
}

exports.uploadAssignmentFiles = async (req, res, next) => {
    try {
      // Multer populates req.files with the uploaded files
      const uploadedFiles = req.files;
  
      // The assignmentId will be in req.body.assignmentId
      const { assignmentId } = req.body;
  
      console.log("Files received:", uploadedFiles);
      console.log("Assignment ID:", assignmentId);
  
      // TODO: Do something with the files (e.g. save to disk, upload to S3, store in DB, etc.)
      // Each file in uploadedFiles has fields like: fieldname, originalname, buffer, etc.
      // For example:
      // uploadedFiles.forEach(file => {
      //   // do something with file.buffer or file.originalname
      // });
  
      res.status(200).json({ message: "Files uploaded successfully" });
    } catch (error) {
      console.error("File upload error:", error);
      res.status(500).json({ message: "Error uploading files" });
    }
  };
  