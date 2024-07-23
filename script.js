const DEFAULT_BASE_CURRENCY_CODE = 'USD';

let exchangerate;
let currencies;

const DATA_PRECISION = 2;

const exchangeratee1 = document.querySelector('.exchangerate');
const f_select = document.querySelector('.from select');
const t_select = document.querySelector('.to select');
const f_input = document.querySelector('#fromcurr');
const t_input = document.querySelector('#tocurr');

const ipdata = {
    key: '2d54e550f953f84e43cebce4205f52253134a738e76255b9d40921ca',
    baseurl: 'https://api.ipdata.co',

    currency: function() {
        return `${this.baseurl}/currency?api-key=${this.key}`;
    }
};

const currencylayer = {
    key: '8789c804799f217f2e1fd576',
    baseurl: 'https://v6.exchangerate-api.com',

    convert: function(base_code, target_code, amount) {
        return `${this.baseurl}/v6/${this.key}/pair/${base_code}/${target_code}/${amount}`;
    },

    list: function() {
        return `${this.baseurl}/v6/${this.key}/codes`;
    }
};

async function getusercurrency() {

    const res = await fetch(ipdata.currency());
    const usercurrency = await res.json();
    return usercurrency;
}

async function getcurrencies() {


    const res = await fetch(currencylayer.list());
    const data = await res.json();
    return data.supported_codes;
}

async function getexchangerate(base_code, target_code) {
    const amount = 1;
    const res = await fetch(currencylayer.convert(base_code, target_code, amount));

    const data = await res.json();
    return data.conversion_rate;
}

async function renderexchangerate(base_code, target_code) {

    console.log(base_code, target_code);

    exchangerate = await getexchangerate(base_code, target_code);

    console.log('Exchange rate:', exchangerate);

    exchangeratee1.innerHTML = `<p>1 ${base_code} equals</p>
                                 <h1>${exchangerate.toFixed(DATA_PRECISION)} ${target_code}</h1>`;
}

function rendercurrencies(currencies, base_code, target_code) {
    f_select.innerHTML = '';
    t_select.innerHTML = '';

    currencies.forEach(([code, name]) => {
        const fromSelectedAttribute = code === base_code ? 'selected' : '';
        f_select.innerHTML += `<option value="${code}" ${fromSelectedAttribute}>${code} - ${name}</option>`;
        
        const toSelectedAttribute = code === target_code ? 'selected' : '';
        t_select.innerHTML += `<option value="${code}" ${toSelectedAttribute}>${code} - ${name}</option>`;
    });
}

function convert() {
    const fromCurrency = f_select.value;
    const toCurrency = t_select.value;
    const amount = parseFloat(f_input.value) || 0;

    if (fromCurrency && toCurrency && amount) {


        getexchangerate(fromCurrency, toCurrency).then(rate => {
            exchangerate = rate;
            t_input.value = (amount * exchangerate).toFixed(DATA_PRECISION);
        });
    }
}

function setupEventListeners() {

    f_input.addEventListener('input', convert);
    f_select.addEventListener('change', convert);
    t_select.addEventListener('change', convert);
}

async function init() {

    const usercurrency = await getusercurrency();
    currencies = await getcurrencies();
    
    await renderexchangerate(DEFAULT_BASE_CURRENCY_CODE, usercurrency.code);
    rendercurrencies(currencies, DEFAULT_BASE_CURRENCY_CODE, usercurrency.code);
    
    setupEventListeners(); 
}

init();

