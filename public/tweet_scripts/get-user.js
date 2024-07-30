async function getUser(){
    fetch('/api/v1/user').then((response) => {
        if (response.ok)
            return response.json();
        else
            throw Error(response.status + ": " + response.message);
    }).then((data) => {
        localStorage.setItem('username', data.username);
    }).catch((error) => {
        console.error(error);
    });
}