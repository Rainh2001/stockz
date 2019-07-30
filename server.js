const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const unirest = require('unirest');
const app = express();
const port = 8080;

const STOCK_QUOTES = "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-quotes";
const STOCK_QUERY = "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/auto-complete";
const API_KEY = JSON.parse(fs.readFileSync("api.json")).api;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(`${__dirname}/public`));

app.listen(port, function(){
    console.log(`Server running on port: ${port}`);
});

app.get("/getQueryResults", async function(request, response){
    let query = request.url.replace("/getQueryResults?query=", "")
    var queryResult = await getQueryResults(query);
    if(queryResult === "error" || typeof queryResult == Error){
        response.send("error");
        console.log("Error receiving query results...");
        return null;
    }
    queryResult = queryResult.ResultSet.Result;
    query = "";
    for(let i = 0; i < queryResult.length; i++){
        query += queryResult[i].symbol;
        if(!(i === queryResult.length-1)){
            query += ",";
        }
    }
    if(query === ""){
        response.send("error");
        return null;
    }
    var quoteResult = await getQuotes(query);
    quoteResult = quoteResult.quoteResponse.result;
    let profile = [];
    for(let i = 0; i < quoteResult.length; i++){
        profile.push({
            symbol: quoteResult[i].symbol,
            name: quoteResult[i].shortName,
            market: quoteResult[i].market,
            price: quoteResult[i].regularMarketPrice,
            change: quoteResult[i].regularMarketChange
        });
    }
    response.send(JSON.stringify(profile));
    console.log(`Successful Transfer (${profile.length}):`);
    let str = "{ ";
    for(let i = 0; i < profile.length; i++){
        str += profile[i].symbol;
        if(i !== profile.length - 1){
            str += ", ";
        }
    }
    str += " }";
    console.log(str);
});

function getQueryResults(query){
    return new Promise(function(resolve, reject){
        var request = unirest("GET", STOCK_QUERY);
        request.query({
            "lang":"en",
            "region":"AU",
            "query": query
        });
        request.headers({
            "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
	        "x-rapidapi-key": API_KEY
        });
        request.end(function(response){
            if(response.error){
                reject(new Error("Unable to query for companies..."));
            } else {
                resolve(response.body);
            }
        });
    });
}

function getQuotes(query){
    return new Promise(function(resolve, reject){
        var request = unirest("GET", STOCK_QUOTES);
        request.query({
            "region":"AU",
            "lang":"en",
            "symbols":query
        });
        request.headers({
            "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
	        "x-rapidapi-key": API_KEY
        });
        request.end(function(response){
            if(response.error){
                reject(new Error("Unable to retrieve quotes..."));
            } else {
                resolve(response.body);
            }
        });
    });
}
