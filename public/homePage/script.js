

setUserToLocalStorage();
setPersonHref();
reloadTweets()



document.getElementById('tweet-button').addEventListener('click',async () => {
    if(document.getElementById('tweet-text').value.length == 0){
        document.getElementById("share-error").innerText = "you can't share an empty tweet";
        return;
    }else if(document.getElementById('tweet-text').value.length > 140){
        document.getElementById("share-error").innerText = "tweet can't be longer than 140 characters";
        return;
    }
    else{
        showLoadingGif("tweets");
        await postTweet(document.getElementById('tweet-text').value).then((response) => {
            if (!response.ok)
                throw Error(response.status + ": " + response.message);
            else{
                return response.json();
            }
        }).then((response) => {
            document.getElementById("tweets").prepend(createFunctionalTweetElement(response.data));
        }).catch((error) => {
            console.error(error);
            document.getElementById("share-error").innerText = "could't share the tweet"
        }).finally(() => {
            hideLoadingGif();
            document.getElementById('tweet-text').value = '';
        });
    }
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




async function postTweet(tweetText){
    return fetch('/api/v1/tweet', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({tweet: tweetText})
    })
}

async function reloadTweets(){
    const tweetContainer = document.getElementById('tweets');
    tweetContainer.innerHTML = '';
    showLoadingGif("tweets");
    const tweetElements = await loadAllTweets({sortBy: 'createTime', sortType: 'descendant'},localStorage.getItem('username'));
    hideLoadingGif();
    tweetElements.forEach((element) => {
        tweetContainer.appendChild(element);
    });
}