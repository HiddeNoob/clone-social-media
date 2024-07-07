

document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Formun normal gönderimini durdurun
    const key = "9WTAYgTX2z8ssRYTQzkpt5slymAtIO7w77IdRX95";
    const apiURL = "https://l29cs2p6fk.execute-api.us-east-1.amazonaws.com/v1/user";
    // HTML formundan kullanıcı adı ve şifreyi alın
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // URL'yi ve sorgu parametrelerini oluşturun
    const url = new URL(apiURL);


    url.searchParams.append('username', username);
    url.searchParams.append('password', password);

    // API'ye GET isteği yapın
    fetch(url, {
        headers: {
            "x-api-key": key
        }
    }).then(function (response) {
        if (response.ok) {
            return response.json();
        }
        else if(response.status == 404){
            throw new Error('Kullanıcı adı veya şifre hatalı');
        }
        else {
            throw new Error('bilinmeyen bir hata oluştu');
        }
    }).then(function (data) {
        // API'den gelen verileri yazdırın
        console.log(data);
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        window.location.href = "../mainPage/index.html";
        alert('Giriş başarılı');
    }).catch(function (error) {
        // Hata durumunda hata mesajını yazdırın
        console.error(error);
    });

});

