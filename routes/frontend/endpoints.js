import express from "express";
import { checkAuthenticate } from "../../jwt.js";
import { getUser} from "../../api/api.js";
import {__dirname} from "../../index.js";

export const endpoints = express.Router();

endpoints.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/loginPage/index.html');
});

endpoints.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/registerPage/index.html');
});

endpoints.get('/home', checkAuthenticate, (req, res) => {
    
    res.sendFile(__dirname + '/public/homePage/index.html');
});

endpoints.get('/settings', checkAuthenticate, (req, res) => {
    res.sendFile(__dirname + '/public/settingsPage/index.html');
});

endpoints.get('/profile/:username', checkAuthenticate, (req, res) => {
    getUser(req.params.username).then((data) => {
        if(data.ok){
            if(req.params.username == req.user.username){
                res.sendFile(__dirname + '/public/myPage/index.html');
            }
            else{
                res.sendFile(__dirname + '/public/profilePage/index.html');
            }
        }
        else{
            res.status(404).sendFile(__dirname + '/public/notFoundPage/index.html');
        }
    })
});