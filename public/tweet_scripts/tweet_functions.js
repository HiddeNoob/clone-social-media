async function createFunctionalTweetElements(tweets){
        const username = await localStorage.getItem('username');
        let elements = []
        tweets.forEach((tweet) => {
            const tweetElement = createTweetElement(tweet,username);
            const heartButton = tweetElement.querySelector('.heart-button');
            const switchLikeState = (heartButton) => {
                let isLiked = heartButton.src.includes('heart-filled.svg') ? true : false;
                heartButton.src = isLiked ? './resources/svg/heart-empty.svg' : './resources/svg/heart-filled.svg';
                return !isLiked;
            }
            const changeLikeCount = (heartButton, count) => {
                heartButton.nextSibling.textContent = count;
            };
            heartButton.addEventListener('click', () => {
                const currentLikeState = switchLikeState(heartButton); // first like the tweet
                changeLikeCount(heartButton, currentLikeState ? +heartButton.nextSibling.textContent + 1 : +heartButton.nextSibling.textContent - 1 ); // change the like count according to the like state
                
                likeTweet(tweet) // then send post request to like the tweet
                .then((response) => {
                    if(!response.ok)
                        throw Error(response.status + ": " + response.message);
                })
                .catch((error) => {
                    console.error(error);
                    switchLikeState(heartButton); // error occured, revert the like state
                });
            });
            tweetElement.querySelector('.comment-button').addEventListener('click', () => showComments(tweet));

            elements.push(tweetElement);
        });

        return elements;
}



function showComments(tweet){
    const comments = tweet.comments;
    const body = document.getElementById('popup-body');
    body.innerHTML = '';
    comments.forEach((comment) => {
        body.appendChild(createCommentElement(comment));     
    });
}

function createCommentElement(comment){
    const commentElement = document.createElement('div');
    commentElement.className = 'bg-dark-subtle border border-secondary p-2 rounded mb-3' ;
    const tweetDate = new Date(comment.createTime * 1000);
    commentElement.innerHTML = `

                                <div class="">
                                    <h6>${comment.user_name}</h2>
                                </div>
                                <div>
                                    ${comment.comment}
                                </div>
                                <div class="d-flex ">                                
                                    <div class="ms-auto">
                                        ${tweetDate.getHours()}:${tweetDate.getMinutes()} ${tweetDate.toLocaleDateString()} 
                                    </div>

                                </div>

                                `
    return commentElement;
}

function createTweetElement(tweet,loggedInUser){
    const tweetElement = document.createElement('div');
    tweetElement.className = 'bg-dark-subtle border border-secondary p-2 rounded mb-3' ;
    const tweetDate = new Date(tweet.createTime * 1000);
    const tweetLikeState = tweet.liked_users.includes(loggedInUser);
    tweetElement.innerHTML = `  
    <p > <a href="/profile/${tweet.user_name}" >${tweet.user_name}</a> </h3>
    <p class = "my-4"> ${tweet.tweet}</p>

    <div class="d-flex flex-row align-items-center">
        <div class="d-flex flex-row me-2">
            <img src="./resources/svg/${tweetLikeState ? "heart-filled.svg" : "heart-empty.svg"}" alt="heart" class="heart-button clickable me-1" width="20" >
            ${tweet.liked_users.length}
        </div>
        <div class="d-flex flex-row me-2">
            <img src="./resources/svg/comment.svg" width="20" alt="comment" class="comment-button clickable me-1" data-bs-toggle="modal" data-bs-target="#commentPopUp">
            ${tweet.comments.length}
        </div>

        <div class="align-items-end" style="margin-left: auto;" >
            ${tweetDate.getHours()}:${tweetDate.getMinutes()} ${tweetDate.toLocaleDateString()} 
        </div>
    </div>                                     
    `;
    return tweetElement;
}


async function likeTweet(tweet){
    return await fetch(`/api/v1/tweet/${tweet.user_name}/${tweet.createTime}/like`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    });

}



function showLoadingGif(object_id){
    const loadingGif = document.createElement('img');
    loadingGif.height = 25;
    loadingGif.src = '/resources/gif/loadingGif.gif';
    loadingGif.classList.add('loading');
    findTweetElements(object_id).appendChild(loadingGif)
}

function findTweetElements(object_id){
    return document.getElementById(object_id)
}

function hideLoadingGif(){
    const loadingGif = document.querySelector('.loading');
    loadingGif.remove();
}

function sortTweets(tweets, sortBy,sortType){
    return tweets.sort((a,b) => {
            return (sortType == "descent") ? ( b[sortBy] - a[sortBy] ) : ( a[sortBy] - b[sortBy] );
    });
}