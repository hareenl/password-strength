/* ------- Entropy Calculation ------- */

function calculateEntropy(password) {
  let poolSize = 0;
  let letterCount = (password.match(/[a-zA-Z]/g) || []).length;
  let digitCount = (password.match(/[0-9]/g) || []).length;
  let specialCount = (password.match(/[\W_]/g) || []).length;
  let totalLength = password.length;

  // Determine the size of the pool based on character types used
  if (/[a-z]/.test(password)) poolSize += 26;  // Lowercase letters
  if (/[A-Z]/.test(password)) poolSize += 26;  // Uppercase letters
  if (/[0-9]/.test(password)) poolSize += 10;  // Digits
  if (/[\W_]/.test(password)) poolSize += 32;  // Special characters
  
  // Entropy formula: length * log2(pool_size)
  let entropy = (password.length > 0 && poolSize > 0) ? Math.log2(poolSize) * password.length : 0;

  return {
    entropy: entropy.toFixed(2),
    poolSize: poolSize,
    letterCount: letterCount,
    digitCount: digitCount,
    specialCount: specialCount,
    totalLength: totalLength,
  };
}

function getStrengthFromEntropy(entropy) {
  if (entropy < 28) return "Very Weak";
  else if (entropy < 36) return "Weak";
  else if (entropy < 60) return "Moderate";
  else if (entropy < 80) return "Strong";
  else return "Very Strong";
}

function updateStrengthBar(entropy) {
  const strengthBar = document.getElementById('strength-bar-inner');
  const barPercent = Math.min(entropy / 80, 1) * 100; // Maximum value capped at 80 entropy
  strengthBar.style.width = `${barPercent}%`;

  if (entropy < 28) strengthBar.style.backgroundColor = "red";
  else if (entropy < 36) strengthBar.style.backgroundColor = "orange";
  else if (entropy < 60) strengthBar.style.backgroundColor = "yellow";
  else strengthBar.style.backgroundColor = "green";
}

function updateDetails(letterCount, digitCount, specialCount, totalLength, poolSize) {
  document.getElementById('letter-count').textContent = letterCount;
  document.getElementById('digit-count').textContent = digitCount;
  document.getElementById('special-count').textContent = specialCount;
  document.getElementById('password-length').textContent = totalLength;
  document.getElementById('char-pool-size').textContent = poolSize;
}

/* ------- Password Generator ------- */

function generatePassword(options) {
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';
  const ambiguousChars = '{}[]()/\'"`~,;:.<>';

  let availableChars = '';
  
  if (options.useLowerCase) availableChars += lowerCase;
  if (options.useUpperCase) availableChars += upperCase;
  if (options.useDigits) availableChars += digits;
  if (options.useSpecialChars) availableChars += specialChars;
  if (options.useAmbiguous) availableChars += ambiguousChars;

  if (availableChars.length === 0) return '';

  let password = '';
  
  for (let i = 0; i < options.length; i++) {
    password += availableChars.charAt(Math.floor(Math.random() * availableChars.length));
  }

  return password;
}

/* ------- Event Handlers ------- */
// Password visibility toggle
document.getElementById('toggle-password').addEventListener('change', function () {
  const passwordInput = document.getElementById('password');
  if (this.checked) {
    passwordInput.type = 'text';
  } else {
    passwordInput.type = 'password';
  }
});

// Generate password button functionality
document.getElementById('generate').addEventListener('click', function () {
  const length = parseInt(document.getElementById('length').value);
  const useLowerCase = document.getElementById('use-lowercase').checked;
  const useUpperCase = document.getElementById('use-uppercase').checked;
  const useDigits = document.getElementById('use-digits').checked;
  const useSpecialChars = document.getElementById('use-special').checked;
  const useAmbiguous = document.getElementById('use-ambiguous').checked;

  const options = {
    length,
    useLowerCase,
    useUpperCase,
    useDigits,
    useSpecialChars,
    useAmbiguous,
  };

  const newPassword = generatePassword(options);
  document.getElementById('password').value = newPassword;

  document.getElementById('password').dispatchEvent(new Event('input'));
});

// Update on password input (when typing or generating)
document.getElementById("password").addEventListener("input", function () {
  const password = this.value;
  const result = calculateEntropy(password);
  const strength = getStrengthFromEntropy(result.entropy);

  document.getElementById("entropy-value").textContent = result.entropy;
  document.getElementById("strength-value").textContent = strength;

  updateStrengthBar(result.entropy);
  updateDetails(result.letterCount, result.digitCount, result.specialCount, result.totalLength, result.poolSize);
});

/* ------- Dark Mode Toggle ------- */
const darkModeButton = document.getElementById('dark-mode-toggle');

darkModeButton.addEventListener('click', function () {
  document.body.classList.toggle('dark-mode');
  document.querySelector('.container').classList.toggle('dark-mode');
  document.querySelector('input').classList.toggle('dark-mode');
  document.querySelector('button').classList.toggle('dark-mode');
  document.getElementById('strength-bar-inner').classList.toggle('dark-mode');
  this.classList.toggle('dark-mode');

  this.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});
