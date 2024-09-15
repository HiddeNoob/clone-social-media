import express, { response } from "express";
import { checkAuthenticate } from "../../../jwt.js";
import { uploadImage } from "../../../api/api.js"
import { user } from "./user.js";
export const image = express.Router();

image.post('/image',checkAuthenticate,async (req, res) => {
    let photo = req.body
    const blob = await (await fetch(photo)).blob();
    let response = await uploadImage(blob,req.user.username,"png")
    res.sendStatus(response == true ? 200 : 400)
});

