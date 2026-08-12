const { HeroSection, AboutSection, VisionSection, MissionSection } = require('../models/Sections');

// Generic get-or-create singleton helper
const getSingleton = (Model) => async (req, res, next) => {
  try {
    let doc = await Model.findOne();
    if (!doc) doc = await Model.create({});
    res.status(200).json({ success: true, data: doc });
  } catch (err) { next(err); }
};

const updateSingleton = (Model) => async (req, res, next) => {
  try {
    let doc = await Model.findOne();
    if (!doc) {
      doc = await Model.create(req.body);
    } else {
      doc = await Model.findByIdAndUpdate(doc._id, req.body, { new: true, runValidators: true });
    }
    res.status(200).json({ success: true, data: doc });
  } catch (err) { next(err); }
};

exports.getHero = getSingleton(HeroSection);
exports.updateHero = updateSingleton(HeroSection);

exports.getAbout = getSingleton(AboutSection);
exports.updateAbout = updateSingleton(AboutSection);

exports.getVision = getSingleton(VisionSection);
exports.updateVision = updateSingleton(VisionSection);

exports.getMission = getSingleton(MissionSection);
exports.updateMission = updateSingleton(MissionSection);
