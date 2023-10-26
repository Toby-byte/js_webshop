import { baseUrl } from './info.js';

document.querySelector('#frmLogin').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = this.elements.email.value;

    fetch(baseUrl + '/users?q=' + email)
    .then(response => response.json())
    .then((data) => {
        if (data.length === 0) {
            alert('Incorrect credentials');
        } else {

            //// Since this is not an exact match search, the array should be traversed to check which email corresponds exactly to the email in the form

            const pwd = this.elements.password.value;
            if (data[0].pwd !== pwd) {
                alert('Incorrect credentials');
            } else {
                sessionStorage.setItem('userEmail', email);
                window.location.href = 'home.html';
            }
        }
    })
});