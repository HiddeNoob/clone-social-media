function createFunctionalTweetElement(tweet,loggedUser){
        const tweetElement = createTweetElement(tweet,loggedUser);
        const heartButton = tweetElement.querySelector('.heart-button');
        const switchLikeState = (heartButton) => {
            let isLiked = heartButton.src.includes('heart-filled.svg') ? true : false;
            heartButton.src = isLiked ? './resources/svg/heart-empty.svg' : './resources/svg/heart-filled.svg'; // fill the heart if it is not liked, empty it if it is liked
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
        tweetElement.querySelector('.show-comment-button').addEventListener('click', () => showComments(tweet));
        return tweetElement;
}

function showComments(tweet){
    const comments = tweet.comments;
    const body = document.getElementById('popup-body');
    document.getElementById('popup-title').innerText = "Comments";
    const commentElements = document.createElement('div');
    commentElements.id = "comment-elements";
    body.innerHTML = '';
    const postCommentElement = document.createElement('div');
    postCommentElement.id = "commentPopUp";
    postCommentElement.className = "border border-secondary rounded p-2 mb-3";
    postCommentElement.innerHTML = `
                                    <h5>Share Comment</h5>
                                    <textarea name="text" id="comment-text" class="is-invalid border p-3 rounded border-0 bg-body-tertiary text-area w-100" required ></textarea>
                                    <p class="invalid-feedback" id="share-comment-error"></p>
                                    <button class="btn btn-primary mt-2 bg-body-secondary border-secondary" id="comment-button" >Share</button>
                                `;
    body.append(postCommentElement);

    // add event listener to the share button
    document.getElementById('comment-button').addEventListener('click', () => {
        const textField = document.getElementById('comment-text')
        const comment = textField.value;
        textField.value = '';

        
        if(comment.length == 0){
            document.getElementById('share-comment-error').innerText = "fill the comment";
            return;
        }
        else if(comment.length > 140){
            document.getElementById('share-comment-error').innerText = "comment can't be longer than 140 characters";
            return;
        }
        else{
            showLoadingGif('comment-elements');
            postComment(tweet.user_name,tweet.createTime,comment)
            .then((response) => {
                if(response.ok){
                    commentElements.prepend(createCommentElement({"user_name": localStorage.getItem("username"), "comment": comment, "createTime": Math.floor(Date.now() / 1000)}));
                }else{
                    throw Error(response.status + ": " + response.message);
                }
            })
            .catch((error) => {
                console.error(error);
                document.getElementById('share-comment-error').innerText = error.message;
            }).finally(() => {
                hideLoadingGif();
            });
        }
    });
    sortItem(comments, 'createTime', 'descendant')
    comments.forEach((comment) => {
        commentElements.appendChild(createCommentElement(comment));     
    });
    body.appendChild(commentElements);
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
                                        ${tweetDate.getHours() < 10 ? "0" + tweetDate.getHours() : tweetDate.getHours()}:${tweetDate.getMinutes() < 10 ? "0" + tweetDate.getMinutes() : tweetDate.getMinutes()} ${tweetDate.toLocaleDateString()} 
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
    const isOwner = tweet.user_name == loggedInUser;
    const starthtml = (isOwner ? 
    `  
    <div class="d-flex flex-row justify-content-between"> 
        <div class = "d-flex flex-row gap-1 align-items-center">
            <img height = 40px src="/api/v1/image/${tweet.user_name}" >
            <h5  > <a href="/profile/${tweet.user_name}" >${tweet.user_name}</a> </h5>
        </div>
        <img src="/resources/svg/trash-can.svg" id="delete-tweet" class="remove clickable">
    </div>
    `
    :
    `  
        <div class = "d-flex flex-row gap-1 align-items-center">
            <img height = 40px src="/api/v1/image/${tweet.user_name}" >
            <h5  > <a href="/profile/${tweet.user_name}" >${tweet.user_name}</a> </h5>
        </div>
    `)
    const continuehtml = `<p class = "my-4"> ${tweet.tweet}</p>

    <div class="d-flex flex-row align-items-center">
        <div class="d-flex flex-row me-2">
            <img src="./resources/svg/${tweetLikeState ? "heart-filled.svg" : "heart-empty.svg"}" alt="heart" class="heart-button clickable me-1" width="20" >
            ${tweet.liked_users.length}
        </div>
        <div class="d-flex flex-row me-2">
            <img src="./resources/svg/comment.svg" width="20" alt="comment" class="show-comment-button clickable me-1" data-bs-toggle="modal" data-bs-target="#commentPopUp">
            ${tweet.comments.length}
        </div>

        <div class="align-items-end" style="margin-left: auto;" >
            ${tweetDate.getHours() < 10 ? "0" + tweetDate.getHours() : tweetDate.getHours()}:${tweetDate.getMinutes() < 10 ? "0" + tweetDate.getMinutes() : tweetDate.getMinutes()} ${tweetDate.toLocaleDateString()} 
        </div>
    </div>                                     
    `;
    tweetElement.innerHTML = starthtml + continuehtml;
    isOwner ? addDeleteFunctionality(tweet,tweetElement.getElementsByClassName('remove')[0],tweetElement) : null;
    return tweetElement;
}

function addDeleteFunctionality(tweet,button,tweetElement){
    button.addEventListener("click",async () => {
        await deleteTweet(tweet)
        tweetElement.remove();
    })
}


async function likeTweet(tweet){
    return await fetch(`/api/v1/tweet/${tweet.user_name}/${tweet.createTime}/like`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    });

}

async function postComment(user_name,createTime,comment){
    console.log(user_name,createTime,comment)
    if(comment.length == 0){
        return;
    }    
    return await fetch(`/api/v1/tweet/${user_name}/${createTime}/comment`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"comment": comment})
    });
    
}



function showLoadingGif(object_id){
    console.log(object_id)
    const loadingGif = document.createElement('img');
    loadingGif.height = 25;
    loadingGif.classList.add('m-2');
    loadingGif.src = '/resources/gif/loadingGif.gif';
    loadingGif.classList.add('loading');
    document.getElementById(object_id).prepend(loadingGif)
}

function findElement(object_id){
    return document.getElementById(object_id)
}

function hideLoadingGif(){
    const loadingGif = document.querySelector('.loading');
    loadingGif.remove();
}

function sortItem(item, sortBy,sortType){
    return item.sort((a,b) => {
            return (sortType == "descendant") ? ( b[sortBy] - a[sortBy] ) : ( a[sortBy] - b[sortBy] );
    });
}