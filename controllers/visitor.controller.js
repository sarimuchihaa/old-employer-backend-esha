const { Op } = require("sequelize");
const { visitor } = require("../db");

const visitorList = async (req, res) => {
  try {
    const {
      user: { id },
    } = req;

    const visitorsList = await visitor.findAll({ where: { profileId: id } });

    res.status(200).send(visitorsList);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const addVisitor = async (req, res) => {
  try {
    const {
      user: { id },
      query: { profileId },
    } = req;

    const date = new Date();

    const visitor = await visitor.findOne({
      where: { visitorId: id, profileId, createdAt: { [Op.lt]: date } },
    });

    if (!visitor) await visitor.create({ visitorId: id, profileId });
    res.status(200).send({ message: "visitor added successfully" });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  visitorList,
  addVisitor
};

