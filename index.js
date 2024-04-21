let contracts;

let costs = ["sheep", "cow", "wool", "bread", "cheese", "whisky"]
let rewards = ["cotton", "tobacco", "sugarCane", "upgrade", "expansion", "gold", "hops"]

function init() {
    fetch('contracts.json')
        .then(response => response.json())
        .then(json => {
            contracts = json;
            for (contract of contracts) {
                contract.discarded = false;
            }
            update();
        })
        .catch(error => console.error('Error:', error));
    for (cost of costs) {
        checkBox = document.getElementById(cost);
        checkBox.addEventListener('change', function () {
            update();
        });
    }
    for (reward of rewards) {
        checkBox = document.getElementById(reward);
        checkBox.addEventListener('change', function () {
            update();
        });
    }
}

function update() {
    let includedContracts = "";
    let excludedContracts = "";
    for (contract of contracts) {
        if (isIncluded(contract)) {
            includedContracts += generateContractHtml(contract);
        } else {
            excludedContracts += generateContractHtml(contract);
        }
    }
    document.getElementById("included").innerHTML = includedContracts;
    document.getElementById("excluded").innerHTML = excludedContracts;
}

function isIncluded(contract) {
    let included = true;
    for (cost of costs) {
        checkBox = document.getElementById(cost);
        if (!checkBox.checked && (contract.costs[cost] > 0)) {
            included = false;
        }
    }
    for (reward of rewards) {
        checkBox = document.getElementById(reward);
        if (!checkBox.checked && (contract.rewards[reward] > 0)) {
            included = false;
        }
    }
    return included;
}

function generateContractHtml(contract) {
    let position = -(contract.id * 194);
    if (contract.discarded) {
        return "<div id=\"" + contract.id + "\" onclick=\"toggleDiscard(" + contract.id + ")\" class=\"contract\" style=\"background-position: " + position + "px 194px;\">X</div>";
    } else {
        return "<div id=\"" + contract.id + "\" onclick=\"toggleDiscard(" + contract.id + ")\" class=\"contract\" style=\"background-position: " + position + "px 194px;\"> </div>";
    }
}

function toggleDiscard(id) {
    for (contract of contracts) {
        if (contract.id === id) {
            contract.discarded = !contract.discarded;
        }
    }
    update();
}
