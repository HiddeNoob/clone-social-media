import {generateAccessToken} from "./jwt.js";
import {getUser} from "./public/api/api.js";
import bcrypt from 'bcrypt';



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
                tweets_id: [Array]
            }
        ]
            
    */
   try{
        const promise = await getUser(username);
        const userInfo = await promise.json();
        if(promise.ok){
            if(await comparePassword(password,userInfo.password)){
                const token = generateAccessToken({username: username, password: password});
                res.cookie('token', token, {httpOnly: true});
                res.redirect('home');
            }else{
                sendError(res,404);
            }
        }else{
            sendError(res,promise.status);
        }
    }catch(e){
        console.log(e);
        sendError(res,null);
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

async function hashPassword(password){
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

async function comparePassword(password,hashedPassword){
    return await bcrypt.compare(password,hashedPassword);
}