const Promise = require('bluebird');
const axios = require('axios');

axios.get('http://api.population.io:80/1.0/population/2017/Belarus/')
    .then(function (response) {
        let countPeople = 0;
        response.data.forEach(i => {
            countPeople += i.total;
        })
        console.log('Общее кол-во населения Беларуси 2017: ' + countPeople);
    });

let urls = [
    'http://api.population.io:80/1.0/population/2017/Canada/',
    'http://api.population.io:80/1.0/population/2017/Germany/',
    'http://api.population.io:80/1.0/population/2017/France/'
];

let countWomen = 0;
let countMen = 0;

let all = [];
for (let i = 0; i < urls.length; i++) {
    all.push(axios.get(urls[i]));
}

Promise.all(all)
    .then((response) => {
        response.forEach(i => {
            i.data.forEach(item => {
                countWomen += item.females;
                countMen += item.males;
            });
        });
        console.log('Суммарное количество женщин: ' + countWomen);
        console.log('Суммарное количество мужчин: ' + countMen);
    })
    .catch((err) => {
        console.log('task2 error: ' + err);
    })


let any = [];

let urls2 = [
    'http://api.population.io:80/1.0/population/2014/Belarus/',
    'http://api.population.io:80/1.0/population/2015/Belarus/'
];

for (let i = 0; i < urls2.length; i++) {
    any.push(axios.get(urls2[i]));
}

Promise.any(any)
    .then((response) => {
        response.data.forEach(i => {
            i.age === 25 ? console.log(`Год: ${i.year}, женщины: ${i.females}, мужчины: ${i.males}`) : "";
        });
    })
    .catch((err) => {
        console.log('task3 error: ' + err);
    })

Promise.props({
    greece : axios.get('http://api.population.io:80/1.0/mortality-distribution/Greece/male/49y2m/today/'),
    turkey : axios.get('http://api.population.io:80/1.0/mortality-distribution/Turkey/male/49y2m/today/')
}).then(response => {
    let maxAgeG = -20;
    let maxPercent = -20;
    response.greece.data.mortality_distribution.forEach(item => {
        if (item.mortality_percent > maxPercent) {
            maxPercent = item.mortality_percent;
            maxAgeG = item.age;
        }
    })
    console.log('Греция: ' + maxAgeG);

    let maxAgeT = -20;
    let maxPercentT = -20;
    response.turkey.data.mortality_distribution.forEach(item => {
        if (item.mortality_percent > maxPercentT) {
            maxPercentT = item.mortality_percent;
            maxAgeT = item.age;
        }
    })
    console.log('Турция: ' + maxAgeT);
}).catch((err) => {
    console.log('task4 error: ' + err);
})

let countries = [];

axios.get('http://api.population.io:80/1.0/countries')
    .then(response => {
        let count = 0;
        response.data.countries.forEach(country => {
            if (count < 5) {
                countries.push(country);
                count++;
            }
        });
        Promise.map(countries, (i) => {
            return axios.get(`http://api.population.io:80/1.0/population/2007/${i}/`);
        })
            .then((response => {
                response.forEach(item => {
                    let c;
                    let count = 0;
                    item.data.forEach(element => {
                        count += element.total;
                        c = element.country;
                    })
                    console.log(`Страна: ${c}, Общее население: ${count}`);
                })
            }))
    })
    .catch(err => {
        console.log('task5 error: ' + err);
    })
