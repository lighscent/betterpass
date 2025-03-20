document.addEventListener('DOMContentLoaded', function () {
    const generateBtn = document.getElementById('generate');
    const copyBtn = document.getElementById('copy');
    const passwordField = document.getElementById('password');
    const toast = document.getElementById('toast');
    const lengthSlider = document.getElementById('length');
    const lengthValue = document.getElementById('lengthValue');

    const uppercase = document.getElementById('uppercase');
    const lowercase = document.getElementById('lowercase');
    const numbers = document.getElementById('numbers');
    const symbols = document.getElementById('symbols');

    const themeToggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    const chars = {
        uppercase: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
        lowercase: 'abcdefghijkmnpqrstuvwxyz',
        numbers: '23456789',
        symbols: '!";#$%&\'()*+,-./:;<=>?@[]^_`{|}~'
    };

    function setTheme(isDark) {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme === 'dark');
    } else {
        setTheme(prefersDark.matches);
    }

    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        setTheme(!isDark);
    });

    function savePreferences() {
        const preferences = {
            length: lengthSlider.value,
            uppercase: uppercase.checked,
            lowercase: lowercase.checked,
            numbers: numbers.checked,
            symbols: symbols.checked
        };
        localStorage.setItem('passwordPreferences', JSON.stringify(preferences));
    }

    function loadPreferences() {
        const savedPreferences = localStorage.getItem('passwordPreferences');
        if (savedPreferences) {
            const preferences = JSON.parse(savedPreferences);
            lengthSlider.value = preferences.length;
            lengthValue.textContent = preferences.length;
            uppercase.checked = preferences.uppercase;
            lowercase.checked = preferences.lowercase;
            numbers.checked = preferences.numbers;
            symbols.checked = preferences.symbols;
        }
    }

    lengthSlider.addEventListener('input', (e) => {
        lengthValue.textContent = e.target.value;
        savePreferences();
        generatePassword();
    });

    [uppercase, lowercase, numbers, symbols].forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            savePreferences();
            generatePassword();
        });
    });

    function generatePassword() {
        const length = parseInt(lengthSlider.value);
        let charset = '';
        let requiredChars = [];

        if (uppercase.checked) {
            charset += chars.uppercase;
            requiredChars.push(getRandomChar(chars.uppercase));
        }
        if (lowercase.checked) {
            charset += chars.lowercase;
            requiredChars.push(getRandomChar(chars.lowercase));
        }
        if (numbers.checked) {
            charset += chars.numbers;
            requiredChars.push(getRandomChar(chars.numbers));
        }
        if (symbols.checked) {
            charset += chars.symbols;
            requiredChars.push(getRandomChar(chars.symbols));
        }

        if (charset === '') {
            passwordField.value = 'Sélectionnez au moins une option';
            return;
        }

        let passwordArray = [...requiredChars];
        const remainingLength = length - passwordArray.length;
        for (let i = 0; i < remainingLength; i++) {
            passwordArray.push(getRandomChar(charset));
        }

        passwordArray = shuffleArray(passwordArray);

        if (chars.symbols.includes(passwordArray[0])) {
            for (let i = 1; i < passwordArray.length; i++) {
                if (!chars.symbols.includes(passwordArray[i])) {
                    [passwordArray[0], passwordArray[i]] = [passwordArray[i], passwordArray[0]];
                    break;
                }
            }
        }

        passwordField.value = passwordArray.join('');
    }

    function getRandomChar(string) {
        const randomBuffer = new Uint32Array(1);
        crypto.getRandomValues(randomBuffer);
        const index = Math.floor(randomBuffer[0] / (0xFFFFFFFF + 1) * string.length);
        return string[index];
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const randomBuffer = new Uint32Array(1);
            crypto.getRandomValues(randomBuffer);
            const j = Math.floor(randomBuffer[0] / (0xFFFFFFFF + 1) * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function isSequential(char1, char2) {
        if (!char1 || !char2) return false;
        const code1 = char1.charCodeAt(0);
        const code2 = char2.charCodeAt(0);
        return Math.abs(code1 - code2) === 1;
    }

    function showToast() {
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 2000);
    }

    generateBtn.addEventListener('click', generatePassword);

    copyBtn.addEventListener('click', () => {
        passwordField.select();
        document.execCommand('copy');
        showToast();
    });

    loadPreferences();
    generatePassword();
}); 