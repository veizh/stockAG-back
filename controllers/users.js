var nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const userSchema = require("../models/user");
const productSchema = require("../models/product");

const { accesControler } = require('../util/access');
require("dotenv").config();
exports.create = async (req,res)=>{
    req.body.password = await bcrypt.hash(req.body.password,10)
    const newUser = new userSchema({...req.body})
    newUser.save()
      .then(()=> res.status(200).json({msg:`Un compte vient d'être ajouté`}))
      .catch(err=>res.status(400).json({msg:"Ce nom de compte existe deja",err}))
  }
  exports.login= async(req,res)=>{
    const {mail,password}=req.body
    if(!mail || !password ) return res.status(400).json({err:'Un champ n\'est pas rempli'})
  const user = await userSchema.findOne({mail:mail})
     if(!user)return res.status(400).json({err:"Ce compte n'existe pas."})

    const matchingPasswords = await bcrypt.compare(password,user.password)
    if(!matchingPasswords)return  res.status(400).json({err:"le mot de passe ne correspond pas."})
    let token = createJWT(user._id)
    return res.status(200).json({success:"connected !",token})
  
} 
    

  function createJWT(id){
    return jwt.sign({id:id.toString()}, process.env.BCRYPT_KEY)
}
exports.verifyJWT = async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const id = jwt.verify(token, process.env.BCRYPT_KEY);
         const user =  await  userSchema.find({_id:id.id})
         if(user){
            return res.status(200).json(user[0])
         }
         else res.status(404).json({msg:'didnt match'})

    } catch (error) {
      // console.log(error);
      return res.status(401).json({ error: 'Auth error!' });
      // if (!CallbackError) return;
      // return CallbackError();
    }
  };
exports.getAllUsers= async (req,res)=>{
  let user = await userSchema.findOne({ _id: req.decodeToken.id });
  if (await accesControler("admin", user.role)) {
    const users = await userSchema.find();

    return res.status(200).json(users);
  } else {
    return res.status(403).json({ msg: "u dont have acces to this" });
  }
}
exports.modifyOneUser=async (req,res)=>{
  let user = await userSchema.findOne({ _id: req.decodeToken.id });
  if (await accesControler("admin", user.role)) {

    try {
      await userSchema.updateOne(
        { _id: req.body._id },
        { $set: req.body }
      ).then(()=>res.status(200).json({msg:"Le compte a bien ete modifié."}))
      .catch(()=>res.status(404).json({msg:"Le changement n'a pas pu être effectué."}))
    } catch (error) {
        return res.status(404).json({ err: err });
    }
     
  } else {
    return res.status(403).json({ msg: "u dont own the rights" });
  }
}
exports.deleteOne = async (req, res) => {
  let user = await userSchema.findOne({ _id: req.decodeToken.id });
  if (await accesControler("admin", user.role)) {
    let deleteUser = await userSchema.deleteOne({ _id: req.params._id});
    return res.status(200).json({msg:"le compte a bien été supprimé."});
  } else {
    return res.status(403).json({ msg: "u dont have acces to this." });
  }
};
exports.sendMail= async (req,res)=>{

  async function mailing(otherproducts){
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_ACC,
        pass: process.env.MAIL_PASS
      }
    });
    const t = ""
    let suiteTxt=otherproducts.length>1?"Autres produits bientôt en rupture : \n ":"Aucun autre produit est signalé en rupture."
    if(req.body.ref&&otherproducts.length>1){
      otherproducts.map((e)=>{
        if(e.ref!==req.body.ref)
       t += e.ref +" ||| "+ e.name +" => "
      })}

    

    var mailOptions = {
      from: process.env.MAIL_ACC,
      to: process.env.MAIL_ACC,
      subject: `Urgent: La référence ${req.body.ref&&req.body.ref} est bientôt en rupture de stock`,
      text: `Il reste ${req.body.newQuantity&&req.body.newQuantity} exemplaires de ${req.body.name&&req.body.name} de référence: ${req.body.ref&&req.body.ref} ${req.body.minQuantity&&"alors que ca quantité minimal doit être de "+req.body.minQuantity}  ! \n 
      `+suiteTxt
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
  let allAlertProduct = await productSchema.find({alert:true})
  mailing(allAlertProduct)

}