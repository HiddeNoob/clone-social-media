/**
 * @description This file contains the API routes for handling tweets in the Twitter application.
 */

import express from "express";
import bodyParser from "body-parser";
import { checkAuthenticate } from "../../../jwt.js";
import { getAllTweets, getUserTweet, getUser, updateUser, createTweet, updateTweet, getUserTweets,deleteTweet } from "../../../api/api.js";

export const tweet = express.Router();

/**
 * Get all tweets.
 *
 * @route GET /tweet
 * @middleware checkAuthenticate - Middleware to check user authentication.
 * @returns {Promise} - A promise that resolves to the response object.
 */
tweet.get('/tweet',checkAuthenticate,async (req, res) => {
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

/**
 * Get a specific tweet by user name and creation time.
 *
 * @route GET /tweet/:user_name/:creation_time
 * @middleware checkAuthenticate - Middleware to check user authentication.
 * @param {string} user_name - The user name.
 * @param {string} creation_time - The creation time of the tweet.
 * @returns {Promise} - A promise that resolves to the response object.
 */

tweet.get('/tweet/:user_name/:creation_time',checkAuthenticate,async (req, res) => {
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





/**
 * Save a tweet to DynamoDB.
 *
 * @route POST /tweet
 * @middleware checkAuthenticate - Middleware to check user authentication.
 * @middleware bodyParser.json() - Middleware to parse JSON request body.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.tweet - The content of the tweet.
 * @returns {Promise} - A promise that resolves to the response object.
 */
 
tweet.post('/tweet',checkAuthenticate,bodyParser.json(),async (req, res) => {
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

/**
 * Like or unlike a tweet.
 *
 * @route POST /tweet/:user_name/:creation_time/like
 * @middleware checkAuthenticate - Middleware to check user authentication.
 * @param {string} user_name - The user name.
 * @param {string} creation_time - The creation time of the tweet.
 * @returns {Promise} - A promise that resolves to the response object.
 */
tweet.post('/tweet/:user_name/:creation_time/like',checkAuthenticate,async (req, res) => {
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

tweet.delete('/tweet/:user_name/:creation_time',checkAuthenticate,async (req, res) => {
    try{
        if(req.user.username != req.params.user_name){
            throw new Error("You are not authorized to delete this tweet")
        }
        const message = await deleteTweet(req.params.user_name,req.params.creation_time)
        res.status(200).send({
            message: message.statusText,
            data : null
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

tweet.get('/tweet/:user_name',checkAuthenticate,async (req, res) => {

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


/**
 * Add a comment to a tweet.
 *
 * @route POST /tweet/:user_name/:creation_time/comment
 * @middleware bodyParser.json() - Middleware to parse JSON request body.
 * @middleware checkAuthenticate - Middleware to check user authentication.
 * @param {string} user_name - The user name.
 * @param {string} creation_time - The creation time of the tweet.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.comment - The comment to add.
 * @returns {Promise} - A promise that resolves to the response object.
 */
tweet.post('/tweet/:user_name/:creation_time/comment',bodyParser.json(),checkAuthenticate,async (req, res) => {
    try{
        const response = await getUserTweet(req.params.user_name,req.params.creation_time)
        const selectedTweet = await response.json().then(data => data.Item)
        let comments = selectedTweet.comments
        const gonnaComment = req.body.comment
        comments.push({
            "user_name": req.user.username,
            "comment": gonnaComment,
            "createTime": Math.floor(Date.now()/1000),
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