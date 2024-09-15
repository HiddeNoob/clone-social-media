export async function getimg(apiSettings,file_name){
    return await fetch(`${apiSettings.url}/fakex-images/${file_name}`, { 
      headers: {
        "x-api-key" : apiSettings.key
      },
      method: "GET",
      responseType: 'blob'
    }).then(async (data) => await data.blob()).then((response) => {
      console.log(response)
      const image = document.createElement('img') 
      image.src = URL.createObjectURL(response)
      return image
    }
    ).catch(
      error => console.log(error) 
    );
};