const hazikService = require("../services/hazikService")

exports.getGroups = async (req, res, next) =>{
    const targetGroups = await hazikService.getGroups();
    res.status(201).json(targetGroups);
}