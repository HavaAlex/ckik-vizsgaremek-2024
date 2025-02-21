const { Op, where } = require("sequelize");
const db = require("../db/dbContext");
const assignmentFiles = require("../models/assignmentFiles");
const student = require("../models/student");
class AssignmentRepository
{

    constructor(db)
    {
        this.User = db.user;
        this.Group = db.group
        this.Student = db.student
        this.Teacher = db.teacher
        this.Assignment = db.assignment
        this.AssignmentFile = db.assignmentFiles
        this.CompletedAssignment = db.completedAssignment
    }
    async getReceivedAssignments(ID){
        let studnetID = await this.Student.findAll({
            where:{
                userId:{[Op.eq]:ID}
            }
        })
        const assignmentAnswerek = await this.CompletedAssignment.findAll({
            where:{
                [Op.or]: {
                    studentID: studnetID[0].ID,
                },
            },
        })

        const visszakuldomakkoreztarray = []
        for (const ennekacucca of assignmentAnswerek) {
            const feladat = await this.Assignment.findAll({
                where:{
                    [Op.or]:{
                        ID : ennekacucca.assignmentID
                    }
                }
            })
            const visszakuldomakkorezt = {
                valasz: ennekacucca,
                feladat: feladat[0]
            }
            visszakuldomakkoreztarray.push(visszakuldomakkorezt)

        }
        for (let i = 0; i < visszakuldomakkoreztarray.length; i++) {
            const theOneSender = await this.Teacher.findOne({
                where: { ID: visszakuldomakkoreztarray[i].feladat.teacherID },
                attributes: ["name"]
            });

            visszakuldomakkoreztarray[i].feladat.dataValues.senderUserName = theOneSender
        }
        return visszakuldomakkoreztarray;

    }
    async getsentAssignments(ID) { //kiszedem az összes assignmentet egy tömbbe és az összes hozzá tartozó answert még azon belüli tömbbe

        let techerID = await this.Teacher.findAll({
            where:{
                userId:{[Op.eq]:ID}
            }
        })
        const assignmentek = await this.Assignment.findAll({
            where:{
                [Op.or]: {
                    teacherID: techerID[0].ID,
                },
            },
        });
        const visszakuldomakkoreztarray = []
        for (const ennekacucca of assignmentek) {
            const valaszok = await this.CompletedAssignment.findAll({
                where:{
                    [Op.or]:{
                        assignmentID : ennekacucca.ID
                    }
                }
            })
            const visszakuldomakkorezt = {
                feladat: ennekacucca,
                anwsers: valaszok
            }
            visszakuldomakkoreztarray.push(visszakuldomakkorezt)

        }

        for (let i = 0; i < visszakuldomakkoreztarray.length; i++) {
            for (let j = 0; j < visszakuldomakkoreztarray[j].anwsers.length; j++) {
                const theOneSender = await this.Student.findOne({
                    where: { ID:  visszakuldomakkoreztarray[i].anwsers[j].studentID },
                    attributes: ["name"]
                });
                visszakuldomakkoreztarray[i].anwsers[j].dataValues.senderUserName = theOneSender 
            }
        }
        return visszakuldomakkoreztarray;
    }
    async getPotentialGroups() {
        const groups = await this.Group.findAll({
            attributes: ['ID', 'name'],
            include: [
                {
                    model: this.Student,
                    attributes: ['ID'],// a studentnek az ID-je kell mert amikor egy assignmentnek lesz egy válasza, azt csak diak tipusú felhasználó tudja csinálni
                    through: { attributes: [] }, // Exclude join table attributes
                }
            ]
        });
    
        const groupList = groups.map(group => ({
            ID: group.ID,
            name: group.name,
            studentList: group.Students.map(student => student.ID)
        }));
        return groupList;
    }
    async createAssignment(assignmenT, groups)
    {
        let techerID = await this.Teacher.findAll({ //req.body-ból csak a userID-t tudjuk kiszedni, szóval először megkeressük a teacherID-ját
            where:{
                userId:{[Op.eq]:assignmenT.teacherID}
            }
        })
        assignmenT.teacherID = techerID[0].ID // kicseréljük mert eddig a pontig a userId volt a teacherID de az ugye nkünk nem jó

        const newAssignment = await this.Assignment.build(assignmenT);
        await newAssignment.save();



        const celpontok = []
        for (let o = 0; o < groups.length; o++) { // Mivel több csoportot is lehet hozzáadni, ezért kiszedem a studentID-kat
            for (let p = 0; p < groups[o].studentList.length; p++) {
                celpontok.push(groups[o].studentList[p])
            }
        }
        let distinctcelpontok
        distinctcelpontok = new Set(celpontok) //distinct helyett
        for (const element of distinctcelpontok) {
            const newAssignmentAnswer = {
                ID:null,
                assignmentID: newAssignment.ID,
                studentID: element,
                date: new Date(),
                textAnswer : "",
                status: "not complated"
            }
            const pl = await this.CompletedAssignment.build(newAssignmentAnswer)
            await pl.save()
        }
        return newAssignment;
    }
    async uploadFiles(files, assignmentId) { //varázslat
        try {
            if (!files || files.length === 0) {
                throw new Error('No files uploaded');
            }
            if (!assignmentId) {
                throw new Error('assignmentID is required');
            }
    
            const uploadedFiles = await Promise.all(files.map(async (file) => {
                return await this.AssignmentFile.create({
                    ID: null, // Auto-incremented by the database
                    assignmentID: assignmentId,
                    desc: file.buffer // Store file content in desc (LONGBLOB)
                });
            }));
    
            return { message: 'Files uploaded successfully', uploadedFiles };
        } catch (error) {
            console.error('Upload Error:', error);
            throw new Error(`File upload failed: ${error.message}`);
        }
    }
    async modifycompletedassignment(ID,completedassignment){
        console.log("EZ LESZ FELBASZVA")
        console.log(completedassignment)
        // Assume User is a Sequelize model
        const changedAnswer = await this.CompletedAssignment.findOne({ where: { id: completedassignment.ID } });
        
        await changedAnswer.update({ textAnswer: completedassignment.textAnswer });
        await changedAnswer.update({ date: completedassignment.date });
        await changedAnswer.update({ status: completedassignment.status });
        console.log(changedAnswer)

        return changedAnswer
    }
}

module.exports = new AssignmentRepository(db);