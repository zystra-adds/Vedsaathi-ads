// ==========================================================
// VEDSAATHI HERBAL - CONTROLLER SCRIPT (GB STONE KIT)
// ==========================================================

// Google Apps Script Web App URL for Google Sheets
let GOOGLE_SHEET_APP_URL = "https://script.google.com/macros/s/AKfycbxj46P7RdcTqJaQggve1PWT7BSbtf8le4dPQupJfaRhzQjLtwnN5F6BphQSpZ6XE0T85/exec";

// Current Selected Package State
let currentPackState = {
  pack: 1,
  name: "1 Kit (1 Month Course)",
  price: "₹2,250",
  rawPrice: 2250,
  mrp: "₹2,500",
  saveEn: "SAVE ₹250 (10% OFF)",
  saveHi: "₹250 छूट (10% OFF)"
};

document.addEventListener('DOMContentLoaded', () => {
  initTwoMinuteTimer();
  initFormValidation();
});

// Scroll to order form smoothly
window.scrollToTopForm = function() {
  const formEl = document.getElementById('compactOrderForm');
  if (formEl) {
    formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const nameInput = document.getElementById('fullName');
    if (nameInput) setTimeout(() => nameInput.focus(), 400);
  }
};

// ==========================================================
// 1. PACKAGE / COURSE SELECTOR
// ==========================================================
window.selectPack = function(packNum) {
  const packCards = document.querySelectorAll('.pack-opt-card');
  packCards.forEach(c => c.classList.remove('active'));

  const activeCard = document.querySelector(`.pack-opt-card[data-pack="${packNum}"]`);
  if (activeCard) {
    activeCard.classList.add('active');
  }

  if (packNum === 1) {
    currentPackState = {
      pack: 1,
      name: "1 Kit (1 Month Course)",
      price: "₹2,250",
      rawPrice: 2250,
      mrp: "₹2,500",
      saveEn: "SAVE ₹250 (10% OFF)",
      saveHi: "₹250 छूट (10% OFF)"
    };
  } else if (packNum === 2) {
    currentPackState = {
      pack: 2,
      name: "2 Kits (2 Months Best Seller Course)",
      price: "₹4,050",
      rawPrice: 4050,
      mrp: "₹5,000",
      saveEn: "SAVE ₹950 (19% OFF)",
      saveHi: "₹950 छूट (19% OFF)"
    };
  } else if (packNum === 3) {
    currentPackState = {
      pack: 3,
      name: "3 Kits (3 Months Complete Course)",
      price: "₹5,400",
      rawPrice: 5400,
      mrp: "₹7,500",
      saveEn: "SAVE ₹2,100 (28% OFF)",
      saveHi: "₹2,100 छूट (28% OFF)"
    };
  }

  // Update UI Elements
  const priceVal = document.getElementById('priceValDisplay');
  const mrpOld = document.getElementById('mrpOldDisplay');
  const saveBadge = document.getElementById('saveBadgeDisplay');
  const btnPay = document.getElementById('btnPayAmount');
  const bottomBtn = document.getElementById('bottomBtnText');

  if (priceVal) priceVal.textContent = currentPackState.price.replace('₹', '');
  if (mrpOld) mrpOld.textContent = currentPackState.mrp;
  if (btnPay) btnPay.textContent = currentPackState.price;

  if (saveBadge) {
    saveBadge.innerHTML = `<span data-en="${currentPackState.saveEn}" data-hi="${currentPackState.saveHi}">${currentPackState.saveEn}</span>`;
  }

  if (bottomBtn) {
    bottomBtn.setAttribute('data-en', `↑ ORDER NOW (CASH ON DELIVERY - ${currentPackState.price})`);
    bottomBtn.setAttribute('data-hi', `↑ अभी आर्डर करें (कैश ऑन डिलीवरी - ${currentPackState.price})`);
    const isHindi = document.body.classList.contains('lang-hi');
    bottomBtn.textContent = isHindi ? `↑ अभी आर्डर करें (कैश ऑन डिलीवरी - ${currentPackState.price})` : `↑ ORDER NOW (CASH ON DELIVERY - ${currentPackState.price})`;
  }
};

