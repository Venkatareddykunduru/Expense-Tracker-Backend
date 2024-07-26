document.getElementById('buy-premium').addEventListener('click', function () {
    const buyPremiumButton = document.getElementById('buy-premium');
    const showLeaderboardButton = document.getElementById('show-leaderboard');
    axios.post('http://35.153.50.19:3000/payment/create-order', {}, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {
        const { razorpayOrderId } = response.data;

        var options = {
            "key": "rzp_test_mvWxxeeorodZVK", // Enter the Key ID generated from the Dashboard
            //"amount": "5000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 means 50000 paise or ₹500.00.
            "currency": "INR",
            "name": "Your Company Name",
            "description": "Test Transaction",
            //"image": "https://example.com/your_logo",
            "order_id": razorpayOrderId,
            "handler": function (response) {
                axios.post('http://35.153.50.19:3000/payment/verify-payment', {
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id
                }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                .then(res => {
                    alert('Payment successful and premium activated');
                    // Optionally, update UI to reflect premium status
                    window.localStorage.setItem('ispremium','true');
                    buyPremiumButton.style.display='none';
                    showLeaderboardButton.style.display='block';
                })
                .catch(err => {
                    console.error('Error verifying payment', err);
                });
            },
            "prefill": {
                "name": "Your Name",
                "email": "your_email@example.com",
                "contact": "9999999999"
            },
            "theme": {
                "color": "#3399cc"
            },
            // Add event listeners for payment failure or dismissal
            "modal": {
                "ondismiss": function() {
                    console.log("Checkout form closed without completing payment");
                    alert("Payment was not completed. Please try again.");
                }
            }
        };

        var rzp1 = new Razorpay(options);

        rzp1.on('payment.failed', function (response) {
            console.log(response.error);
            axios.post('http://35.153.50.19:3000/payment/payment-failed', {
                razorpayOrderId: response.error.metadata.order_id,
                razorpayPaymentId: response.error.metadata.payment_id
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(res => {
                alert('Payment failed. Please try again.');
                // Optionally, update UI to reflect failure status
            })
            .catch(err => {
                console.error('Error recording payment failure', err);
            });
        });

        rzp1.open();
    })
    .catch(err => {
        console.error('Error creating order', err);
    });
});