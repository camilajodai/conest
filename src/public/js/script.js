const input = document.getElementById('inputFone');

input.addEventListener('input', () => {
    if (input.value.length > 15) {
        input.value = input.value.slice(0, 15);
    }
});

const inputCnpj = document.getElementById('inputCnpj');

inputCnpj.addEventListener('input', () => {
    if (inputCnpj.value.length > 20) {
        inputCnpj.value = inputCnpj.value.slice(0, 20);
    }
});

const inputCep = document.getElementById('inputCep');

inputCep.addEventListener('input', () => {
    if (inputCep.value.length > 8) {
        inputCep.value = inputCep.value.slice(0, 8);
    }
});