async function loadAllTweets(sortType,loggedUser){
    return fetch(`/api/v1/tweet`).then((response) => { // get users tweets from local api
        if (response.ok) 
            return response.json();
        else
            throw Error(response.status + ": " + response.message);
    }).then((response) => {
        if(response.Items.length == 0){
            throw Error("Couldn't find any tweet");
        }else{
            return sortItem(response.Items, sortType.sortBy,sortType.sortType);
        }
    }).then(async (tweets) => {
        let tweetElements = [];
        tweets.forEach((tweet) => {
            tweetElements.push(createFunctionalTweetElement(tweet,loggedUser))
        });
        return tweetElements
    }).catch((error) => {
        console.error(error);
        const noTweetElement = document.createElement('div');
        noTweetElement.className = 'text-center fst-italic p-4 text-secondary';
        noTweetElement.innerHTML = error.message;
        return [noTweetElement];
    });
}

