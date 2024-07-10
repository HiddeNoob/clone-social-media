let tweetElements = document.getElementById('tweets')
const loadingGif = document.createElement('img');
loadingGif.src = '/resources/gif/loadingGif.gif';
loadingGif.classList.add('loading');
tweetElements.appendChild(loadingGif)

fetch('/tweets').then((response) => {
    console.log(response);
    if (response.ok) {
        return response.json();
    }
    else {
        tweetElements.append('Bir hata oluştu: ' + response.status + ": " + response.statusText)
    }
}).then((response) => {
    console.log(response);
    if(response.status == 200){
        let tweets = response.data;
        tweets.forEach((tweet) => {
            const tweetElement = document.createElement('div');
            tweetElement.className = 'tweet';
            const tweetDate = new Date(tweet.createTimestamp * 1000);
            console.log(tweet.createTimestamp);
            tweetElement.innerHTML = "<p>" + tweet.message + "</p>" + "<p>" + tweetDate.toLocaleDateString() + tweetDate.toTimeString() + "</p>" + "<p>" + tweet.likeNumber + "</p>";
            tweetElements.appendChild(tweetElement);
        })
    }else{
        const errorElement = document.createElement('div');
        errorElement.className = 'error';
        errorElement.innerHTML = 'Bir hata oluştu: ' + response.status + ": " + response.message;
        tweetElements.append(errorElement)
    }

    loadingGif.remove();
});



