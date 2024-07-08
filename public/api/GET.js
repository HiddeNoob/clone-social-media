import { response } from "express";

export async function getall(apiSettings) {
    return await fetch(apiSettings.url + "/user", {
        headers: {
            "x-api-key": apiSettings.key
        }
    }).then((response) => {
        if (response.ok) {
            return response.json();
        }
        else {
            throw new Error('bilinmeyen bir hata oluştu');
        }
    }).catch((error) => {
        console.error(error);
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