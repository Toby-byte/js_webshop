/**
 * If the user is logged in, their email is displayed next to the Log out option.
 * The Log in, Log out, Sign up and Cart options are hidden or unhidden 
 *     depending on whether the user is logged in or not
 */
const userEmail = sessionStorage.getItem('userEmail');
(function() {
    const logOutOption = document.querySelector('#optLogout');
    if (userEmail !== null) {
        logOutOption.classList.remove('hidden');
        logOutOption.querySelector('#userEmail').innerText = userEmail;
        document.querySelector('#optLogin').classList.add('hidden');
        document.querySelector('#optSignup').classList.add('hidden');        
        document.querySelector('#optCart').classList.remove('hidden');        
    } else {
        logOutOption.classList.add('hidden');
        logOutOption.querySelector('#userEmail').innerText = '';
        document.querySelector('#optLogin').classList.remove('hidden');
        document.querySelector('#optSignup').classList.remove('hidden');
        document.querySelector('#optCart').classList.add('hidden');
    }
})();

/**
 * Each product is created by cloning a product template
 */
const productBaseTemplate = () => {
    const template = document.createElement('article');

    const header = document.createElement('header');
    header.appendChild(document.createElement('p'));
    header.appendChild(document.createElement('h2'));    
    template.appendChild(header);
    template.appendChild(document.createElement('img'));

    const description = document.createElement('p');
    description.classList.add('description');
    template.appendChild(description);
    
    const priceWrapper = document.createElement('div');
    const price = document.createElement('p');
    price.classList.add('price');
    priceWrapper.appendChild(price);
    template.appendChild(priceWrapper);

    const addToCart = document.createElement('div');
    addToCart.classList.add('cart');
    if (userEmail === null) {
        addToCart.classList.add('hidden');
    }
    const button = document.createElement('button');
    button.innerText = 'Add to cart';
    addToCart.appendChild(button)
    const number = document.createElement('input');
    number.setAttribute('type', 'number');
    number.setAttribute('value', '1');
    number.setAttribute('min', '1');
    number.setAttribute('max', '100');
    addToCart.appendChild(number);
    template.appendChild(addToCart);

    // == INITIAL IMPLEMENTATION == 
    // template.innerHTML = `
    //     <header>
    //         <p></p>
    //         <h2></h2>
    //     </header>            
    //     <img src="" alt="">
    //     <p class="description"></p>
    //     <div>
    //         <p class="price"></p>
    //     </div>
    //     <div class="cart${userEmail === null ? ' hidden' : ''}">
    //         <button>Add to cart</button>
    //         <input type="number" value="1" min="1" max="100">
    //     </div>
    // `;
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
        const unitPrice = parseFloat(product.price);

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
                ',"unit-price":' + unitPrice + '}';
        }
        cart += ']';

        localStorage.setItem('kea-webshop-cart', cart);
    });
    card.querySelector('input[type=number]').addEventListener('blur', handleNumberInputBlur);

    return card;
}

export const handleNumberInputBlur = function() {
    let amount = parseInt(this.value);
    if (!Number.isInteger(amount) || amount == 0) {
        amount = 1;
    }
    if (amount > 100) {
        alert('The amount per product is limited to 100 units. Sorry for the inconvenience');
        amount = 100;
    }
    this.value = Math.abs(amount);
}

/**
 * The products are fetched from the Fake Store API
 */
const apiUrl = 'https://fakestoreapi.com/products';
fetch(apiUrl)
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

/**
 * Upon logging out, the user's email is removed from sessionStorage
 */
document.querySelector('#optLogout > a').addEventListener('click', () => {
    sessionStorage.removeItem('userEmail');
});