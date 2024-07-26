import { json } from "express";

export async function updatetweet(apiSettings,user_name,creation_time,update_key,update_value){
    
    return await fetch(apiSettings.url + "/tweet/" + user_name + "/" + creation_time, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiSettings.key
        },
        body: JSON.stringify({
            "update_key": update_key,
            "update_value": update_value
        })
    })
}