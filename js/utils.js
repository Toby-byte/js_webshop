export const showAlert = (message) => {
    const alert = document.querySelector('#alert');
    const paragraph = document.createElement('p');
    paragraph.innerText = message;
    
    alert.querySelector('section').appendChild(paragraph);
    alert.showModal();
    
    // Alert dialog closing
    document.querySelector('#alert > header a').addEventListener('click', function () {
        // dialog#alert > header > div > a
        const dialog = this.parentElement.parentElement.parentElement;
        dialog.close();
    });
    document.querySelector('#alert').addEventListener('close', function() {
        const paragraph = this.querySelector('section > p');
        if (paragraph !== null) {
            paragraph.remove();
        }
    });
};
