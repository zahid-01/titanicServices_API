const { catchAsync } = require("../Utilities/catchAsync");
const appError = require("../Utilities/error");

exports.createOne = (Model) =>
  catchAsync(async (req, res) => {
    const data = await Model.create(req.body);

    res.status(200).json({
      status: "Success",
      data,
    });
  });

exports.readOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const data = await Model.findById(req.params.id);

    if (!data) return next(new appError(400, "No document with that id found"));

    res.status(200).json({
      status: "Success",
      data,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res) => {
    const data = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!data) return next(new appError(400, "No document with that id found"));

    res.status(200).json({
      status: "Success",
      data,
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const data = await Model.findByIdAndDelete(req.params.id);

    if (!data) return next(new appError(400, "No document with that id found"));

    res.status(204).json({
      status: "Success",
    });
  });

exports.readAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const data = await Model.find();

    if (!data) return next(new appError(400, "No data found"));

    res.status(200).json({
      status: "Success",
      data,
    });
  });
