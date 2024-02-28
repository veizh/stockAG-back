const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const userSchema = require("../models/user");
exports.create = async (req,res)=>{
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    req.body.password = await bcrypt.hash(req.body.password,10)
    const newUser = new userSchema({...req.body})
    newUser.save()
      .then(()=> res.status(200).json(newUser))
      .catch(err=>res.status(400).json({msg:"Ce nom de compte existe deja",err}))
  }
  exports.login= async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const {mail,password}=req.body
    if(!mail || !password ) return res.status(400).json({err:'Un champ n\'est pas rempli'})

    const user = await userSchema.findOne({mail:mail})
     if(!user)return res.status(400).json({err:"mail is unkwnown "})

    const matchingPasswords = await bcrypt.compare(password,user.password)
    if(!matchingPasswords)return  res.status(400).json({err:"le mot de passe n'est pas bon"})
    let token = createJWT(user._id)
    return res.status(200).json({success:"connected !",token})
  }

  function createJWT(id){
    return jwt.sign({id:id.toString()}, 'shhhhh')
}
exports.verifyJWT = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    try {
      const token = req.headers.authorization.split(' ')[1];
      const id = jwt.verify(token, 'shhhhh');
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