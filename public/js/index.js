const selectedCurrency = document.querySelector("#currency-select");
const currency = document.querySelectorAll(".currency");
const price = document.querySelectorAll(".price");
let eurPrices = [];

price.forEach(p => eurPrices.push(parseFloat(p.innerHTML)));

var selected;

function ajaxTemplate(url, type, datatype) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: url,
            type: type,
            dataType: datatype,
            success: (txt) => {
                resolve(txt);
            },
            error: (err) => {
                reject(err);
            }
        });
    });
}


// ajaxTemplate(window.location.href + "/getSelected", "GET", "text").then(function(data) {
//     selectedCurrency.value = data;
// }).catch(function(err) {
//     console.log(err)
// });


function CurrencyConvertor() {
    var fromEURtoUSD, fromEURtoGBP;
    apiUrl = "http://data.fixer.io/api/latest?access_key=ba1f541744856e9f930fb8121c7be2c0";

    ajaxTemplate(apiUrl, "GET", "jsonp").then(function(data) {
        fromEURtoUSD = data.rates.USD;
        fromEURtoGBP = data.rates.GBP;
    }).catch(function(err) {
        console.log(err)
    });

    selectedCurrency.onchange = () => {
        var selectedCur = selectedCurrency.value;
        let newPrice;
        for (let i = 0; i < price.length; i++) {
            switch (selectedCur) {
                case "eur":
                    currency[i].innerHTML = "€";
                    price[i].innerHTML = eurPrices[i];
                    break;
                case "usd":
                    currency[i].innerHTML = "$";
                    newPrice = eurPrices[i] * fromEURtoUSD
                    price[i].innerHTML = newPrice.toFixed(2);
                    break;
                case "gbp":
                    currency[i].innerHTML = "£";
                    newPrice = eurPrices[i] * fromEURtoGBP
                    price[i].innerHTML = newPrice.toFixed(2);
                    break;
                default:
                    console.log("No such currency");
            }
        }
        calcTotal();
        ProductQuantities();
    }
}

const quantity = document.querySelectorAll(".quantity");
const value = document.querySelectorAll("#quantityPrice");
const cartTotal = document.querySelector(".cartTotal");

function ProductQuantities() {
    let initialPrices = [];
    value.forEach(v => initialPrices.push(parseFloat(v.innerHTML)))
    for (let i = 0; i < quantity.length; i++) {
        quantity[i].onchange = () => {
            let q = parseFloat(quantity[i].value);
            let result = (initialPrices[i] * q).toFixed(2);
            value[i].innerHTML = result;
            calcTotal();
        }
    }
}

function calcTotal() {
    let total = 0;
    value.forEach(v => {
        total = (total + parseFloat(v.innerHTML));
    })
    cartTotal.innerHTML = total.toFixed(2);
}

CurrencyConvertor();
if (quantity.length != 0) {
    ProductQuantities();
    calcTotal();
}