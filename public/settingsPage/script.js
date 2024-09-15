setPersonHref();

document.getElementById('update-password').addEventListener('click', async () => {
    const password1 = document.getElementById('password1').value
    const password2 = document.getElementById('password2').value;
    const infoElement = document.getElementById('process-message');

    try{
        if(password1 != password2){
            throw Error("passwords didn't match");
        }else{
            const status = await fetch('/api/v1/me/changePassword',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        password: password1,
                    })
                }
            ).then((response) => response.status)
            if(status == 200)
            {
                infoElement.classList.remove("text-danger-emphasis")
                infoElement.classList.remove(".text-success-emphasis")
                infoElement.classList.remove("d-none")
                infoElement.classList.add("text-success-emphasis");
                infoElement.innerText = "password changed successfuly"            
            }
            else
            throw new Error("Error: " + status)
    }
}catch(error){
        infoElement.classList.remove("d-none")
        infoElement.classList.remove("text-danger-emphasis")
        infoElement.classList.remove(".text-success-emphasis")
        infoElement.classList.add("text-danger-emphasis")
        infoElement.innerText = error.message;
    }
})

document.getElementById("getFile").addEventListener("change",(event) => {
    let selectedFile = event.target.files[0] // get file from user
    var image = document.createElement("img")
    image.classList.add("w-100")
    image.src = URL.createObjectURL(selectedFile)
    let photoPreview = document.getElementById("photo-preview")
    photoPreview.innerHTML = ""
    photoPreview.appendChild(image)


    var button = document.getElementById('upload-image');
    var result = document.getElementById('result');

    var minCroppedWidth = 50;
    var minCroppedHeight = 50;
    var maxCroppedWidth = 1000;
    var maxCroppedHeight = 1000;

    var croppable = false;
    var cropper = new Cropper(image, {
        viewMode : 2,
        aspectRatio: 1,
        ready: function () {
        croppable = true;
        },
        data: {
        height : (minCroppedHeight + maxCroppedHeight) / 2,
        width : (minCroppedWidth + maxCroppedWidth) / 2
        },
        crop: function (event) {
        var width = Math.round(event.detail.width);
        var height = Math.round(event.detail.height);

        if (
            width < minCroppedWidth
            || height < minCroppedHeight
            || width > maxCroppedWidth
            || height > maxCroppedHeight
        ) {
            cropper.setData({
            width: Math.max(minCroppedWidth, Math.min(maxCroppedWidth, width)),
            height: Math.max(minCroppedHeight, Math.min(maxCroppedHeight, height)),
            });
        }
        },
    });

    button.onclick = function () {
        var croppedCanvas;
        var roundedCanvas;

        if (!croppable) {
        return;
        }

        // Crop
        croppedCanvas = cropper.getCroppedCanvas();

        // Round
        roundedCanvas = getRoundedCanvas(croppedCanvas);

        // uplaod
        url = roundedCanvas.toDataURL("image/png")

        sendImage(url)
    };
})

async function sendImage(image){
    return fetch("/api/v1/image",{
        headers : {
            "Content-Type" : "image/png"
        },
        method : "POST",
        body: url
    })
    .then((response) => response.ok)
    .catch((error) => console.error(error))
}

function getRoundedCanvas(sourceCanvas) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var width = sourceCanvas.width;
    var height = sourceCanvas.height;
  
    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = true;
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.globalCompositeOperation = 'destination-in';
    context.beginPath();
    context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
    context.fill();
    return canvas;
  }