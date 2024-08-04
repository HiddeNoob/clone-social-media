function setPersonHref(){
    document.getElementById('my-profile').href = '/profile/' + localStorage.getItem('username');
}