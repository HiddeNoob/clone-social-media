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