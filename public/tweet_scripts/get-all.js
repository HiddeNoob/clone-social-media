async function loadAllTweets(object_id,sortType){
    const tweetElements = findTweetElements(object_id);
    showLoadingGif(object_id);
    fetch(`/api/v1/tweet`).then((response) => { // get users tweets from local api
        if (response.ok) 
            return response.json();
        else
            throw Error(response.status + ": " + response.message);
    }).then((response) => {
        return sortTweets(response.Items, sortType.sortBy,sortType.sortType);
    }).then(async (tweets) => {
        
        createFunctionalTweetElements(tweets).then((elements) => {
            tweetElements.innerHTML
            elements.forEach((element) => {
                tweetElements.append(element);
            });
        });
    
    }).catch((error) => {
        const errorElement = document.createElement('div');
        errorElement.className = 'error';
        errorElement.innerHTML = 'Bir hata oluştu: ' + error.message;
        tweetElements.append(errorElement);
        console.error(error);
    }).finally(() => {
        hideLoadingGif();
    });
}

