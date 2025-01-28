const userService = require("../services/userService")

exports.getOrarend = async (req, res, next) =>
{
    console.log(next)
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

exports.createOra = async (req, res, next) =>
{
    let {tantargyID,} = req.body;

    price = Number(price);

    try
    {
        var newOra =
        {
            name: name,
            price: price,
            company: company,
            shopID: shopID,
        }

        newOra = await orarendService.createOra(newOra);

        res.status(201).json(newOra);
    }
    catch(error)
    {
        next(error);
    }
}