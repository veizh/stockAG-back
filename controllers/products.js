const productSchema = require("../models/product");
const { accesControler } = require("../util/access");
const userSchema = require("../models/user");

exports.getOne = async (req, res) => {
  let user = await userSchema.findOne({ _id: req.decodeToken.id });
  if (await accesControler("employe", user.role)) {
    const product = await productSchema.findOne({ ref: req.params.ref });
    if (product) return res.status(200).json(product);
    return res.status(404).json({ error: "no match for the ref" });
  } else {
    return res.status(403).json({ msg: "u dont have acces to this" });
  }
};
exports.getAll = async (req, res) => {
  let user = await userSchema.findOne({ _id: req.decodeToken.id });
  if (await accesControler("admin", user.role)) {
    const products = await productSchema.find();

    return res.status(200).json(products);
  } else {
    return res.status(403).json({ msg: "u dont have acces to this" });
  }
};

exports.create = async (req, res) => {
  let user = await userSchema.findOne({ _id: req.decodeToken.id });
  if (await accesControler("admin", user.role)) {
    const newProduct = new productSchema({ ...req.body });
    try {
      newProduct
        .save()
        .then(() =>
          res.status(200).json({ msg: "Le produit a bien été créer" })
        )

        .catch((err) =>
          res
            .status(400)
            .json({
              msg: "La localisation, le nom de produit et la référence ne doivent pas déjà exister !",
              err,
            })
        );
    } catch (err) {
      return res.status(404).json({ err: err });
    }
  } else {
    return res.status(403).json({ msg: "u dont have acces to this" });
  }
};
exports.updateOne = async (req, res) => {
  let user = await userSchema.findOne({ _id: req.decodeToken.id });
  if (await accesControler("admin", user.role)) {
    let product = await productSchema.updateOne(
      { ref: req.params.ref },
      { $set: req.body }
    );
    return res.status(200).json(product);
  } else {
    return res.status(403).json({ msg: "u dont have acces to this" });
  }
};
exports.deleteOne = async (req, res) => {
  let user = await userSchema.findOne({ _id: req.decodeToken.id });
  if (await accesControler("admin", user.role)) {
    let product = await productSchema.deleteOne({ ref: req.params.ref });
    return res.status(200).json(product);
  } else {
    return res.status(403).json({ msg: "u dont have acces to this" });
  }
};
exports.updateQuantity = async (req, res) => {
  let user = await userSchema.findOne({ _id: req.decodeToken.id });
  if (await accesControler("employe", user.role)) {
    let item = await productSchema.findOne({
      ref: req.params.ref.toUpperCase(),
    });
    if ((await item.quantity) < -req.body.quantity) {
      return res
        .status(207)
        .json({ msg: "la quantité de produits est négative." });
    }
    let product = await productSchema.updateOne(
      { ref: req.params.ref.toUpperCase() },
      { $inc: req.body }
    );
    return res.status(200).json(product);
  } else {
    return res.status(403).json({ msg: "u dont have acces to this" });
  }
};
