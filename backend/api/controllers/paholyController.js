const paholyService = require("../services/paholyService");

exports.createToy = async (req, res, next) =>
{
    let {name, price, company, shopID} = req.body;

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

exports.getToy = (req, res, next) =>
{
    const {index} = req.params;

    const toy = toys[index];

    try
    {
        if(!toy)
        {
            const error = new Error("Toy not found!");
    
            error.status = 404;
    
            throw error;
        }

        res.status(200).json(toy);
    }
    catch(error)
    {
        next(error);
    }
}