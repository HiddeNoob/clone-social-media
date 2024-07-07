

const key = "9WTAYgTX2z8ssRYTQzkpt5slymAtIO7w77IdRX95";
const url = "https://l29cs2p6fk.execute-api.us-east-1.amazonaws.com/v1/user";
var username = localStorage.getItem('username');
var password = localStorage.getItem('password');
if (username && password) {

    document.getElementById('welcome').innerText = username;
    var section = document.querySelector('section'); // Assuming you have a <section> element

    getAllUsers().then(function (data) {

        (data.response).forEach(function (user) {
            console.log(user);
            const userTweets = user.tweets;
            userTweets.forEach((tweet) => {
                var newItem = document.createElement('div');
                newItem.classList.add('tweet');
                newItem.innerHTML = `
                    <div class="user-info">
                        <h3>${user.username}</h3>
                    </div>
                    <p>${tweet.message}</p>
                    <button>Like ${tweet.likeNumber}</button>
                    <p>${new Date(tweet.createTimestamp * 1000).toLocaleString()}</p>
                `;    
                section.appendChild(newItem);
            }) // Append the new item to the section
        });
    }).catch(function (error) {
        // Hata durumunda hata mesajını yazdırın
        console.error(error);
    });
    
}
else{
    window.location.href = "../loginPage/index.html";
}

async function getAllUsers() {
    const response = await fetch(url, {
        headers: {
            "x-api-key": key
        }
    });
    const data = response.json();
    return data;
}



