YouOweMeApp.controller('MainCtrl', function ($scope, $rootScope, $location, $route, DataService, CalculationService) {
    $scope.data = DataService.data;
    $scope.formData = {
        newName: ''
    };
    $scope.firstLoadDone = false;
    $scope.dataIsNew = true; //For avoiding data storage on data load

    var emptyRow = {
        description: '',
        selection: {}
    };

    $scope.addName = function () {
        $scope.data.names.push($scope.formData.newName);
        delete $scope.formData.newName
    };

    $scope.removeName = function (name) {
        $scope.data.names.splice($scope.data.names.indexOf(name), 1);
        angular.forEach($scope.data.rows, function (row) {
            if (angular.equals(row.payer, name)) {
                delete row.payer;
            }

            delete row.selection[name];
        });
    }

    $scope.addRow = function() {
        var newRow = angular.copy(emptyRow);
        angular.forEach($scope.data.names, function (name) {
            newRow.selection[name] = true;
        });

        // Remembering payer's name
        if ($scope.data.rows.length) {
            newRow.payer = $scope.data.rows[$scope.data.rows.length - 1].payer;
        }

        $scope.data.rows.push(newRow);
    };

    $scope.removeRow = function (row) {
        var index = $scope.data.rows.indexOf(row);
        $scope.data.rows.splice(index, 1);

        if ($scope.data.rows.length == 0) {
            $scope.addRow();
        }
    };

    var loadData = function() {
        var setData = function(data) {
            $scope.data = DataService.data;
            $scope.dataIsNew = true;
            $scope.firstLoadDone = true;
        }

        DataService.loadData().finally(setData);
    }

    $scope.$on('$routeChangeSuccess', function (angularEvent, current, previous) {
        var currentId = current.pathParams.id;
        $scope.key = currentId;
        DataService.key = $scope.key;

        var previousId = previous && previous.pathParams && previous.pathParams.id;
        if (currentId && currentId !== previousId) {
            loadData();
        }
    });

    $scope.$watch('data', function(newValue, oldValue) {
        if ($scope.dataIsNew) {
            delete $scope.dataIsNew;
            return;
        }
        DataService.scheduleForStoring();
    }, true);

    $scope.$watch('data.rows', function () {
        $scope.totalExpensesPerPerson = CalculationService.calcTotalExpensesPerPerson();
        $scope.payments = CalculationService.calcPayments();
    }, true);

    $scope.$watch('formData.newName', function(newName) {
        var isUnique = $scope.data.names.indexOf(newName) === -1;
        $scope.newNameUnique = isUnique;
        $scope.newNameValid = newName && isUnique;
    });

    $scope.$watch('data.eventName', function (eventName) {
        $scope.$emit('event-name-changed', eventName);
    });


});