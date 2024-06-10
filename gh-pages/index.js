var contracts;
var costs = ["sheep", "cow", "wool", "bread", "cheese", "whisky"];
var rewards = ["cotton", "tobacco", "sugarCane", "upgrade", "expansion", "gold", "hops"];
var imports = ["cotton", "tobacco", "sugarCane"];
var bonuses = ["upgrade", "expansion", "gold", "hops"];
function init() {
    buildHeader();
    fetch('contracts.json')
        .then(function (response) { return response.json(); })
        .then(function (json) {
        contracts = json;
        for (var _i = 0, contracts_1 = contracts; _i < contracts_1.length; _i++) {
            var contract = contracts_1[_i];
            contract.discarded = false;
        }
        update();
    })
        .catch(function (error) { return console.error('Error:', error); });
    for (var _i = 0, costs_1 = costs; _i < costs_1.length; _i++) {
        var cost = costs_1[_i];
        var checkBox = document.getElementById(cost);
        checkBox.addEventListener('change', function () {
            update();
        });
    }
    for (var _a = 0, rewards_1 = rewards; _a < rewards_1.length; _a++) {
        var reward = rewards_1[_a];
        var checkBox = document.getElementById(reward);
        checkBox.addEventListener('change', function () {
            update();
        });
    }
    var otherCheckBox = document.getElementById("discarded");
    otherCheckBox.addEventListener('change', function () {
        update();
    });
}
function buildHeader() {
    document.getElementById("header").innerHTML = "\n        <div id=\"costs\" class=\"filters\">\n            <button type=\"button\" id=\"costsNone\" onclick=\"setAllCostsCheckboxes(false)\">None</button>\n            <button type=\"button\" id=\"costsAll\" onclick=\"setAllCostsCheckboxes(true)\">All</button>\n            <span>Costs:</span>\n            ".concat(buildCheckBoxes(costs), "\n        </div>\n        <div id=\"imports\" class=\"filters\">\n            <button type=\"button\" id=\"rewardsNone\" onclick=\"setAllImportsCheckboxes(false)\">None</button>\n            <button type=\"button\" id=\"rewardsAll\" onclick=\"setAllImportsCheckboxes(true)\">All</button>\n            <span>Imports:</span>\n            ").concat(buildCheckBoxes(imports), "\n        </div>\n        <div id=\"bonuses\" class=\"filters\">\n            <button type=\"button\" id=\"bonusesNone\" onclick=\"setAllBonusesCheckboxes(false)\">None</button>\n            <button type=\"button\" id=\"bonusesAll\" onclick=\"setAllBonusesCheckboxes(true)\">All</button>\n            <span>Bonus:</span>\n            ").concat(buildCheckBoxes(bonuses), "\n        </div>\n\n        <div id=\"other\" class=\"filters\">\n            <span>Other:</span>\n            ").concat(buildCheckBoxes(["discarded"]), "\n        </div>\n    ");
}
function setAllCostsCheckboxes(value) {
    for (var _i = 0, costs_2 = costs; _i < costs_2.length; _i++) {
        var filter = costs_2[_i];
        var checkBox = document.getElementById(filter);
        checkBox.checked = value;
    }
    update();
}
function setAllImportsCheckboxes(value) {
    for (var _i = 0, imports_1 = imports; _i < imports_1.length; _i++) {
        var filter = imports_1[_i];
        var checkBox = document.getElementById(filter);
        checkBox.checked = value;
    }
    update();
}
function setAllBonusesCheckboxes(value) {
    for (var _i = 0, bonuses_1 = bonuses; _i < bonuses_1.length; _i++) {
        var filter = bonuses_1[_i];
        var checkBox = document.getElementById(filter);
        checkBox.checked = value;
    }
    update();
}
function buildCheckBoxes(filters) {
    var result = "";
    for (var _i = 0, filters_1 = filters; _i < filters_1.length; _i++) {
        var filter = filters_1[_i];
        result += buildCheckBox(filter);
    }
    return result;
}
function buildCheckBox(filterKey) {
    var capitalized = filterKey[0].toUpperCase() + filterKey.slice(1);
    return "<span class=\"filterElement\"><input id=\"".concat(filterKey, "\" type=\"checkbox\" checked=\"checked\"/>\n        <label for=\"").concat(filterKey, "\">").concat(capitalized, "</label>\n        <span id=\"").concat(filterKey, "Count\"></span></span>");
}
function update() {
    var includedContracts = [];
    var excludedContracts = [];
    for (var _i = 0, contracts_2 = contracts; _i < contracts_2.length; _i++) {
        var contract = contracts_2[_i];
        if (isIncluded(contract, "")) {
            includedContracts.push(contract);
        }
        else {
            excludedContracts.push(contract);
        }
    }
    for (var _a = 0, costs_3 = costs; _a < costs_3.length; _a++) {
        var filter = costs_3[_a];
        var checkBox = document.getElementById(filter);
        if (checkBox.checked) {
            setIncludedFilterCounts(includedContracts, "costs", filter);
        }
        else {
            setExcludedFilterCounts(excludedContracts, "costs", filter);
        }
    }
    for (var _b = 0, rewards_2 = rewards; _b < rewards_2.length; _b++) {
        var filter = rewards_2[_b];
        var checkBox = document.getElementById(filter);
        if (checkBox.checked) {
            setIncludedFilterCounts(includedContracts, "rewards", filter);
        }
        else {
            setExcludedFilterCounts(excludedContracts, "rewards", filter);
        }
    }
    setDirectFilterCounts(contracts, "discarded");
    var includedContractsHtml = "";
    for (var _c = 0, includedContracts_1 = includedContracts; _c < includedContracts_1.length; _c++) {
        var included = includedContracts_1[_c];
        includedContractsHtml += generateContractHtml(included);
    }
    document.getElementById("included").innerHTML = includedContractsHtml;
    var excludedContractsHtml = "";
    for (var _d = 0, excludedContracts_1 = excludedContracts; _d < excludedContracts_1.length; _d++) {
        var excluded = excludedContracts_1[_d];
        excludedContractsHtml += generateContractHtml(excluded);
    }
    document.getElementById("excluded").innerHTML = excludedContractsHtml;
}
function setIncludedFilterCounts(contracts, subcategory, filterKey) {
    var count = 0;
    var sum = 0;
    for (var _i = 0, contracts_3 = contracts; _i < contracts_3.length; _i++) {
        var contract = contracts_3[_i];
        var value = contract[subcategory][filterKey];
        sum += value;
        if (value > 0) {
            count += 1;
        }
    }
    document.getElementById(filterKey + "Count").innerHTML = "(".concat(sum, " on ").concat(count, ")");
}
function setExcludedFilterCounts(contracts, subcategory, filterKey) {
    var count = 0;
    var sum = 0;
    for (var _i = 0, contracts_4 = contracts; _i < contracts_4.length; _i++) {
        var contract = contracts_4[_i];
        if (isIncluded(contract, filterKey)) {
            var value = contract[subcategory][filterKey];
            sum += value;
            if (value > 0) {
                count += 1;
            }
        }
    }
    document.getElementById(filterKey + "Count").innerHTML = "(+".concat(sum, " on ").concat(count, ")");
}
function setDirectFilterCounts(contracts, filter) {
    var count = 0;
    for (var _i = 0, contracts_5 = contracts; _i < contracts_5.length; _i++) {
        var contract = contracts_5[_i];
        if (contract[filter]) {
            count += 1;
        }
    }
    document.getElementById("discardedCount").innerHTML = "(".concat(count, ")");
}
function isIncluded(contract, ignoredCriteria) {
    var included = true;
    for (var _i = 0, costs_4 = costs; _i < costs_4.length; _i++) {
        var cost = costs_4[_i];
        if (cost == ignoredCriteria) {
            continue;
        }
        var checkBox = document.getElementById(cost);
        if (!checkBox.checked && (contract.costs[cost] > 0)) {
            included = false;
        }
    }
    for (var _a = 0, rewards_3 = rewards; _a < rewards_3.length; _a++) {
        var reward = rewards_3[_a];
        if (reward == ignoredCriteria) {
            continue;
        }
        var checkBox = document.getElementById(reward);
        if (!checkBox.checked && (contract.rewards[reward] > 0)) {
            included = false;
        }
    }
    if ("discarded" != ignoredCriteria
        && !document.getElementById("discarded").checked
        && contract.discarded) {
        included = false;
    }
    return included;
}
function generateContractHtml(contract) {
    var position = -(contract.id * 194);
    if (contract.discarded) {
        return "<div id=\"" + contract.id + "\" onclick=\"toggleDiscard(" + contract.id + ")\" class=\"contract\" style=\"background-position: " + position + "px 194px;\">X</div>";
    }
    else {
        return "<div id=\"" + contract.id + "\" onclick=\"toggleDiscard(" + contract.id + ")\" class=\"contract\" style=\"background-position: " + position + "px 194px;\"> </div>";
    }
}
function toggleDiscard(id) {
    for (var _i = 0, contracts_6 = contracts; _i < contracts_6.length; _i++) {
        var contract = contracts_6[_i];
        if (contract.id === id) {
            contract.discarded = !contract.discarded;
        }
    }
    update();
}
