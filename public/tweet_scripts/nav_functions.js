function setPersonHref(){
    document.getElementById('my-profile').href = '/profile/' + localStorage.getItem('username');
}

async function logout(){
    localStorage.removeItem('username');
    await fetch('/logout').then((response) => {
        if (!response.ok)
            throw Error(response.status + ": " + response.message);
        else
            window.location.href = '/login';
    }).catch((error) => {
        console.error(error);
    });
}