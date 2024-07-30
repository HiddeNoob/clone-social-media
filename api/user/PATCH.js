export async function updateuser(apiSettings, user_name, update_key, update_value) {
  return await fetch(apiSettings.url + "/user" , {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiSettings.key
    },
    body: JSON.stringify({
        "user_name" : user_name,
        "update_key" : update_key,
        "update_value" : update_value
    })
  });
}
