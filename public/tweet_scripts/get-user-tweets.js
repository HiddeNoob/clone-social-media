



async function loadUserTweets(object_id,username){
    const tweetElements = findTweetElements(object_id);
    showLoadingGif(object_id);
    fetch(`/api/v1/tweet/${username}`).then((response) => { // get users tweets from local api
        if (response.ok) 
            return response.json();
        else
            throw Error(response.status + ": " + response.message);
    }).then(
        async (response) => {
            if(response.Items.length == 0){

                const noTweetElement = document.createElement('div');
                noTweetElement.className = 'text-center fst-italic p-4 text-secondary';
                noTweetElement.innerHTML = 'Couldn\'t find any tweet';
                tweetElements.append(noTweetElement);
            }else{
                createFunctionalTweetElements(response.Items).then((elements) => {
                    elements.forEach((element) => {
                        tweetElements.append(element);
                    });
                });
            }
        }
    ).catch((error) => {
        const errorElement = document.createElement('div');
        errorElement.className = 'error';
        errorElement.innerHTML = 'Bir hata oluştu: ' + error.message;
        tweetElements.append(errorElement);
        console.error(error);
    }).finally(() => {
        hideLoadingGif();
    });
}
