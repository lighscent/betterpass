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

    // Configuration du thème
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Définir chars au début
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

    // Initialiser le thème
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

    // Fonction pour sauvegarder les préférences
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

    // Fonction pour charger les préférences
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

    // Modifier les écouteurs d'événements existants
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
        let charset = '';
        if (uppercase.checked) charset += chars.uppercase;
        if (lowercase.checked) charset += chars.lowercase;
        if (numbers.checked) charset += chars.numbers;
        if (symbols.checked) charset += chars.symbols;

        if (charset === '') {
            passwordField.value = 'Sélectionnez au moins une option';
            return;
        }

        const length = parseInt(lengthSlider.value);
        let password = '';
        let lastChar = '';
        let charArray = charset.split('');

        while (password.length < length) {
            charArray = shuffleArray([...charArray]);
            const char = charArray[0];

            if (isSequential(lastChar, char) || password.includes(char)) {
                continue;
            }

            password += char;
            lastChar = char;
        }

        passwordField.value = password;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
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

    // Charger les préférences au démarrage
    loadPreferences();
    generatePassword();
}); 