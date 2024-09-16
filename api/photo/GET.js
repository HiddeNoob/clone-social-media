export async function getimg(apiSettings,file_name){
    return await fetch(`${apiSettings.url}/fakex-images/${file_name}`, { 
      headers: {
        "x-api-key" : apiSettings.key
      },
      method: "GET",
    })
    .then(async (data) => await data.blob())
    .catch(error => console.log(error));
};