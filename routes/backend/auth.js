import express from "express";
import bodyParser from "body-parser";
import {generateAccessToken} from "../../jwt.js";
import {getUser,createUser} from "../../api/api.js";
import bcrypt from 'bcrypt';

export const auth = express.Router();

auth.post('/register', bodyParser.json(),async (req, res) => {
    try{
        const username = req.body.username
        const password = req.body.password
        let isUserAlreadyExist = (await getUser(username)).ok
        if(isUserAlreadyExist){
            res.status(409).send({
                message: "User already exist",
            }); // user already exist
        }else{
            const hashedPassword = await hashPassword(password)
            const user = {
                user_name: username,
                password: hashedPassword,
                createTime: Math.floor(Date.now()/1000),
                followers: [],
                following: []
            }
            await createUser(user)
            res.status(200).send({
                message: "Success",
                data : user
            })
        }
        

    }
    catch(err){
        console.log(err);
        res.status(500).send({
            "error" : err.message
        })
    }
});

auth.post('/login',userAuth);





export default async function userAuth(req, res,next){
    const username = req.body.username;
    const password = req.body.password;
    /*
    user info architecture:
    response: [
            {
                password: 'admin',
                username: 'admin',
                createTime: 1720307103,
                followers: [],
                following: [],
            }
        ]
            
    */
   try{
        const promise = await getUser(username);
        const userInfo = await promise.json();
        console.log(userInfo);
        if(promise.ok){
            if(await comparePassword(password,userInfo.password)){
                const token = generateAccessToken({username: userInfo.user_name, password: userInfo.password});
                res.cookie('token', token, {httpOnly: true});
                res.redirect('home');
            }else{
                throw new Error("404"); 
            }
        }else{
            throw new Error(promise.status);
        }
    }catch(e){
        console.log(e);
        sendError(res,e.message);
    }

}

function sendError(response,statusCode){
    if(statusCode == 404){
        response.redirect('login?error=0');
    }
    else if(statusCode == 401){
        response.redirect('login?error=1');
    }
    else {
        response.redirect('login?error=2');
    }
}

export async function hashPassword(password){
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

async function comparePassword(password,hashedPassword){
    return await bcrypt.compare(password,hashedPassword);
}

