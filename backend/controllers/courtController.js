const Court = require("../models/Court");

const listCourts = async (req, res) => {
  const courts = await Court.find({ active: true });
  res.json(courts);
};

const createCourt = async (req, res) => {
  // Accept either `active` or `isActive` from clients and normalize to `active`.
  const { name, type, basePrice, active, isActive } = req.body;
  const court = await Court.create({
    name,
    type,
    basePrice,
    active:
      typeof active === "boolean"
        ? active
        : typeof isActive === "boolean"
        ? isActive
        : undefined,
  });
  res.status(201).json(court);
};

const updateCourt = async (req, res) => {
  const courtId = req.params.id;
  const updated = await Court.findByIdAndUpdate(courtId, req.body, {
    new: true,
  });
  res.json(updated);
};

const disableCourt = async (req, res) => {
  const courtId = req.params.id;
  const changed = await Court.findByIdAndUpdate(
    courtId,
    { active: false },
    { new: true }
  );
  res.json(changed);
};

module.exports = {
  listCourts,
  createCourt,
  updateCourt,
  disableCourt,
};
