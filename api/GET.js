async function getAllUsers(apiSettings) {
    const response = await fetch(url, {
        headers: {
            "x-api-key": key
        }
    });
    const data = response.json();
    return data;
}

async function getUser(apiSettings, username, password) {
    const response = await fetch(apiSettings.url + `/?username=${username}&password=${password}`, {
        headers: {
            "x-api-key": apiSettings.key,
            }
        }
    );
}  