var currentUser;

async function setProfileInfo(searchingUser){
    fetch(`/api/v1/user/${searchingUser}`).then((response) => {
        if (response.ok)
            return response.json();
        else
            throw Error(response.status + ": " + response.message);
    }).then(async (data) => {
        data = data.data;
        currentUser = data;
        tweetDate = new Date(data.createTime * 1000);
        document.getElementById('user-name').innerHTML = data.user_name;
        document.getElementById('follower-count').innerHTML = data.followers.length;
        document.getElementById('following-count').innerHTML = data.following.length;
        document.getElementById('joined-date').innerHTML =  `${tweetDate.getHours() < 10 ? "0" + tweetDate.getHours() : tweetDate.getHours()}:${tweetDate.getMinutes() < 10 ? "0" + tweetDate.getMinutes() : tweetDate.getMinutes()} ${tweetDate.toLocaleDateString()}`;
        let isHavePicture = await fetch(`./api/v1/image/${data.user_name}`).then((res) => res.status == 200)
        if(isHavePicture){
            document.getElementById('profile-pic').src = `./api/v1/image/${data.user_name}`;
        }
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

const followButton = document.getElementById('follow-button');

if(followButton) // if user in someones profile follow button is going to appear
    followButton.addEventListener('click', async () => {
    const followState = document.getElementById('follow-button').innerText == "Unfollow"; // true already following, false not following
    const url = '/api/v1/user/' + window.location.pathname.slice(9) + (followState ? "/unfollow" : "/follow");
    console.log(url)
    fetch(url).then((response) => {
        if (response.ok)
            return response.json();
        else
            throw Error(response.status + ": " + response.message);
    }).then((data) => {
        console.log(data)
        currentUser = data;
        document.getElementById('follow-button').innerText = followState ? "Follow" : "Unfollow";
    }).catch((error) => {
        console.error(error);
    });
});

document.getElementById('follower-count').parentElement.addEventListener('click',() => { //  show followers
    const body = document.getElementById('popup-body');
    document.getElementById('popup-title').innerText = "Followers";
    const followerElements = document.createElement('div');
    followerElements.id = "follower-elements";
    body.innerHTML = '';
    currentUser.followers.forEach((username) => {
        followerElements.append(createUserPreviewItem(username))
    })
    console.log(body)
    body.append(followerElements);
})
document.getElementById('following-count').parentElement.addEventListener('click',() => { //  show followings
    const body = document.getElementById('popup-body');
    document.getElementById('popup-title').innerText = "Following";
    body.innerHTML = '';

    const followingElement = document.createElement('div');
    followingElement.id = "following-elements";
    currentUser.following.forEach((username) => {
        body.append(createUserPreviewItem(username))
    })
})

function createUserPreviewItem(username){
    const object = document.createElement('div');
    object.classList.add('border','p-3','d-flex','justify-content-between','rounded','mb-2');
    object.innerHTML = 
    `
        <div> <img height="25" src="./resources/svg/person.svg"> <a href="./profile/${username}"> ${username} </a> </div>
    `
    return object;
}

