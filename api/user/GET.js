

export async function getall(apiSettings) {
    return await fetch(apiSettings.url + "/user", {
        headers: {
            "x-api-key": apiSettings.key
        }
    });
}

export async function get(apiSettings, username) {
    return await fetch(apiSettings.url + `/user/${username}`, {
        headers: {
            "x-api-key": apiSettings.key,
            }
        }
    );
}