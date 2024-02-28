const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.verify(token,'shhhhh')
        if(decodeToken){
        req.decodeToken = decodeToken;
        }
    next()
  } catch (error) {
    // console.log(error);
    return res.status(401).json({ error: 'Auth error!' });
    // if (!CallbackError) return;
    // return CallbackError();
  }
};