// ==========================================================
// 2. 2-MINUTE COUNTDOWN TIMER (02:00 -> 00:00)
// ==========================================================
function initTwoMinuteTimer() {
  let totalSeconds = 120; // 2 minutes
  const timerDisplay = document.getElementById('timerDisplay');

  if (!timerDisplay) return;

  setInterval(() => {
    if (totalSeconds > 0) {
      totalSeconds--;
    } else {
      totalSeconds = 120;
    }
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    const formattedMin = min < 10 ? '0' + min : min;
    const formattedSec = sec < 10 ? '0' + sec : sec;
    timerDisplay.textContent = `${formattedMin}:${formattedSec}`;
  }, 1000);
}

// ==========================================================
// 3. LANGUAGE SWITCHER (Dual, Hindi, English)
// ==========================================================
window.setLanguage = function(lang) {
  const body = document.body;
  const btns = document.querySelectorAll('.lang-btn');

  btns.forEach(b => b.classList.remove('active'));
  const activeBtn = document.querySelector(`.lang-btn[data-lang="${lang}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  body.classList.remove('lang-dual', 'lang-hi', 'lang-en');
  body.classList.add(`lang-${lang}`);
};

// ==========================================================
// 4. COMPACT FORM VALIDATION & GOOGLE SHEET SUBMIT
// ==========================================================
function initFormValidation() {
  const form = document.getElementById('compactOrderForm');
  const nameInput = document.getElementById('fullName');
  const phoneInput = document.getElementById('phoneNumber');
  const pincodeInput = document.getElementById('pincode');
  const addressInput = document.getElementById('fullAddress');

  if (!form) return;

  // Name Validation
  nameInput.addEventListener('input', () => {
    const parent = nameInput.closest('.input-cell');
    if (nameInput.value.trim().length >= 3) {
      parent.classList.add('valid');
      parent.classList.remove('has-error');
    } else {
      parent.classList.remove('valid');
    }
  });

  // Phone Validation (10 digits starting 6-9)
  phoneInput.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
    const parent = phoneInput.closest('.input-cell');
    const val = phoneInput.value;

    if (val.length === 10 && /^[6-9]\d{9}$/.test(val)) {
      parent.classList.add('valid');
      parent.classList.remove('has-error');
    } else {
      parent.classList.remove('valid');
    }
  });

  // Pincode Validation (6 digits)
  pincodeInput.addEventListener('input', () => {
    pincodeInput.value = pincodeInput.value.replace(/\D/g, '').slice(0, 6);
    const parent = pincodeInput.closest('.input-cell');
    const val = pincodeInput.value;

    if (val.length === 6) {
      parent.classList.add('valid');
      parent.classList.remove('has-error');
    } else {
      parent.classList.remove('valid');
    }
  });

  // Address Validation
  addressInput.addEventListener('input', () => {
    const parent = addressInput.closest('.input-cell');
    if (addressInput.value.trim().length >= 6) {
      parent.classList.add('valid');
      parent.classList.remove('has-error');
    } else {
      parent.classList.remove('valid');
    }
  });

  // Form Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let isValid = true;

    if (nameInput.value.trim().length < 2) {
      nameInput.closest('.input-cell').classList.add('has-error');
      isValid = false;
    }
    if (!/^[6-9]\d{9}$/.test(phoneInput.value)) {
      phoneInput.closest('.input-cell').classList.add('has-error');
      isValid = false;
    }
    if (pincodeInput.value.length !== 6) {
      pincodeInput.closest('.input-cell').classList.add('has-error');
      isValid = false;
    }
    if (addressInput.value.trim().length < 4) {
      addressInput.closest('.input-cell').classList.add('has-error');
      isValid = false;
    }

    if (isValid) {
      const submitBtn = document.getElementById('submitBtn');
      if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.querySelector('.btn-main-title').textContent = '⏳ REGISTERING ORDER...';
      }

      const orderData = {
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        pincode: pincodeInput.value.trim(),
        address: addressInput.value.trim(),
        package: currentPackState.name,
        price: currentPackState.price
      };

      openSuccessModal(orderData);
      form.reset();
      document.querySelectorAll('.input-cell').forEach(f => f.classList.remove('valid'));

      if (submitBtn) {
        setTimeout(() => {
          submitBtn.classList.remove('loading');
          submitBtn.querySelector('.btn-main-title').textContent = 'BOOK CASH ON DELIVERY ORDER →';
        }, 1200);
      }
    } else {
      const firstErr = form.querySelector('.input-cell.has-error');
      if (firstErr) {
        const input = firstErr.querySelector('input');
        if (input) input.focus();
      }
    }
  });
}

// Submit silently to Google Sheet Webhook
function submitToGoogleSheet(data) {
  if (!GOOGLE_SHEET_APP_URL) return;
  const payloadStr = JSON.stringify(data);

  // Method 1: Standard Fetch with text/plain (avoids CORS preflight)
  try {
    fetch(GOOGLE_SHEET_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: payloadStr
    }).catch(err => console.log("Fetch catch:", err));
  } catch (e) {
    console.log("Fetch error:", e);
  }

  // Method 2: Fallback Beacon
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payloadStr], { type: 'text/plain;charset=utf-8' });
      navigator.sendBeacon(GOOGLE_SHEET_APP_URL, blob);
    }
  } catch (e) {
    // beacon fallback ignore
  }
}

// ==========================================================
// 5. ORDER CONFIRMATION MODAL & WHATSAPP
// ==========================================================
function openSuccessModal(data) {
  const modal = document.getElementById('orderSuccessModal');
  const idEl = document.getElementById('receiptOrderId');
  const productEl = document.getElementById('receiptProduct');
  const nameEl = document.getElementById('receiptName');
  const phoneEl = document.getElementById('receiptPhone');
  const addressEl = document.getElementById('receiptAddress');
  const amountEl = document.getElementById('receiptAmount');
  const waBtn = document.getElementById('whatsappConfirmLink');

  const randomId = 'VS-' + Math.floor(10000 + Math.random() * 90000);

  if (idEl) idEl.textContent = `#${randomId}`;
  if (productEl) productEl.textContent = `VedSaathi GB Stone Kit (${data.package})`;
  if (nameEl) nameEl.textContent = data.name;
  if (phoneEl) phoneEl.textContent = `+91 ${data.phone}`;
  if (addressEl) addressEl.textContent = `${data.address}, PIN: ${data.pincode}`;
  if (amountEl) amountEl.textContent = `${data.price} (Cash On Delivery)`;

  // Submit to Google Sheets in background
  submitToGoogleSheet({
    orderId: `#${randomId}`,
    product: `VedSaathi GB Stone Kit (${data.package})`,
    name: data.name,
    phone: data.phone,
    pincode: data.pincode,
    address: data.address,
    amount: `${data.price} (COD)`,
    timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
  });

  const waText = encodeURIComponent(
    `Hello VedSaathi Herbal, I booked my order!\n\n` +
    `*Order ID:* #${randomId}\n` +
    `*Product:* VedSaathi GB Stone Kit (${data.package})\n` +
    `*Amount:* ${data.price} (Cash on Delivery)\n` +
    `*Name:* ${data.name}\n` +
    `*Phone:* +91 ${data.phone}\n` +
    `*Address:* ${data.address}, PIN: ${data.pincode}\n\n` +
    `Please arrange fast dispatch and request the Ayurvedic doctor to call for dosage instructions. Thank you!`
  );

  if (waBtn) {
    waBtn.href = `https://api.whatsapp.com/send?text=${waText}`;
  }

  if (modal) {
    modal.classList.add('active');
  }
}

window.closeSuccessModal = function() {
  const modal = document.getElementById('orderSuccessModal');
  if (modal) {
    modal.classList.remove('active');
  }
};
