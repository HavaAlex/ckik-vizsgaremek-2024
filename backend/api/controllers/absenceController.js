const absenceService = require("../services/absenceService")

exports.getAbsences = async (req, res, next) =>
{
    const absences = await absenceService.getAbsences(req.decoded.ID)

    res.status(201).json(absences);
}