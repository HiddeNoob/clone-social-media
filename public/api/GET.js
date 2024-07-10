import { response } from "express";

export async function getall(apiSettings) {
    return await fetch(apiSettings.url + "/user", {
        headers: {
            "x-api-key": apiSettings.key
        }
    });
}

export async function get(apiSettings, username, password) {
    return await fetch(apiSettings.url + `user?username=${username}&password=${password}`, {
        headers: {
            "x-api-key": apiSettings.key,
            }
        }
    );
}