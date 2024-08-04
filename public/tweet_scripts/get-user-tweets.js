



async function loadUserTweets(object_id,searchingUser,loggedInUser){
    const tweetElements = findElement(object_id);
    await fetch(`/api/v1/tweet/${searchingUser}`).then((response) => { // get users tweets from local api
        if (response.ok) 
            return response.json();
        else
            throw Error(response.status + ": " + response.message);
    }).then(async (response) => {
        if(response.Items.length == 0){
            throw Error('Couldn\'t find any tweet');
        }else{
            sortItem(response.Items, 'createTime','descendant');
            response.Items.forEach((tweet) => {
                tweetElements.append(createFunctionalTweetElement(tweet,loggedInUser));
            });
        }
    })
}
