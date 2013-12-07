YouOweMeApp.service('CalculationService', function(DataService) {
    this.calcTotalExpensesPerPerson = function() {
        _calcTotalExpensesPerPerson();
    }

    this.calcPayments = function () {
        var depts = calcDepts();
        var payers = depts.payers;
        var receivers = depts.receivers;
        var result = [];

        angular.forEach(payers, function (payer) {
            if (payer.dept !== 0) {
                angular.forEach(receivers, function (receiver) {
                    if (payer.dept !== 0 && receiver.amount !== 0) {
                        var toBePaid = Math.min(payer.dept, receiver.amount);
                        result.push({payer: payer.name, receiver: receiver.name, pays: toBePaid});
                        payer.dept -= toBePaid;
                        receiver.amount -= toBePaid;
                    }
                });
            }
        });

        return result;
    };

    var calcDepts = function () {
        var result = { payers: [], receivers: []};
        var paidTotals = calcTotalPaidPerPerson();
        var totalExpenses = _calcTotalExpensesPerPerson();

        angular.forEach(DataService.data.names, function (name) {
            var personPaid = paidTotals[name] || 0;
            var totalExpensesPerPerson = totalExpenses[name] || 0;
            var dept = totalExpensesPerPerson - personPaid;

            if (dept > 0) {
                result.payers.push({name: name, dept: dept});
            }
            else if (dept < 0) {
                var amount = -dept;
                result.receivers.push({name: name, amount: amount});
            }
        });

        return result;
    };

    var calcTotalPaidPerPerson = function () {
        var result = {};
        angular.forEach(DataService.data.names, function (name) {
            var totalPaid = 0;
            angular.forEach(DataService.data.rows, function (row) {
                if (row.payer === name) {
                    var hasAnySelected = !!countSelected(row);
                    if (hasAnySelected) {
                        totalPaid += row.cost || 0;
                    }
                }
            });
            result[name] = totalPaid;
        });
        return result;
    };

    var _calcTotalExpensesPerPerson = function () {
        var result = {};
        angular.forEach(DataService.data.names, function (name) {
            result[name] = total(name);
        });
        return result;
    }

    var total = function (name) {
        var total = 0;
        calcCostMatrix().forEach(function (row) {
            total += row[name];
        });
        return total;
    };

    var calcCostMatrix = function () {
        var rows = [];
        angular.forEach(DataService.data.rows, function (dataRow) {
            if (!dataRow.payer) {
                return;
            }

            var cost = costPerPerson(dataRow);
            var costRow = {};
            angular.forEach(DataService.data.names, function (name) {
                var selected = dataRow.selection[name];
                costRow[name] = selected ? cost : 0;
            });
            rows.push(costRow);
        });
        return rows;
    };

    var costPerPerson = function (row) {
        var selected = countSelected(row);
        return row.cost / selected || 0;
    };

    var countSelected = function (row) {
        var count = 0;
        angular.forEach(DataService.data.names, function (name) {
            count += row.selection[name] ? 1 : 0;
        });
        return count;
    };
});