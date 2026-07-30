// assets/custom-form-validation.js

// 1. UUID Generate Karne ka Function
function makeUuid() {
  return window.crypto && window.crypto.randomUUID
    ? window.crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      });
}

// 2. Form Validation Logic (Sare forms ke liye)
document.addEventListener('DOMContentLoaded', function () {
  const forms = document.querySelectorAll('.js-lead-form'); // Website ke sare forms select karega

  forms.forEach((form) => {
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // Default submit rokna
      
      let isValid = true;
      
      // Pehle se mojood errors ko clear karna
      form.querySelectorAll('.error-text').forEach((span) => {
        span.innerText = '';
      });

      // Values lena aur trim karna (leading/trailing spaces hatane ke liye)
      const nameInput = form.querySelector('[name="name"]');
      const emailInput = form.querySelector('[name="email"]');
      const phoneInput = form.querySelector('[name="phone"]');
      const imageInput = form.querySelector('[name="image"]');

      const nameValue = nameInput ? nameInput.value.trim() : '';
      const emailValue = emailInput ? emailInput.value.trim() : '';
      const phoneValue = phoneInput ? phoneInput.value.trim() : '';

      // --- Name Validation ---
      if (nameValue === '') {
        displayError(form, 'name', 'Name cannot be empty.');
        isValid = false;
      }

      // --- Email Validation ---
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (emailValue === '') {
        displayError(form, 'email', 'Email cannot be empty.');
        isValid = false;
      } else if (!emailRegex.test(emailValue)) {
        displayError(form, 'email', 'Please enter a valid email format.');
        isValid = false;
      }

      // --- Phone Validation ---
      // Sirf numbers, +, -, space, () allow hain
      const phoneRegex = /^[0-9+\-\s()]+$/;
      if (phoneValue === '') {
        displayError(form, 'phone', 'Phone number cannot be empty.');
        isValid = false;
      } else if (!phoneRegex.test(phoneValue)) {
        displayError(form, 'phone', 'Only valid phone number characters are allowed.');
        isValid = false;
      }

      // --- Image Upload Validation ---
      if (imageInput) {
        const file = imageInput.files[0];
        if (!file) {
          displayError(form, 'image', 'Image upload is required.');
          isValid = false;
        } else {
          // Task requirement: "Only image files should be accepted"
          if (!file.type.startsWith('image/')) {
            displayError(form, 'image', 'Only image files are accepted.');
            isValid = false;
          }
          // Task requirement: "Maximum file size: 20 MB"
          // 20 MB = 20 * 1024 * 1024 = 20971520 bytes
          if (file.size > 20971520) {
            displayError(form, 'image', 'File size exceeds 20 MB limit.');
            isValid = false;
          }
        }
      }

      // --- Agar sab kuch valid hai, toh UUID generate karke form submit karein ---
      if (isValid) {
        const uuidInput = form.querySelector('.form-uuid');
        if (uuidInput) {
          uuidInput.value = makeUuid(); // Unique ID generate karke hidden field mein daalna
        }
        
        console.log('Form Validated Successfully! UUID:', uuidInput ? uuidInput.value : 'No UUID field');
        
        // Yahan hum Task 2 mein Laravel API ko Fetch request bhejenge
        alert('Validation Passed! Form is ready to submit to backend.');
        
        // form.submit(); // Actual API call yahan hogi next task mein
      }
    });
  });
});

// Error display karne ka helper function
function displayError(form, fieldName, message) {
  const errorSpan = form.querySelector(`[data-error="${fieldName}"]`);
  if (errorSpan) {
    errorSpan.innerText = message;
    errorSpan.style.display = 'block'; // Ensure it's visible
  }
}