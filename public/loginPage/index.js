if ('URLSearchParams' in window) {
    var searchParams = new URLSearchParams(window.location.search);
    const error = searchParams.get('error');
    if (error == 0) {
        document.getElementById('error-message').innerText = "username and password didn't match";
    }
    else if (error == 1) {
        document.getElementById('error-message').innerText = "too many requests";
    }
    else if (error == 2){
        document.getElementById('error-message').innerText = "unkown error";
    }
}