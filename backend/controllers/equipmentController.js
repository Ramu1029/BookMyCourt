const Equipment = require("../models/Equipment");

const getAllEquipment = async (req, res) => {
  const list = await Equipment.find({});
  res.json(list);
};

const addEquipment = async (req, res) => {
  const { name, total, price } = req.body;
  const item = await Equipment.create({
    name,
    total,
    price
  });
  res.status(201).json(item);
};

const updateEquipment = async (req, res) => {
  const id = req.params.id;
  const updated = await Equipment.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
};

module.exports = {
  getAllEquipment,
  addEquipment,
  updateEquipment
};
