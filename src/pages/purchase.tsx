import React, { useState } from 'react';

// Khai báo kiểu cho Stripe, nếu bạn sử dụng Stripe.js
declare var Stripe: (publishableKey: string) => any;

const PurchaseButton: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const stripe = Stripe('your-publishable-key-here'); // Thay 'your-publishable-key-here' bằng khóa công khai của bạn

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleCheckoutClick = () => {
    if (!amount || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    fetch('/user/create-checkout-session/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')!, // Đảm bảo lấy giá trị csrf-token từ cookie
      },
      body: JSON.stringify({ amount }),
    })
      .then((response) => response.json())
      .then((sessionId: { id: string }) => {
        return stripe.redirectToCheckout({ sessionId: sessionId.id });
      })
      .then((result: { error?: { message: string } }) => {
        if (result.error) {
          alert(result.error.message);
        }
      })
      .catch((error: Error) => {
        console.error('Error:', error);
      });
  };

  // Hàm lấy cookie csrf token
  function getCookie(name: string): string | null {
    let cookieValue: string | null = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  return (
    <div>
      <input
        type="number"
        id="amount"
        placeholder="Enter amount"
        value={amount}
        onChange={handleAmountChange}
      />
      <button id="checkout-button" onClick={handleCheckoutClick}>
        Checkout
      </button>
    </div>
  );
};

export default PurchaseButton;
