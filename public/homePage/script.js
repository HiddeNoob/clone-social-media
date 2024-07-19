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
        tweetElements.appendChild(tweetElement);
    });
}).catch((error) => {
    const errorElement = document.createElement('div');
    errorElement.className = 'error';
    errorElement.innerHTML = 'Bir hata oluştu: ' + error.message;
    tweetElements.append(errorElement);
}).finally(() => {
    loadingGif.remove();
});


function openComments(){

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
            <img src="./resources/svg/heart.svg" alt="heart" class="heart clickable">
            ${tweet.liked_users.length}
    </div>
        <div class="comment flex gap-5px">
            <img src="./resources/svg/comment.svg" alt="comment" class="comment clickable" data-mdb-ripple-init data-mdb-modal-init data-mdb-target="#exampleModal">
            ${tweet.comments.length}
        </div>

        <div class="date white3" >
            ${tweetDate.getHours()}:${tweetDate.getMinutes()} ${tweetDate.toLocaleDateString()} 
        </div>                                        
    `;
    return tweetElement;
}

function likeTweet(tweet){
    fetch("/api/v1/tweet/like")
}


