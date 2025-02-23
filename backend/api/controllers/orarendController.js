const orarendService = require("../services/orarendService")

exports.getOrarend = async (req, res, next) =>
{
    console.log("órarendget")
    const groups = await orarendService.getGroup(req.decoded.ID)
    //console.log(groups)


    const lessons = await orarendService.getLessons(groups)

    const disruptions = await orarendService.getDisruptions(groups)

    console.log(disruptions+"disruptions")

    const disruptionMap = new Map()
    disruptions.forEach(disruption => {
        const key = `${disruption.day}-${disruption.start_Minute}`
        disruptionMap.set(key, disruption)
    })

    const combinedOrarend = lessons.map(lesson => {
        const key = `${lesson.day}-${lesson.start_Minute}`
        return disruptionMap.get(key) || lesson
    })

    res.status(201).json(combinedOrarend)
    console.log("órarendgetvég")
}

exports.modifyOrarend = async (req, res, next) =>
{
    
}
exports.createOrarend = async (req, res, next) =>
{
    let {oraIDk} = req.body;

    price = Number(price);

    try
    {
        var newToy =
        {
            name: name,
            price: price,
            company: company,
            shopID: shopID,
        }

        newToy = await toyService.createToy(newToy);

        res.status(201).json(newToy);
    }
    catch(error)
    {
        next(error);
    }
}

exports.createGroup = async (req, res, next) =>
{
    let {ID, name} = req.body;

    try
    {
        var newGroup =
        {
            ID: ID,
            name: name,
        }

        newGroup = await orarendService.createGroup(newGroup);

        res.status(201).json(newGroup);
    }
    catch(error)
    {
        next(error);
    }
}