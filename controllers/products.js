const productSchema = require("../models/product");
const { accesControler } = require("../util/access");
const userSchema = require("../models/user");

exports.getOne = async (req, res) => {
  let user = await userSchema.findOne({ _id: req.decodeToken.id });
  if (await accesControler("employe", user.role)) {
    const product = await productSchema.findOne({ _id: req.params._id });
    if (product) return res.status(200).json(product);
    return res.status(404).json({ error: "no match for the ref" });
  } else {
    return res.status(403).json({ msg: "u dont have acces to this" });
  }
};
exports.getAll = async (req, res) => {
  const products = await productSchema.find();

    return res.status(200).json(products);

};

exports.create = async (req, res) => {
  let user = await userSchema.findOne({ _id: req.decodeToken.id });
  if (await accesControler("admin", user.role)) {
    const newProduct = new productSchema({ ...req.body });
    try {
      newProduct
        .save()
        .then(() =>
          res.status(200).json({ msg: "Le produit a bien été ajouté au stock !" })
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

    if(Number(req.body.quantity)<Number(req.body.minQuantity)){
      let tmp = req.body
      tmp.alert=true
      let product = await productSchema.updateOne(
        { _id: req.params._id },
        { $set: tmp }
        
      );
      console.log(tmp);
      
      return res.status(201).json(product);
    };

    let tmp = req.body
    tmp.alert=false
    let product = await productSchema.updateOne(
      { _id: req.params._id },
      { $set: tmp }
    );
    return res.status(200).json(product);
  } else {
    return res.status(403).json({ msg: "u dont have acces to this" });
  }
};
exports.deleteOne = async (req, res) => {
  let user = await userSchema.findOne({ _id: req.decodeToken.id });
  if (await accesControler("admin", user.role)) {
    let product = await productSchema.deleteOne({ _id: req.params._id });
    return res.status(200).json(product);
  } else {
    return res.status(403).json({ msg: "u dont have acces to this" });
  }
};
exports.updateQuantityAndAlert = async (req, res) => {
  let user = await userSchema.findOne({ _id: req.decodeToken.id });
  if (await accesControler("employe", user.role)) {
    console.log(req.body.quantity);
    let item = await productSchema.findOne({
      _id: req.params._id,
    });
    if ((await item.quantity) < -req.body.quantity) {
      return res
        .status(207)
        .json({ msg: "la quantité de produits ne doit pas être négative." });
    }
    let product = await productSchema.updateOne(
      { _id: req.params._id },
      {$set:{alert:true,quantity:req.body.quantity}}
    );
    return res.status(200).json(product);
  } else {
    return res.status(403).json({ msg: "Vous n'avez pas les autorisations." });
  }
};
exports.removeProductAndHandleAlert = async (req, res) => {
  let user = await userSchema.findOne({ _id: req.decodeToken.id });
  if (await accesControler("employe", user.role)) {
    console.log('bien la fonction remove : ' + req.body.quantity);
    let item = await productSchema.findOne({
      _id: req.params._id,
    });
    let newQuantity = Number(item.quantity) - Number(req.body.quantity)
    console.log("minqt: "+item.minQuantity);
    if (newQuantity<0) {
      return res
        .status(207)
        .json({ msg: "la quantité de produits ne doit pas être négative." });
    }
    
    if(item.minQuantity>newQuantity){
      let product = await productSchema.updateOne(
        { _id: req.params._id },
        {$set:{alert:true,quantity:newQuantity}}
      );
      return res.status(201).json(product);
    }
    let product = await productSchema.updateOne(
      { _id: req.params._id },
      {$set:{alert:false,quantity:newQuantity}}
    );
    return res.status(200).json(product);
  } else {
    return res.status(403).json({ msg: "Vous n'avez pas les autorisations." });
  }
};
exports.addProductAndHandleAlert = async (req, res) => {
    console.log('bien la fonction add : ' + req.body.quantity);
    let item = await productSchema.findOne({
      _id: req.params._id,
    });
    if ((await item.quantity) < -req.body.quantity) {
      return res
        .status(207)
        .json({ msg: "la quantité de produits ne doit pas être négative." });
    }
    let newQuantity = Number(item.quantity) + Number(req.body.quantity)
    console.log("minqt: "+item.minQuantity);
    
    if(item.minQuantity>newQuantity){
      let product = await productSchema.updateOne(
        { _id: req.params._id },
        {$set:{alert:true,quantity:newQuantity}}
      );
      return res.status(201).json(product);
    }
    let product = await productSchema.updateOne(
      { _id: req.params._id },
      {$set:{alert:false,quantity:newQuantity}}
    );
    return res.status(200).json(product);
  }


exports.updateImage = async (req, res) => {
  let user = await userSchema.findOne({ _id: req.decodeToken.id });
  if (await accesControler("admin", user.role)) {

  

    let tmp = req.body
    let product = await productSchema.updateOne(
      { _id: req.params._id },
      { $set: tmp }
    );
    return res.status(200).json(product);
  } else {
    return res.status(403).json({ msg: "u dont have acces to this" });
  }
};

exports.returnFromInter = async (req,res)=>{
  
    console.log("produit",req.body._id,":" ,req.body);

    if(req.body.broken===true){
     let product =  await productSchema.findOneAndUpdate(
  { _id: req.params._id},
  { $inc: { broken: req.body.quantity } }
);
return res.status(200).json(product);
      
    }
      let product = await productSchema.findOneAndUpdate(
        { _id: req.params._id},
  { $inc: { quantity: Number(req.body.quantity) } }
      )
      
return res.status(200).json(product);
      
    

    
}