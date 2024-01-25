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

const productBaseTemplate = () => {
    const template = document.createElement('article');
    template.innerHTML = `
        <article>
            <header>
                <h2></h2>
            </header>            
            <img src="" alt="">
            <p></p>
            <p class="price">&dollar;</p>
            <footer>
                <p></p>
            </footer>
        </article>
    `;
    return template;
}
const productTemplate = productBaseTemplate();

const productCard = (product) => {
    const card = productTemplate.cloneNode(true);

    card.querySelector('h2').innerText = product.title;
    card.querySelector('img').setAttribute('src', product.image);
    card.querySelector('img').setAttribute('alt', product.title);
    card.querySelector('p').innerText = product.description;
    card.querySelector('p.price').innerText = product.price;
    card.querySelector('footer > p').innerText = product.category;

    return card;
}

fetch('https://fakestoreapi.com/products')
.then(res => {
    if (res.ok) {
        return res.json();
    } else {
        console.log('Error in fetch request: ', res.status, res.statusText);
    }
})
.then(data => {
    const productSection = document.createElement('section');
    data.forEach((product) => {
        productSection.appendChild(productCard(product));
    });
    document.querySelector('main').appendChild(productSection);
}).catch(error => {
    console.log('Error catched in fetch request: ', error);

    const errorMessage = document.createElement('p');
    errorMessage.innerText = 'Unfortunately, product information cannot be retrieved at this moment. Please try again later.'
    document.querySelector('main').appendChild(errorMessage);
});

// Log out
document.querySelector('#optLogout > a').addEventListener('click', () => {
    sessionStorage.removeItem('userEmail');
});