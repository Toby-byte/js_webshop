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
        <div class="cart${userEmail === null ? ' hidden' : ''}">
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

const handleNumberInputBlur = function() {
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
 * Shopping cart management
 */
const cartItemBaseTemplate = () => {
    const template = document.createElement('tr');
    template.innerHTML = `
        <td class="titleCell"></td>
        <td class="amountCell alignRight"></td>
        <td class="removeCell"><button class="remove"><img src="img/trash.png" alt="Remove product"></button></td>
        <td class="priceCell alignRight"></td>
    `;
    return template;
}
const cartItemTemplate = cartItemBaseTemplate();

const cart = document.querySelector('#cart');
document.querySelector('#optCart > a').addEventListener('click', () => {
    const section = cart.querySelector('section');
    section.innerHTML = '';

    const cartInfo = document.createElement('div');
    const storedCart = JSON.parse(localStorage.getItem('kea-webshop-cart'));
    if (storedCart === null || storedCart.length === 0) {
        const emptyCartMessage = document.createElement('p');
        emptyCartMessage.innerText = 'The cart is empty. Please add some products to the cart.';
        cartInfo.appendChild(emptyCartMessage);
    } else {
        let totalPrice = 0;
        const products = document.createElement('table');        
        storedCart.forEach((item) => {
            const itemPrice = item.amount * item['unit-price'];
            totalPrice += itemPrice;

            const row = cartItemTemplate.cloneNode(true);
            
            row.querySelector('.titleCell').innerText = item.product;
            
            const amountTextbox = document.createElement('input');
            amountTextbox.setAttribute('type', 'number');
            amountTextbox.setAttribute('min', '1');
            amountTextbox.setAttribute('max', '100');
            amountTextbox.setAttribute('value', item.amount);
            amountTextbox.addEventListener('blur', handleNumberInputBlur);
            amountTextbox.addEventListener('change', handleNumberInputChange);
            row.querySelector('.amountCell').appendChild(amountTextbox);
            
            // The original price is stored to recalculate the price when the amount changes
            const priceCell = row.querySelector('.priceCell');
            priceCell.innerText = `${itemPrice.toFixed(2)}`;
            priceCell.setAttribute('default-value', item['unit-price']);

            row.querySelector('.remove').addEventListener('click', handleRemoveProduct);

            products.appendChild(row);
        });
        const productsTotal = document.createElement('tfoot');
        productsTotal.innerHTML = `
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td class="priceCell alignRight">${totalPrice.toFixed(2)}</td>
            </tr>
        `;
        products.appendChild(productsTotal);
        cartInfo.appendChild(products);

    }
    section.appendChild(cartInfo);
    cart.showModal();
});

/**
 * When a product is removed from the cart, the amount has to be deducted from the total
 */
const handleRemoveProduct = function() {
    const itemPrice = parseFloat(this.parentElement.nextElementSibling.innerText);
    const totalPriceCell = document.querySelector('tfoot .priceCell');

    totalPriceCell.innerText = (parseFloat(totalPriceCell.innerText) - itemPrice).toFixed(2);

    this.parentElement.parentElement.remove();
}

/**
 * When the amount of any product changes, 
 * both the price of said product and the total must update accordingly
 */
const handleNumberInputChange = function() {
    const itemPriceCell = this.parentElement.parentElement.lastElementChild;
    const previousItemPrice = parseFloat(itemPriceCell.innerText);

    const amount = parseInt(this.value);
    const unitPrice = parseFloat(itemPriceCell.getAttribute('default-value'));
    const newItemPrice = parseFloat(amount * unitPrice);
    itemPriceCell.innerText = newItemPrice.toFixed(2);

    const total = document.querySelector('tfoot td.priceCell');
    total.innerHTML = (parseFloat(total.innerText) + newItemPrice - previousItemPrice).toFixed(2);
};

// Cart closing
document.querySelector('#cart > header > div').addEventListener('click', () => {
    cart.close();
});

/**
 * Upon logging out, the user's email is removed from sessionStorage
 */
document.querySelector('#optLogout > a').addEventListener('click', () => {
    sessionStorage.removeItem('userEmail');
});