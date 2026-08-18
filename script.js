// ডায়মন্ড প্যাকেজ ও তাদের দামের তালিকা (BDT)
const prices = {
    "100": 80,
    "520": 380,
    "1060": 750
};

// HTML Elements ধরা
const diamondsSelect = document.getElementById('diamonds');
const form = document.querySelector('form');

// মূল্যের ডিসপ্লে এলিমেন্ট তৈরি করা
const priceDisplay = document.createElement('div');
priceDisplay.style.marginTop = '15px';
priceDisplay.style.fontWeight = 'bold';
priceDisplay.style.color = '#38bdf8';
priceDisplay.style.textAlign = 'center';

// বাটনের ঠিক আগে প্রাইস ডিসপ্লে যুক্ত করা
const submitBtn = document.querySelector('button');
form.insertBefore(priceDisplay, submitBtn);

// ডায়মন্ড সিলেক্ট চেঞ্জ হলে দাম আপডেট করার ফাংশন
function updatePrice() {
    const selectedDiamonds = diamondsSelect.value;
    const price = prices[selectedDiamonds];
    priceDisplay.innerText = `Total Price: ${price} BDT`;
}

// প্রথমবার লোড হলে দাম দেখাবে
updatePrice();

// অপশন পরিবর্তন করলে দাম পরিবর্তন হবে
diamondsSelect.addEventListener('change', updatePrice);

// অর্ডার ফর্মে সাবমিট হলে ইভেন্ট
form.addEventListener('submit', function(event) {
    event.preventDefault(); // পেজ রিলোড হওয়া আটকাবে

    const playerId = document.getElementById('player-id').value.trim();
    const selectedDiamonds = diamondsSelect.value;
    const paymentMethod = document.getElementById('payment').value.toUpperCase();
    const totalPrice = prices[selectedDiamonds];

    if (!playerId) {
        alert("Please enter a valid Player ID!");
        return;
    }

    // অর্ডার কনফার্মেশন মেসেজ
    alert(`🎉 Order Placed Successfully!\n\nPlayer ID: ${playerId}\nDiamonds: ${selectedDiamonds}\nTotal Cost: ${totalPrice} BDT\nPayment Method: ${paymentMethod}`);

    // ফর্ম রিসেট করা
    document.getElementById('player-id').value = '';
    diamondsSelect.value = "100";
    updatePrice();
});
