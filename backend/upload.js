import fs, { mkdirSync } from 'fs'
import base64Img from 'base64-img'
import {mongoose, sc} from './vars.mjs'
import {Sketch} from './sketch-schema.js'
const ObjectId = mongoose.Types.ObjectId

const SKETCHES_DIR = './sketches'
if(!fs.existsSync(SKETCHES_DIR)) {
  mkdirSync(SKETCHES_DIR)
}

export default async (req, res) => {   
  const data = req.fields.image;
  const sketchID = ObjectId()

  
  base64Img.img(data, 'sketches', sketchID, async (err, filepath) => {
    const sketch = await Sketch.create({_id: sketchID, title: req.fields.title, sketchUserID: req.userID, sketchUserName: req.userName})

    const jsRes = {success: err ? false : true}
    if(!err) {
      const sketchRes = {sketchID: sketch._id, title: sketch.title, sketchUserName: sketch.sketchUserName, sketchUserID: sketch.sketchUserID, members: sketch.members }
      jsRes.sketch = sketchRes
    }

    res.status(err ? sc.INTERNAL_SERVER_ERROR : sc.CREATED).json(jsRes)
  });

}