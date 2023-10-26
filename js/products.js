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
document.querySelector('nav a').addEventListener('click', (e) => {
    e.preventDefault();

    sessionStorage.removeItem('userEmail');
    window.location.href = 'index.html';
});