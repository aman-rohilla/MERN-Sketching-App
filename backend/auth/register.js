import {sc, bcrpyt} from '../vars.mjs'
import {User} from '../user-schema.mjs'

export default async (req, res) => {
  
  const firstName = req.body.firstName && req.body.firstName.trim()
  const lastName  = req.body.lastName && req.body.lastName.trim()
  const email     = req.body.email && req.body.email.trim()
  const password  = req.body.password && req.body.password.trim()
  
  if(!firstName || !lastName || !email || !password) {
    return res.status(sc.BAD_REQUEST).json({message: 'Some fields are empty, required fields : firstName, lastName, email, password', success: false})
  }
  if(password.length < 8) {
    return res.status(sc.BAD_REQUEST).json({message: 'Password can\'t have less than 8 characters', success: false})
  }

  const salt = await bcrpyt.genSalt(10);
  const hashedPassword = await bcrpyt.hash(password, salt);

  if(await User.findOne({email}))
    return res.status(sc.CONFLICT).json({message: `${email} is already registered`, success: false})

  const user = await User.create({firstName, lastName, email, password: hashedPassword}) 
  return res.status(sc.CREATED).json({success: true, message:'Registeration Successful!', token: `Bearer ${user.genAccessToken()}`, refresh_token: `Bearer ${user.genRefreshToken()}`})
}