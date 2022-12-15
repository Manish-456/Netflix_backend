const jwt = require('jsonwebtoken')

const verifyToken = (req , res , next) => {
 const authHeader = req.headers.token
 if(authHeader){
  const token = authHeader.split(' ')[1]
  jwt.verify(token , process.env.JWT_SECRET, (err , user) => {
   if(err) return res.status(403).json('Token invalid')
   req.user = user
   next()
  })
 }else{
  return res.status(403).json('You are not authenticated')
 }

}
module.exports = verifyToken