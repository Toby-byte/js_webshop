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
        <header>
            <p></p>
            <h2></h2>
        </header>            
        <img src="" alt="">
        <p class="description"></p>
        <div>
            <p class="price"></p>
        </div>
        <div>
            <button>Add to cart</button>
            <input type="number" value="1" min="1" max="100">
        </div>
    `;
    return template;
}
const productTemplate = productBaseTemplate();

const productCard = (product) => {
    const card = productTemplate.cloneNode(true);

    card.querySelector('header > p').innerText = product.category;
    card.querySelector('h2').innerText = product.title;
    card.querySelector('img').setAttribute('src', product.image);
    card.querySelector('img').setAttribute('alt', product.title);
    card.querySelector('p.description').innerText = product.description;
    card.querySelector('p.price').innerText = product.price;
    card.querySelector('button').addEventListener('click', () => {
        let storedCart = JSON.parse(localStorage.getItem('kea-webshop-cart'));
        if (storedCart === null) {
            storedCart = [];
        }
        const amount = parseInt(card.querySelector('input[type=number]').value);
        const price = parseFloat((product.price * amount).toFixed(2));

        let found = false;
        let firstItem = true;
        let cart = '[';
        storedCart.forEach((item) => {
            // If the item is already in the cart, its amount and price are updated
            if (item.product === product.title) {
                item.amount += amount;
                item.price = parseFloat(item.price) + price;
                found = true;
            }
            if (firstItem) {
                firstItem = false;
            } else {
                cart += ',';
            }
            cart += JSON.stringify(item);
        });

        // The item is a new addition to the cart
        if (!found) {
            if (cart !== '[') {
                cart += ',';
            }
            cart += '{"product":"' + product.title + '",' +
                '"amount":' + amount +
                ',"price":' + price + '}';
        }
        cart += ']';

        localStorage.setItem('kea-webshop-cart', cart);
    });
    card.querySelector('input[type=number]').addEventListener('blur', function() {
        let amount = parseInt(this.value);
        if (!Number.isInteger(amount) || amount == 0) {
            amount = 1;
        }
        if (amount > 100) {
            alert('The amount per product is limited to 100 units. Sorry for the inconvenience');
            amount = 100;
        }
        this.value = Math.abs(amount);
    });

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