import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { checkAuthenticate } from "./jwt.js";
import morgan from "morgan";
import userAuth from './userAuth.js';
import cookieParser from "cookie-parser";
import { getAllTweets,getUserTweet, getUserTweets, updateTweet, updateUser} from "./public/api/api.js";



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

app.get('/settings', checkAuthenticate, (req, res) => {
    res.sendFile(__dirname + '/public/settingsPage/index.html');
});



app.get('/api/v1/tweet',checkAuthenticate,async (req, res) => {
    try{
        const tweets = await getAllTweets()

        const message = await tweets.json()
        res.send(message);
    }
    catch(err){
        console.log(err);
        let error = {
            status: 500,
            message: err.message,
            data : null
        }
        res.send(error);
    }

});

app.get('/api/v1/tweet/:user_name/:creation_time',checkAuthenticate,async (req, res) => {
    try{
        const tweets = await getUserTweet(req.params.user_name,req.params.creation_time)

        const message = await tweets.json()
        res.send(message);
    }
    catch(err){
        console.log(err);
        let error = {
            status: 500,
            message: err.message,
            data : null
        }
        res.send(error);
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

        res.send({
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
        res.send(error);
    }
})

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


        res.send({
            status: 200,
            message: "Success",
            data : {
                "likeState": likeState ? "liked" : "unliked",
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
        res.send(error);
    }
});



app.get('/api/v1/tweet/:user_name',checkAuthenticate,async (req, res) => {

    try{
        const tweets = await getUserTweets(req.params.user_name)
        const message = await tweets.json()
        res.send(message);

    }
    catch(err){
        console.log(err);
        let error = {
            status: 500,
            message: err.message,
            data : null
        }
        res.send(error);
    }

});



app.use((req, res) => {
    res.status(404).sendFile(__dirname + '/public/notFoundPage/index.html');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


