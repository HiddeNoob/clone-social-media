import {generateAccessToken} from "./jwt.js";
import {getUser} from "./public/api/api.js";


export default async function userAuth(req, res,next){
    const username = req.body.username;
    const password = req.body.password;
    const response = await getUser(username, password);
    const httpStatus = response.status;
    const userInfo = await response.json();
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
    if (httpStatus == 200 ) {
        const token = generateAccessToken({username: username, password: password});
        res.redirect('/home?token='+token);

    }else{
        sendError(res,httpStatus);
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