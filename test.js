var countries = require("./index.js");

countries.map(function(country){
    country.translations.tur = country.translations.tur || {official: country.name.official, common: country.name.common};
});

console.log(countries.length);