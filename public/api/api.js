import {getall,get} from './GET.js';
import apiSettings from './apiSettings.json' with {type: "json"};

export function getAllUsers() {
   return getall(apiSettings);
};

export function getUser(username, password) {
    return get(apiSettings, username, password);
}