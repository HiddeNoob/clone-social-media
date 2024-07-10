import {generateAccessToken} from "./jwt.js";
import {getUser} from "./public/api/api.js";
import cookieParser from "cookie-parser";


export default async function userAuth(req, res,next){
    const username = req.body.username;
    const password = req.body.password;
    /*
    user info architecture:
    response: [
        {
            isOnline: false,
            password: 'admin',
            username: 'admin',
            createTimestamp: 1720307103,
            tweets: [Array]
            }
            ]
            
    */
   try{
    const promise = await getUser(username, password);
    const userInfo = await promise.json();
    const httpStatus = promise.status;
    if(promise.ok){
        const token = generateAccessToken({username: username, password: password});
        res.cookie('token', token, {httpOnly: true});
        res.redirect('home');
    }else{
        sendError(res,httpStatus)
    }
    }catch(e){
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