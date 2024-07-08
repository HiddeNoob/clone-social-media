const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const errorCode= params.get('error');
console.log(errorCode);
if (errorCode == 0){
    let errorDiv = document.createElement('div');
    errorDiv.classList.add('error');
    errorDiv.innerText = 'Kullanıcı adı veya şifre hatalı';
    document.querySelector('body').appendChild(errorDiv)
}