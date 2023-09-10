const multer = require("multer");
const sharp = require("sharp");

const Product = require("../Model/productsModel");

const { createOne, deleteOne, updateOne } = require("./handlerFactory");
const AppError = require("../Utilities/error");
const { catchAsync } = require("../Utilities/catchAsync");

exports.resizePhoto = catchAsync(async (req, res, next) => {
  if (!req.files) return next();
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (el, i) => {
      const extension = el.mimetype.split("/")[1];
      const productCode = req.body.productCode;
      const filename = `${productCode}-${i}.${extension}`;
      req.body.images.push(filename);

      await sharp(el.buffer)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 100 })
        .toFile(`public/img/products/${filename}`);
    })
  );

  next();
});

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new AppError(400, "Not an image"));
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadPhoto = upload.fields([{ name: "images", maxCount: 3 }]);

exports.addProduct = createOne(Product);
exports.deleteProduct = deleteOne(Product);
exports.updateProduct = updateOne(Product);

exports.getProduct = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);
  const images = product.images.map((el) => {
    return req.protocol + "://" + req.get("host") + "/img/products/" + el;
  });

  product.images = images;

  res.status(200).json({
    status: "Success",
    product,
  });
});

exports.getAllProducts = catchAsync(async (req, res) => {
  const products = await Product.find();

  products.forEach((el) => {
    const images = el.images.map((el) => {
      return req.protocol + "://" + req.get("host") + "/img/products/" + el;
    });

    el.images = images;
  });

  res.status(200).json({
    status: "Success",
    products,
  });
});

exports.getFilteredProducts = catchAsync(async (req, res) => {});
