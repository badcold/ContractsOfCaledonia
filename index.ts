let contracts;

let costs = ["sheep", "cow", "wool", "bread", "cheese", "whisky"]
let rewards = ["cotton", "tobacco", "sugarCane", "upgrade", "expansion", "gold", "hops"]

function init() {
    buildHeader();
    fetch('contracts.json')
        .then(response => response.json())
        .then(json => {
            contracts = json;
            for (const contract of contracts) {
                contract.discarded = false;
            }
            update();
        })
        .catch(error => console.error('Error:', error));
    for (const cost of costs) {
        let checkBox = document.getElementById(cost);
        checkBox.addEventListener('change', function () {
            update();
        });
    }
    for (const reward of rewards) {
        let checkBox = document.getElementById(reward);
        checkBox.addEventListener('change', function () {
            update();
        });
    }
    let otherCheckBox = document.getElementById("discarded");
    otherCheckBox.addEventListener('change', function () {
        update();
    });
}

function buildHeader() {
    document.getElementById("header").innerHTML = `
        <div id="costs" class="filters">
            <span>Costs:</span>
            ${buildCheckBoxes(costs)}
        </div>
        <div id="rewards" class="filters">
            <span>Rewards:</span>
            ${buildCheckBoxes(rewards)}
        </div>

        <div id="other" class="filters">
            <span>Other:</span>
            ${buildCheckBoxes(["discarded"])}
        </div>
    `;
}

function buildCheckBoxes(filters: string[]) : string {
    let result = "";
    for (const filter of filters) {
        result += buildCheckBox(filter);
    }
    return result;
}

function buildCheckBox(filterKey: string): string {
    let capitalized = filterKey[0].toUpperCase() + filterKey.slice(1);
    return `<input id="${filterKey}" type="checkbox" checked="checked"/><label for="${filterKey}">${capitalized}</label>`;
}

function update() {
    let includedContracts = "";
    let excludedContracts = "";
    for (const contract of contracts) {
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
    for (const cost of costs) {
        let checkBox = document.getElementById(cost) as HTMLInputElement;
        if (!checkBox.checked && (contract.costs[cost] > 0)) {
            included = false;
        }
    }
    for (const reward of rewards) {
        let checkBox = document.getElementById(reward) as HTMLInputElement;
        if (!checkBox.checked && (contract.rewards[reward] > 0)) {
            included = false;
        }
    }
    if (!(document.getElementById("discarded") as HTMLInputElement).checked && contract.discarded) {
        included = false;
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
    for (const contract of contracts) {
        if (contract.id === id) {
            contract.discarded = !contract.discarded;
        }
    }
    update();
}
