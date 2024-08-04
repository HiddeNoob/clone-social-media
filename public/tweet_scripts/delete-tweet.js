async function deleteTweet(tweet){
    return await fetch(`/api/v1/tweet/${tweet.user_name}/${tweet.createTime}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        }
    });
}