const Coach = require("../models/Coach");

const addCoach = async (req, res) => {
  const { name, expertise, fee, availability } = req.body;

  const coach = new Coach({
    name,
    expertise,
    fee,
    availability
  });

  await coach.save();
  res.json({ message: "Coach added", coach });
};

const getAllCoaches = async (req, res) => {
  const coaches = await Coach.find();
  res.json(coaches);
};

const updateCoach = async (req, res) => {
  const coachId = req.params.id;
  const { name, expertise, fee, availability } = req.body;

  const updated = await Coach.findByIdAndUpdate(
    coachId,
    {
      name,
      expertise,
      fee,
      availability
    },
    { new: true }
  );

  res.json({ message: "Coach updated", updated });
};

module.exports = {
  addCoach,
  getAllCoaches,
  updateCoach
};
