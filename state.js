

const sql = require('sql');

var unirest = require("unirest");
var pg = require("pg");
const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'dbname',
    password: 'password'
    port: 5432,
});

client.connect();

 const query = `SELECT * FROM country asc`;

//  const query = `SELECT * FROM country where country_id =1 `;


client.query(query, (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    for (let row of res.rows) {
        // console.log(row);
         console.log(row.country_name);
        var req = unirest("GET", "https://www.universal-tutorial.com/api/states/"+row.country_name);
        req.headers({
              "Authorization": "bearer yourtoken",
            	"Accept": "application/json"
            });
            req.end (function (res) {
            	if (res.error) throw new Error(res.error);
              // console.log(res.body);
              let apidata =  JSON.parse(JSON.stringify(res.body));
           console.log(apidata)
             var result = apidata.map(function(el) {
                var o = Object.assign({}, el);
                o.country_id = row.country_id
                // o.country_name = row.country_name;
                return o;
              })
                // console.log(apidata)
             console.log(result)
            let countrydata = sql.define({
                  name: 'state',
                  columns: [
                   'state_name',
                   'country_id',
                //    'country_name'
                  ]
                });

                async function run() {
  let client;
  try {
    client = new pg.Client({
      connectionString: 'postgres://postgres:password@localhost:5432/dbname'
    });
    await client.connect();
    let query = countrydata.insert(result).toQuery();
    console.log(query);
    let {rows} = await client.query(query);
    console.log(rows);
  } catch (e) {
    console.error(e);
  } finally {
    client.end();
  }
}
run();
            });
          }
    client.end();
});

