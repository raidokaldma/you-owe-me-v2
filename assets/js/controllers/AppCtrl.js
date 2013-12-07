YouOweMeApp.controller('AppCtrl', function ($scope) {
    $scope.$on('event-name-changed', function(event, data) {
        var newTitle = 'You owe me';
        if (data) {
            newTitle += ' - ' + data;
        }
        $scope.title = newTitle;
    });
});