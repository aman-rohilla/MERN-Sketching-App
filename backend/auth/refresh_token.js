import {sc, jwt, JWT_SECRET} from '../vars.mjs'

export default async (req, res) => {
  let userToken = req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1] : null
  
  if(!userToken) {
    return res.status(sc.BAD_REQUEST).json({success: false, message: 'Refresh token was expected'})
  }
  
  try {
    const decodedPayload = jwt.verify(userToken, JWT_SECRET) 
    const userID = decodedPayload.userID
    if(decodedPayload.refreshToken != true) {
      return res.status(sc.BAD_REQUEST).json({success: false, message: 'Refresh token was expected'})
    }

    const token = jwt.sign({userID}, JWT_SECRET, {expiresIn: '7d'})
    return res.status(sc.OK).json({success: true, token: `Bearer ${token}`})
  } catch(error) {
    return res.status(sc.UNAUTHORIZED).json({success: false, message: 'Token tempered'})
  }
}