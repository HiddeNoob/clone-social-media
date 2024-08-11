document.getElementById('follow-button').addEventListener('click', async () => {
    const followState = document.getElementById('follow-button').innerText == "Unfollow"; // true already following, false not following
    const url = '/api/v1/user/' + window.location.pathname.slice(9) + (followState ? "/unfollow" : "/follow");
    console.log(url)
    fetch(url).then((response) => {
        if (response.ok)
            return response.json();
        else
            throw Error(response.status + ": " + response.message);
    }).then((data) => {
        document.getElementById('follow-button').innerText = followState ? "Follow" : "Unfollow";
    }).catch((error) => {
        console.error(error);
    });
});