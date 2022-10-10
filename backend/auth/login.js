import {sc, bcrpyt} from '../vars.mjs'
import {User} from '../user-schema.mjs'
import {setCookie} from '../middlewares.mjs'

export default async (req, res) => {

  const email    = req.body.email.trim()
  const password = req.body.password.trim()

  if(!email || !password) {
    return res.status(sc.BAD_REQUEST).json({success: false, message:'Email and/or password is empty'})
  }

  const user = await User.findOne({email})
  if(!user) {
    return res.status(sc.BAD_REQUEST).json({success: false, message:`${email} is not registered`})
  }
  if(! await bcrpyt.compare(password, user.password)) {
    return res.status(sc.UNAUTHORIZED).json({success: false, message:'Password is incorrect'})
  }

  const token = user.genAccessToken()
  setCookie(req, res, 'token', token)
  setCookie(req, res, 'username', user.firstName, false)
  setCookie(req, res, 'userID', user._id, false)

  return res.status(sc.OK).json({success: true, message:'Login Successful!', token: `Bearer ${token}`, refresh_token: `Bearer ${user.genRefreshToken()}`})
}