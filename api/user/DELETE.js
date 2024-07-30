

export async function delete_user(apiSettings, username) {
    return await fetch(apiSettings.url + "/user ", {
        method: "DELETE",
        headers: {
            "x-api-key": apiSettings.key
        },
        body: JSON.stringify({
            "user_name": username
        })

    });
}