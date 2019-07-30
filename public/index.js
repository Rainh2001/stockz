function queryStocks(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            displayStocks(JSON.parse(this.response));
        }
    }
    let query = document.getElementById("input").value;
    xhttp.open("GET", `getQueryResults?query=${query}`);
    xhttp.send();
}

function displayStocks(results){
    console.log(results);
}
