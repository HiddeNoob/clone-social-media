import express from "express";
import { checkAuthenticate } from "../../../jwt.js";
import { getImage, uploadImage } from "../../../api/api.js";
export const image = express.Router();
import sharp from "sharp";

image.post('/image',checkAuthenticate,async (req, res) => {
    let photo = req.body
    const blob = await (await fetch(photo)).blob();
    let arrayBuffer = await blob.arrayBuffer()
    let resizedBuffer = await sharp(arrayBuffer).resize({width: 100, height: 100}).toBuffer(); // resize image to decrease the size
    let response = await uploadImage(resizedBuffer,req.user.username,"png");
    res.sendStatus(response == true ? 200 : 400);
});
image.get('/image/:username',async (req, res) => {
    const blob = await getImage(req.params.username + ".png");
    if(blob.type == "image/png"){ // s3 responses with png if it has
        res.type(blob.type)
        blob.arrayBuffer().then((buf) => {
            res.send(Buffer.from(buf))
        });
    }else{
        res.sendStatus(404)
    }
});

