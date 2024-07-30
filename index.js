import express, { response } from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { checkAuthenticate } from "./jwt.js";
import morgan from "morgan";
import userAuth from './userAuth.js';
import cookieParser from "cookie-parser";
import { getAllTweets,getUserTweet, getUserTweets, updateTweet, updateUser,createUser, getUser, createTweet} from "./api/api.js";
import { hashPassword } from "./userAuth.js";
import e from "express";



const app = express();
const PORT = 80;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.post('/login',userAuth);

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/loginPage/index.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/registerPage/index.html');
});

app.get('/home', checkAuthenticate, (req, res) => {
    
    res.sendFile(__dirname + '/public/homePage/index.html');
});

app.get('/profile/:username', checkAuthenticate, (req, res) => {
    getUser(req.params.username).then((data) => {
        if(data.ok){
            res.sendFile(__dirname + '/public/profilePage/');
        }
        else{
            res.status(404).sendFile(__dirname + '/public/notFoundPage/index.html');
        }
    })
});

app.get('/settings', checkAuthenticate, (req, res) => {
    res.sendFile(__dirname + '/public/settingsPage/index.html');
});



app.get('/api/v1/tweet',checkAuthenticate,async (req, res) => {
    try{
        const tweets = await getAllTweets()

        const message = await tweets.json()
        res.status(200).send(message);
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

app.get('/api/v1/tweet/:user_name/:creation_time',checkAuthenticate,async (req, res) => {
    try{
        const tweets = await getUserTweet(req.params.user_name,req.params.creation_time)

        const message = await tweets.json()
        res.status(200).send(message);
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

app.post('/api/v1/tweet/:user_name/:creation_time/comment',checkAuthenticate,async (req, res) => {
    try{
        const response = await getUserTweet(req.params.user_name,req.params.creation_time)
        const selectedTweet = await response.json().then(data => data.Item)
        let comments = selectedTweet.comments
        const gonnaComment = req.body.comment
        comments.push({
            "user_name": req.user.username,
            "comment": gonnaComment,
            "createTime": Math.floor(Date.now()/1000),
            "liked_users" : []
        })

        const message = await updateTweet(selectedTweet.user_name,selectedTweet.createTime,"comments",comments)
        const updateResponse = await message.json()

        res.status(200).send({
            status: message.status,
            message: message.statusText,
            data : {
                "UpdatedAttributes": updateResponse.UpdatedAttributes.Attributes
            }
        });
    }
    catch(err){
        console.log(err);
        let error = {
            status: 500,
            message: err.message,
            data : null
        }
        res.status(500).send(error);
    }
})

app.get('/api/v1/user/:user_name',checkAuthenticate,async (req, res) => {
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

app.get('/api/v1/me',checkAuthenticate,async (req, res) => {
    
    res.send(req.user);

});


app.post('/api/v1/tweet/:user_name/:creation_time/like',checkAuthenticate,async (req, res) => {
    try{
        const response = await getUserTweet(req.params.user_name,req.params.creation_time)
        const selectedTweet = await response.json().then(data => data.Item)
        let likedUsers = selectedTweet.liked_users
        const gonnaLikeUser = req.user.username
        var likeState = null
        if(likedUsers.includes(gonnaLikeUser)){ // unliking
            let index = likedUsers.indexOf(gonnaLikeUser)
            likedUsers.splice(index,1)
            likeState = false
        }else{ // liking
            likedUsers.push(gonnaLikeUser)
            likeState = true
        }

        const message = await updateTweet(selectedTweet.user_name,selectedTweet.createTime,"liked_users",likedUsers)
        const updateResponse = await message.json()


        res.status(200).send({
            message: "Success",
            data : {
                "likeState": likeState ? "liked" : "unliked",
                "UpdatedAttributes": updateResponse.UpdatedAttributes.Attributes
            }
        });
    }
    catch(err){
        console.log(err);

        res.status(500).send({
            message: err.message,
            data : null
        });
    }
});

app.post('/register', bodyParser.json(),async (req, res) => {
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
                tweets_id: []
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

app.get('/api/v1/tweet/:user_name',checkAuthenticate,async (req, res) => {

    try{
        const tweets = await getUserTweets(req.params.user_name)
        const message = await tweets.json()
        res.status(200).send({
            "Operation": "GET",
            "Message": "SUCCESS",
            "Items": message
        })

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

app.post('/api/v1/tweet',checkAuthenticate,bodyParser.json(),async (req, res) => {
    try{
        const tweet = req.body.tweet
        const createdTime = Math.floor(Date.now()/1000)
        const newTweet = {
            "tweet": tweet,
            "liked_users": [],
            "comments": []
        }
        let currentUserInfo = await getUser(req.user.username).then((response) => response.json())
        currentUserInfo.tweets_id.push(createdTime) 
        if(updateUser(req.user.username,"tweets_id",currentUserInfo.tweets_id).then((response) => response.status == 200)){
            console.log("user update success")
            if(createTweet(req.user.username,createdTime,newTweet).then((response) => response.status == 200))
                console.log("tweet create success")
            else
                throw new Error("tweet create failed")
        }
        else{
            throw new Error("user update failed")
        }
        res.status(200).send({
            message: "Success",
            data : {
                "user_name": req.user.username,
                "createTime": createdTime,
                "tweet": newTweet.tweet,
                "liked_users": newTweet.liked_users,
                "comments": newTweet.comments
            }
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
})



app.use((req, res) => {
    res.status(404).sendFile(__dirname + '/public/notFoundPage/index.html');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

/* 

*/

