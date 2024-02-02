document.querySelector('#chkRepeat').addEventListener('change', function() {
    if (this.checked) {
        document.querySelector('#billingInfo').classList.add('hidden');
    } else {
        document.querySelector('#billingInfo').classList.remove('hidden');
    }
});