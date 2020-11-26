
const pg = require('pg');
const sql = require('sql');

var unirest = require("unirest");


var req = unirest("GET", "https://www.universal-tutorial.com/api/countries/");

req.headers({
  "Authorization": "bearer (your token)",
	"Accept": "application/json"
});
req.end(function (res) {
	if (res.error) throw new Error(res.error);
// console.log(res.body)
let apidata =  JSON.stringify(res.body);
// console.log(apidata)
let dataapi = JSON.parse(apidata);

let countrydata = sql.define({
  name: 'country',
  columns: [
    'country_name',
	'country_short_name',
	'country_phone_code'
  ]
});

async function run() {
  let client;
  try {
    client = new pg.Client({
      connectionString: 'postgres://postgres:meetpandit@localhost:5432/country_data_api'
    });
    await client.connect();
    let query = countrydata.insert(dataapi).toQuery();
    // console.log(query);
    let {rows} = await client.query(query);
    console.log(rows);
  } catch (e) {
    console.error(e);
  } finally {
    client.end();
  }
}

run();

//	console.log(res.body);
});
