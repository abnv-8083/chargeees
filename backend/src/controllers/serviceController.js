const Service = require('../models/Service');

exports.getServices = async (req, res, next) => {
  try {
    const { admin } = req.query;
    const query = admin ? {} : { isPublished: true };
    const services = await Service.find(query).sort('order');
    res.status(200).json({ success: true, data: services });
  } catch (err) { next(err); }
};

exports.getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });
    res.status(200).json({ success: true, data: service });
  } catch (err) { next(err); }
};

exports.createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (err) { next(err); }
};

exports.updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });
    res.status(200).json({ success: true, data: service });
  } catch (err) { next(err); }
};

exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });
    res.status(200).json({ success: true, message: 'Service deleted.' });
  } catch (err) { next(err); }
};
