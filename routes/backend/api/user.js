import express from "express";
import { checkAuthenticate } from "../../../jwt.js";
import { getUser, updateUser} from "../../../api/api.js";
import { hashPassword } from "../auth.js";
import bodyParser from "body-parser";
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
    
    res.send({username : req.user.username});

});

user.post('/me/changePassword',checkAuthenticate,bodyParser.json(),async (req, res) => {
    try{
        const user = await updateUser(req.user.username,"password",await hashPassword(req.body.password)).then((data) => {
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
    }catch(err){
        console.log(err);
        let error = {
            message: err.message,
            data : null
        }
        res.status(500).send
    }
}
);

user.get('/user/:username/follow',checkAuthenticate,bodyParser.json(),async (req, res) => {
    try{


        
        const takipEdilen = await getUser(req.params.username).then((data) => data.ok ? data.json() : (() => {throw Error(data.statusText)})());
        const takipEden = await getUser(req.user.username).then((data) => data.ok ? data.json() : (() => {throw Error(data.statusText)})());

        console.log("follow request: ",takipEden)
        console.log("to: ",takipEdilen)

        if(!takipEden.following.includes(takipEdilen.user_name) && !takipEdilen.followers.includes(takipEden.user_name)){ // eğer bi hata yoksa // include error currently...
            takipEdilen.followers.push(takipEden.user_name);
            takipEden.following.push(takipEdilen.user_name);
            updateUser(takipEdilen.user_name,"followers",takipEdilen.followers).then((response) => response.ok ? 

                updateUser(takipEden.user_name,"following",takipEden.following).then((response) => response.ok ? 
                    res.status(200).send({
                        message : "succsessful",
                        data : takipEdilen.followers
                    })
                    : 
                    (() => {throw Error("cannot update following array of " + takipEden.user_name)})()
                )
            : 
            (() => {throw Error("cannot update followers array of " + takipEdilen.user_name)})()
            
            )
        }else{
            throw Error("follower and following usernames didn't match, tell this error to the admins")
        }
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

user.get('/user/:username/unfollow',checkAuthenticate,bodyParser.json(),async (req, res) => {
    try{
        const takipdenCikilan = await getUser(req.params.username).then((data) => data.ok ? data.json() : (() => {throw Error(data.statusText)})());
        const takibiBirakan = await getUser(req.user.username).then((data) => data.ok ? data.json() : () => {throw Error(data.statusText)});
        if(takibiBirakan.following.includes(takipdenCikilan.user_name) && takipdenCikilan.followers.includes(takibiBirakan.user_name)){ // eğer bi hata yoksa
            takipdenCikilan.followers.splice(takipdenCikilan.followers.indexOf(takibiBirakan.user_name),1);
            takibiBirakan.following.splice(takibiBirakan.following.indexOf(takipdenCikilan.user_name),1);
            updateUser(takipdenCikilan.user_name ,"followers",takipdenCikilan.followers).then((response) => response.ok ? 

                updateUser(takibiBirakan.user_name,"following",takibiBirakan.following).then((response) => response.ok ? 
                    res.status(200).send({
                        message : "succsessful",
                        data : takipdenCikilan.followers
                    })
                    : 
                    (() => {throw Error("cannot update following array of " + takipEden.user_name)})()
                )
            : 
            (() => {throw Error("cannot update followers array of " + takipEdilen.user_name)})()
            
            )
        }else{
            throw Error("follower and following usernames didn't match, tell this error to the admins")
        }
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
