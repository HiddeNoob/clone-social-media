export async function uploadimg(apiSettings,photo_data,file_name,data_type){
    return await fetch(`${apiSettings.url}/fakex-images/${file_name}.${data_type}`, {
      headers: {
        "x-api-key" : apiSettings.key,
        "Content-Type" : `image/${data_type}`
      },
      method: "PUT",
      body: photo_data
    }).then(
      response => response.ok
    ).catch(
      error => console.log(error)
    );
};