YouOweMeApp.service('DataService', function($http, $timeout) {
    var that = this;
    var domain = 'http://mynodejs-hammertimeee.rhcloud.com/';
    var defaultData = {
        eventName: '',
        notes: '',
        names: [],
        rows: [{
            description: '',
            selection: {}
        }],
        dataIsNew: true
    };

    this.key = '';
    this.data = angular.copy(defaultData);

    var url = function() {
        return domain + that.key;
    };

    this.loadData = function() {
        var setData = function(loadedData) {
            that.data = loadedData;
        }
        return $http.get(url()).success(setData).error(this.resetData);

    };

    var storingInProgress = false;
    this.scheduleForStoring = function() {
        if (storingInProgress) {
            return;
        }
        var resetStoringState = function() {
            storingInProgress = false;
        }

        storingInProgress = true;

        $timeout(function() {
            storeData().finally(resetStoringState);
        }, 1000);

    };

    var storeData = function() {
        return $http.post(url(), that.data);
    };

    this.resetData = function() {
        that.data = angular.copy(defaultData);
    };
});