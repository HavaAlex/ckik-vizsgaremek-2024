const jegyService = require("../services/jegyService")
const groupService = require("../services/csoportService")

exports.getJegyek = async (req, res, next) =>
{
    const jegyek = await jegyService.getJegyek(req.role.ID)
    res.status(201).json(jegyek);
}

exports.getJegyekTanar = async (req, res, next) =>
{
<<<<<<< HEAD
=======
    console.log("_________")
    console.log("tanár jegy get: ")
>>>>>>> fae76cfb19fe97390f7d74478000bfcf8a6a80dc
    const csoportok = await groupService.getTeacherGroups(req.role.ID)
    console.log("a: ", csoportok)
    console.log("_________")
    const jegyek = [];
    for (const element of csoportok) { //csoportok alapján vannak csoportosítva a jegyek, és azon belül tantárgyanként, majd dátum és személy alapján csak frontenden
        const csoportJegyei = await jegyService.getJegyekCsoport(element.ID)
        const targyak = new Set()
        const targyAlapjan = []
        csoportJegyei.forEach((jegy) => {
            targyak.add(jegy.subjectName);
    
            if (targyAlapjan.length !== targyak.size) {
                const beszurando = []
                targyAlapjan.push(beszurando);
            }
            const ido = new Date(jegy.date)
            targyAlapjan[[...targyak].indexOf(jegy.subjectName)].push(jegy);//[ido.getMonth()]
        });
    
        const object = {
            groupName: element.name,
            marks: targyAlapjan,
            tantargyak:[...targyak] //lista convert
        };
        jegyek.push(object);
    }
    console.log("_________")
    console.log("b: ", jegyek)
    console.log("_________")
    res.status(201).json(jegyek);

}

exports.getJegyekSzulo = async (req, res, next) =>
{
    const jegyek = await jegyService.getJegyek(req.params.id)
    res.status(201).json(jegyek);
}

exports.createJegy = async (req, res, next) =>
{
    let {studentID,Value,Multiplier,subjectName} = req.body;
    try
    {
        var newJegy =
        {
            ID: undefined,
            teacherID: req.role.ID,
            studentID: studentID,
            Value:Value,
            Multiplier:Multiplier,
            subjectName:subjectName,
        }
        newJegy = await jegyService.createJegy(newJegy);
        res.status(201).json(newJegy);
    }
    catch(error)
    {
        next(error);
    }
}