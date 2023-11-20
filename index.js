const searchButton = document.querySelector('.searchButton');
const result = document.getElementById('input-adress');
const inputSearch = document.querySelector('.searchInput');
const newSearchadress = document.querySelector('.new-search');
let errorSpan = document.querySelector('.error');

inputSearch.addEventListener('input', handleInput);

inputSearch.addEventListener('keyup', (e) => {
    const key = e.which || e.keyCode;
    const enterKeyPressed = key === 13;

    if (enterKeyPressed) {
        handleSearch();
    }
});

searchButton.addEventListener('click', handleSearch);

async function searchCep(cep) {
        let response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        return await response.json();    
}

function handleInput() {
    inputSearch.value = inputSearch.value.replace(/[^0-9,]/g, '');
}

function handleSearch() {
    const cepInput = inputSearch.value;

    if (validInput(cepInput)) return;

    completeAddressSearch(cepInput);
}

async function completeAddressSearch(cep) {
    let completeAddress = await searchCep(cep);

    if (!completeAddress || completeAddress.erro) {
        showError('CEP inexistente, insira um CEP válido');
        return;
    }

    let addressInfo = getInfoCompleteAddress(completeAddress);
    displayAddress(addressInfo);
}

function getInfoCompleteAddress(address) {
    return {
        publicPlace: address.logradouro,
        neighborhood: address.bairro,
        city: address.localidade,
        state: address.uf,
        ddd: address.ddd
    };
}

function displayAddress(addressInfo) {
    result.classList.add('result-visible');
    newSearchadress.classList.remove('new-search');
    
    result.innerHTML = `<p> Logradouro: ${addressInfo.publicPlace}, Bairro: ${addressInfo.neighborhood}, Cidade:  ${addressInfo.city} Estado: ${addressInfo.state} ddd: ${addressInfo.ddd}</p>`;
}

function validInput(cep) {
    if (cep === '' || cep.length < 8) {
        showError('Digite um CEP válido com 8 dígitos');
        return true;
    } else {
        hideError();
        return false;
    }
}

function showError(message) {
    errorSpan.classList.add('error-visible');
    errorSpan.innerHTML = message;
}

function hideError() {
    errorSpan.classList.remove('error-visible');
}


