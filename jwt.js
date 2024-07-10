import jwt from "jsonwebtoken";
import { dirname } from "path";
import { fileURLToPath } from "url";


const __dirname = dirname(fileURLToPath(import.meta.url));

const token_secret =
  "457a19fb4cb2e03b1138db036f4aac9cf4701f62fac1fd9fd2bb74e0280bd302";

export function generateAccessToken(userInfo) {
  return jwt.sign(userInfo, token_secret, { expiresIn: "100s" });
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