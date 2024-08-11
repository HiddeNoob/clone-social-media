
async function setProfileInfo(searchingUser){
    fetch(`/api/v1/user/${searchingUser}`).then((response) => {
        if (response.ok)
            return response.json();
        else
            throw Error(response.status + ": " + response.message);
    }).then((data) => {
        data = data.data;
        tweetDate = new Date(data.createTime * 1000);
        document.getElementById('user-name').innerHTML = data.user_name;
        document.getElementById('follower-count').innerHTML = data.followers.length;
        document.getElementById('following-count').innerHTML = data.following.length;
        document.getElementById('joined-date').innerHTML =  `${tweetDate.getHours() < 10 ? "0" + tweetDate.getHours() : tweetDate.getHours()}:${tweetDate.getMinutes() < 10 ? "0" + tweetDate.getMinutes() : tweetDate.getMinutes()} ${tweetDate.toLocaleDateString()}`;
        const followButton = document.getElementById('follow-button');
        if (followButton) {
            followButton.innerText = data.followers.includes(localStorage.getItem("username")) ? "Unfollow" : "Follow";
        }
    }).catch((error) => {
        console.error(error);
    });

}

document.addEventListener('DOMContentLoaded', async () => {
    const searchingUser = window.location.pathname.slice(9); // this function cuts the link and gets the searching user
    setPersonHref();
    setProfileInfo(searchingUser);
    showLoadingGif("tweets");
    try{
        await loadUserTweets("tweets",searchingUser,localStorage.getItem("username"))
        document.getElementById('tweet-count').innerText = document.getElementById('tweets').childElementCount - 1; // set shared tweet number and subtract the loading gif
    }catch(error){
        const noTweetElement = document.createElement('div');
        noTweetElement.className = 'text-center fst-italic p-4 text-secondary';
        noTweetElement.innerHTML = error.message;
        document.getElementById('tweets').appendChild(noTweetElement);
        document.getElementById('tweet-count').innerText = "0"; // we don't know
    }finally{
        hideLoadingGif();
    }

    
});

function addDeleteButton(tweet){
    const deleteButton = document.createElement('img');
    deleteButton.src = "./resources/svg/trash.svg";
    deleteButton.width = 20;
    deleteButton.classList.add('clickable');
    deleteButton.addEventListener('click', async () => {
            await deleteTweet(tweet);
            location.reload();
    });
    tweet.append(deleteButton);
}