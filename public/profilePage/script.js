const searchingUser = window.location.pathname.slice(9); // get the username from the url

document.addEventListener('DOMContentLoaded', async () => {
    await setUserToLocalStorage();
    setPersonHref();
    setProfileInfo();
    loadUserTweets("tweets",searchingUser);
});

async function setUserToLocalStorage(){
    await fetch('/api/v1/me').then((response) => {
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


function setPersonHref(){
    document.getElementById('my-profile').href = '/profile/' + localStorage.getItem('username');
}

async function setProfileInfo(){
    fetch(`/api/v1/user/${searchingUser}`).then((response) => {
        if (response.ok)
            return response.json();
        else
            throw Error(response.status + ": " + response.message);
    }).then((data) => {
        data = data.data;
        tweetDate = new Date(data.createTime * 1000);
        document.getElementById('user-name').innerHTML = data.user_name;
        document.getElementById('tweet-count').innerHTML = data.tweets_id.length;
        document.getElementById('follower-count').innerHTML = data.followers.length;
        document.getElementById('following-count').innerHTML = data.following.length;
        document.getElementById('joined-date').innerHTML =  `${tweetDate.getHours()}:${tweetDate.getMinutes()} ${tweetDate.toLocaleDateString()} `
        ;
    }).catch((error) => {
        console.error(error);
    });
}