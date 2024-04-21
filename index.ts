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

function buildCheckBoxes(filters: string[]): string {
    let result = "";
    for (const filter of filters) {
        result += buildCheckBox(filter);
    }
    return result;
}

function buildCheckBox(filterKey: string): string {
    let capitalized = filterKey[0].toUpperCase() + filterKey.slice(1);
    return `<input id="${filterKey}" type="checkbox" checked="checked"/>
        <label for="${filterKey}">${capitalized}</label>
        <span id="${filterKey}Count"></span>`;
}


function update() {
    let includedContracts = [];
    let excludedContracts = [];
    for (const contract of contracts) {
        if (isIncluded(contract)) {
            includedContracts.push(contract);
        } else {
            excludedContracts.push(contract);
        }
    }

    for (const filter of costs) {
        let checkBox = document.getElementById(filter) as HTMLInputElement;
        if (checkBox.checked) {
            setFilterCounts(includedContracts, "costs", filter);
        } else {
            setFilterCounts(excludedContracts, "costs", filter);
        }
    }

    for (const filter of rewards) {
        let checkBox = document.getElementById(filter) as HTMLInputElement;
        if (checkBox.checked) {
            setFilterCounts(includedContracts, "rewards", filter);
        } else {
            setFilterCounts(excludedContracts, "rewards", filter);
        }
    }

    setDirectFilterCounts(contracts, "discarded");

    let includedContractsHtml = "";
    for (const included of includedContracts) {
        includedContractsHtml += generateContractHtml(included);
    }
    document.getElementById("included").innerHTML = includedContractsHtml;

    let excludedContractsHtml = "";
    for (const excluded of excludedContracts) {
        excludedContractsHtml += generateContractHtml(excluded);
    }
    document.getElementById("excluded").innerHTML = excludedContractsHtml;
}

function setFilterCounts(contracts: any[], subcategory:string, filterKey: string) {
    let count: number = 0;
    let sum: number = 0;
    for (const contract of contracts) {
        let value = contract[subcategory][filterKey];
        sum += value
        if (value > 0) {
            count += 1
        }
    }
    document.getElementById(filterKey+"Count").innerHTML = `(${sum} on ${count})`;
}

function setDirectFilterCounts(contracts, filter: string) {
    let count: number = 0;
    for (const contract of contracts) {
        if (contract[filter]) {
            count += 1;
        }
    }
    document.getElementById("discardedCount").innerHTML = `(${count})`;
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
