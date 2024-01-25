/**
 * If the user is logged in, their email is displayed next to the Log out option.
 * The Log in, Log out and Sign up options are hidden or unhidden 
 *     depending on whether the user is logged in or not
 */
(function() {
    const userEmail = sessionStorage.getItem('userEmail');

    const logOutOption = document.querySelector('#optLogout');
    if (userEmail !== null) {
        logOutOption.classList.remove('hidden');
        logOutOption.querySelector('#userEmail').innerText = userEmail;
        document.querySelector('#optLogin').classList.add('hidden');
        document.querySelector('#optSignup').classList.add('hidden');
    } else {
        logOutOption.classList.add('hidden');
        logOutOption.querySelector('#userEmail').innerText = '';
        document.querySelector('#optLogin').classList.remove('hidden');
        document.querySelector('#optSignup').classList.remove('hidden');
    }
})();

fetch('https://fakestoreapi.com/products')
.then(res => res.json())
.then(data => {
    console.log(data);

    let productsList = '';
    data.forEach((product) => {
        productsList += productCard(product);
    });
    document.querySelector('main').innerHTML = productsList;
});

const productCard = (product) => {
    return `
        <article>
            <header>
                <h2>${product.title}</h2>
            </header>            
            <img src="${product.image}" alt="${product.title}">
            <p>${product.description}</p>
            <p>&dollar;${product.price}</p>
            <footer>
                <p>${product.category}</p>
            </footer>
        </article>
    `;
}

// Log out
document.querySelector('#optLogout > a').addEventListener('click', (e) => {
    // e.preventDefault();

    sessionStorage.removeItem('userEmail');
    window.location.href = 'index.html';
});