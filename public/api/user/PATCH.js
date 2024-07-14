export async function update(apiSettings, user_name, update_key, update_value) {
  return await fetch(apiSettings.url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiSettings.token
    },
    body: JSON.stringify({
        "user_name" : user_name,
        "updateKey" : update_key,
        "updateValue" : update_value
    })
  });
}
