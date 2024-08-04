import jwt from "jsonwebtoken";
import { dirname } from "path";
import { fileURLToPath } from "url";
import * as dotenv from 'dotenv'
dotenv.config()

const __dirname = dirname(fileURLToPath(import.meta.url));

const token_secret = process.env.JWT_SECRET;


export function generateAccessToken(userInfo) {
  return jwt.sign(userInfo, token_secret, { expiresIn: "100000s"  });
}

export function checkAuthenticate(req, res, next) {
  const token = req.cookies.token;
  var user = token && getUserFromToken(token);
  if(!user) return res.sendFile(__dirname + '/public/forbiddenPage/index.html');
  req.user = user;
  next();
}

function getUserFromToken(token){
  return jwt.verify(token, token_secret, (err, user) => {
    if (err) return null;
    return user;
  });
}