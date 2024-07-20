let tweetElements = document.getElementById('tweets')
const loadingGif = document.createElement('img');
loadingGif.src = '/resources/gif/loadingGif.gif';
loadingGif.classList.add('loading');
tweetElements.appendChild(loadingGif)

fetch('/api/v1/tweet').then((response) => {
    if (response.ok) 
        return response.json();

    else
        throw Error(response.status + ": " + response.message);
}).then((response) => {

    console.log(response);
    const tweets = response.Items;
    tweets.forEach((tweet) => {
        const tweetElement = createTweetElement(tweet);
        tweetElements.append(tweetElement);
        tweetElement.querySelector('.heart-button').addEventListener('click', () => likeTweet(tweet));
        tweetElement.querySelector('.comment-button').addEventListener('click', () => showComments(tweet));
    });

}).catch((error) => {
    const errorElement = document.createElement('div');
    errorElement.className = 'error';
    errorElement.innerHTML = 'Bir hata oluştu: ' + error.message;
    tweetElements.append(errorElement);
}).finally(() => {
    loadingGif.remove();
});


function showComments(tweet){
    console.log("showing comments");
    const comments = tweet.comments;
    const body = document.getElementById('popup-body');
    body.innerHTML = '';
    comments.forEach((comment) => {
        body.appendChild(createCommentElement(comment));     
    });
}

function createCommentElement(comment){
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    const tweetDate = new Date(comment.createTime * 1000);
    commentElement.innerHTML = `

                                <div class="comment-header bold white1">
                                    <h6>${comment.user_name}</h2>
                                </div>
                                <div class="comment-body">
                                    <p>${comment.comment}</p>
                                </div>
                                <div class="comment-footer">
                                    
                                    <div class="flex gap-5px margin-right-5px">
                                        <img src="./resources/svg/heart.svg" alt="heart" class="heart-button clickable">
                                        ${comment.like}
                                    </div>
                                
                                    <div class="date white">
                                        ${tweetDate.getHours()}:${tweetDate.getMinutes()} ${tweetDate.toLocaleDateString()} 
                                    </div>

                                </div>

                                `
    return commentElement;
}

function createTweetElement(tweet){
    const tweetElement = document.createElement('div');
    tweetElement.className = 'tweet';
    const tweetDate = new Date(tweet.createTime * 1000);
    tweetElement.innerHTML = `  
    <p class="username "> <a href="/profile/${tweet.user_name}" class="profile-link bold white1">${tweet.user_name}</a> </h3>
    <p class="message"> ${tweet.tweet}</p>

    <div class="horizontal flex gap-5px ">
        <div class="flex gap-5px margin-right-5px">
            <img src="./resources/svg/heart.svg" alt="heart" class="heart-button clickable">
            ${tweet.liked_users.length}
        </div>
        <div class="flex gap-5px">
            <img src="./resources/svg/comment.svg" alt="comment" class="comment-button clickable" data-bs-toggle="modal" data-bs-target="#commentPopUp">
            ${tweet.comments.length}
        </div>

        <div class="date white3" >
            ${tweetDate.getHours()}:${tweetDate.getMinutes()} ${tweetDate.toLocaleDateString()} 
        </div>                                        
    `;
    return tweetElement;
}

function likeTweet(tweet){
    console.log("liking tweet");

}


