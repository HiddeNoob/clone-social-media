function register(){
    let password = document.getElementById('password-1').value;
    let confirmPassword = document.getElementById('password-2').value;
    let username = document.getElementById('username').value;
    const errorElement = document.getElementById('error-message');
    if(password == '' || confirmPassword == '' || username == ''){
        errorElement.innerText = 'Please fill in all fields';
    } else if(password != confirmPassword){
        errorElement.innerText = "Passwords didn't match";
    } else {
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        }).then((response) => {
            if(response.ok){

                errorElement.classList.remove("text-danger");
                errorElement.classList.add(["text-success"]);
                errorElement.innerText = 'Successfully registered';
            } else if(response.status == 409) {
                errorElement.classList.remove("text-success");
                errorElement.classList.add(["text-danger"]);
                errorElement.innerText = 'Username already exists';
            }
            else{
                errorElement.classList.add(["text-danger"]);
                errorElement.innerText = 'error while registering';
            }
    
    });
    }

}