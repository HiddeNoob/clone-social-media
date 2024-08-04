import express from "express";
import { checkAuthenticate } from "../../../jwt.js";
import { getUser} from "../../../api/api.js";

export const user = express.Router();


user.get('/user/:user_name',checkAuthenticate,async (req, res) => {
    try{
        const user = await getUser(req.params.user_name).then((data) => {
            if(data.ok){
                return data.json()
            }else{
                throw new Error(data.statusText)
            }
        })
        res.status(200).send({
            "message": "Success",
            "data" : user
        });
    }
    catch(err){
        console.log(err);
        let error = {
            message: err.message,
            data : null
        }
        res.status(500).send(error);
    }
});

user.get('/me',checkAuthenticate,async (req, res) => {
    
    res.send(req.user);

});