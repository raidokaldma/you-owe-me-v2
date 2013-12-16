YouOweMeApp.controller('AppCtrl', function ($scope, $location, $cookies) {
    $scope.$on('event-name-changed', function(event, data) {
        var newTitle = 'You owe me';
        if (data) {
            newTitle += ' - ' + data;
        }
        $scope.title = newTitle;
    });

    $scope.$on('$routeChangeSuccess', function () {
        if ($location.path() == '/action/last') {
            var rememberedKey = $cookies.rememberedKey;
            if (rememberedKey) {
                $location.path('/' + rememberedKey);
            }
            else {
                $location.path('/action/new');
            }
        }
    });
});