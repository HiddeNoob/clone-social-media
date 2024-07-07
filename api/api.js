import apiSettings from './apiSettings.json';
import {getAllUsers,getUser} from './GET.js';

export default function dynomoDB(){
    const url = apiSettings.url + "/user";
    const key = apiSettings.key;

   return {
    "getUser" : async (username,password) => getUser({url, key}, username, password),
    "getAllUsers" : async (getAllUsers({url, key}))
   }
}