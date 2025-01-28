

exports.getUzenetek = async (req, res, next) =>
{
    console.log(next)
}

exports.modifyUzenet = async (req, res, next) =>
{
    
}
exports.createUzenet = async (req, res, next) =>
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