import {sc} from '../vars.mjs'

export default async (req, res) => {
  res.clearCookie('token');
  res.clearCookie('username');
  res.clearCookie('userID');
  return res.status(sc.OK).send('LOGGED OUT')
}