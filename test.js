var Promise = require("bluebird");
var countries = require("./index.js");
var request = require("request");

var promises = [];
var foundCount = 0;
countries.map(function (country) {
    if (!country.translations.tur) {
        promises.push(new Promise(function (resolve, reject) {
            request
                .get('https://tr.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=' + country.name.common, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        try {
                            body = JSON.parse(body);
                            Object.keys(body.query.pages).forEach(function (key) {
                                var info = body.query.pages[key];
                                if (info.extract) {
                                    foundCount++;
                                    console.log(foundCount, info.title);
                                }
                            });
                            resolve(response.body);
                        }catch(err){
                            reject(err);
                        }
                    }
                })
        }));
    } else {
        Promise.resolve(country);
    }
    // country.translations.tur = country.translations.tur || {official: country.name.official, common: country.name.common};

});

Promise.all(promises).then(function (results) {
    console.log(foundCount);
}).catch(function(errors){
    console.log(errors);
})

console.log(JSON.stringify(countries));