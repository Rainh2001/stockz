function queryStocks(){
    document.querySelector("button").disabled = true;
    let originalQuery = document.querySelector("input").value;
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    }
    else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            if(this.response === "error"){
                displayError(originalQuery);
            } else {
                displayStocks(JSON.parse(this.response));
            }
        }
    }
    let query = document.getElementById("input").value;
    xhttp.open("GET", `getQueryResults?query=${query}`);
    xhttp.send();
}

function displayStocks(results){
    document.querySelector("button").disabled = false;
    removeChildren(document.querySelector("#companies"));
    results.forEach(company => {
        let container = document.createElement("div");
        container.classList.add("company");
        if(company.name){
            let name = document.createElement("div");
            name.textContent = `Name: ${company.name}`;
            container.appendChild(name);
        }
        if(company.symbol){
            let symbol = document.createElement("div");
            symbol.textContent = `Symbol: ${company.symbol}`;
            container.appendChild(symbol);
        }
        if(company.market){
            let market = document.createElement("div");
            market.textContent = `Market: $${company.market}`;
            container.appendChild(market);
        }
        if(company.price){
            let price = document.createElement("div");
            price.textContent = `Price: $${company.price}`;
            container.appendChild(price);
        }
        if(company.change){
            let change = document.createElement("div");
            change.textContent = `Change: `;
            let change_span = document.createElement("span");
            if(company.change >= 0){
                change_span.textContent += "+";
                change_span.classList.add("green");
            } else {
                change_span.classList.add("red");
            }
            change_span.textContent += company.change;
            change.appendChild(change_span);
            container.appendChild(change);
            container.remove
        }
        document.querySelector("#companies").appendChild(container);
    });
}

function removeChildren(element){
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
}

function displayError(query){
    removeChildren(document.querySelector("#companies"));
    let errorMessage = document.createElement("div");
    errorMessage.classList.add("error");
    errorMessage.textContent = `Couldn't retrieve any stocks referencing: ${query}`;
    document.querySelector("#companies").appendChild(errorMessage);
    document.querySelector("button").disabled = false;
}
