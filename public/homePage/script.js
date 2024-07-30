

document.addEventListener('DOMContentLoaded', async () => {
    await setUserToLocalStorage();
    setPersonHref();

    document.getElementById('tweet-button').addEventListener('click', postTweet);

    loadAllTweets("tweets",{sortBy: 'createTime', sortType: 'descent'});
    
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

function postTweet(){
    const tweetText = document.getElementById('tweet-text').value;
    if(tweetText.length > 0){
        fetch('/api/v1/tweet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({tweet: tweetText})
        }).then((response) => {
            if (response.ok){
                document.getElementById('tweet-text').value = '';
                loadAllTweets("tweets",{sortBy: 'createTime', sortType: 'descent'});
            }
            else
                throw Error(response.status + ": " + response.message);
        }).catch((error) => {
            console.error(error);
        });
    }else{
        document.getElementById('share-error').innerHTML = 'please fill the field';
    }
}   