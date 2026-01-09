const Session = require("../models/session");
const Professor = require("../models/professor");
const User = require("../models/user");
const { Op } = require("sequelize");

//creates a session

exports.createSession = async (req, res, next) => {
  const professorId = req.user.userId;
  const { startDateHour, endDateHour, description } = req.body;

  if (!startDateHour || !endDateHour) {
    return res
      .status(400)
      .json({ message: "Start and end dates are required." });
  }

  try {
    const startDate = new Date(startDateHour);
    const endDate = new Date(endDateHour);

    if (startDate >= endDate) {
      return res
        .status(400)
        .json({ message: "Start date must be before end date." });
    }

    const overlapping = await Session.findOne({
      where: {
        professorId: professorId,
        [Op.and]: [
          { endDateHour: { [Op.gt]: startDate } },
          { startDateHour: { [Op.lt]: endDate } },
        ],
      },
    });

    if (overlapping) {
      return res.status(409).json({
        message:
          "Conflict: This session overlaps with an existing one for this professor.",
        overlappingSessionId: overlapping.id,
      });
    }

    const newSession = await Session.create({
      professorId: professorId,
      startDateHour: startDate,
      endDateHour: endDate,
      description: description,
      isActive: true,
    });

    res.status(201).json(newSession);
  } catch (error) {
    console.error("Error creating session:", error);
    next(error);
  }
};

exports.getSessions = async (req, res, next) => {
  const professorId = req.user.userId;

  try {
    const sessions = await Session.findAll({
      where: { professorId: professorId },
      order: [["startDateHour", "ASC"]],
    });
    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    next(error);
  }
};

exports.getAllSessions = async(req, res, next) => {
  try{
    const sessions = await Session.findAll({
      where: { isActive: true },
      include: [
        {
          model: Professor,
          as: "Professor",
          include: [
            {
              model: User,
              attributes: ["name"],
            },
          ],
        },
      ],
    });
    res.status(200).json(sessions);
  }catch(error) {
    next(error);
  }
}