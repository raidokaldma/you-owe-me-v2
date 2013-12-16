YouOweMeApp.service('DataService', function($http, $timeout) {
    var that = this;
    var domain = 'http://key-value-store.hammertime.ee/';
    var defaultData = {
        eventName: '',
        notes: '',
        names: [],
        rows: [{
            description: '',
            selection: {}
        }]
    };

    this.key = '';
    this.data = angular.copy(defaultData);

    var url = function() {
        return domain + that.key;
    };

    this.rememberKey = function() {
        //Won't work, if key contains "=" or ";"
        document.cookie = "rememberedKey=" + that.key + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
    };

    this.loadData = function() {
        var setData = function(loadedData) {
            that.data = loadedData;
            that.rememberKey();
        };
        return $http.get(url()).success(setData).error(this.resetData);
    };

    var storingInProgress = false;
    this.scheduleForStoring = function() {
        if (storingInProgress) {
            return;
        }
        var resetStoringState = function() {
            storingInProgress = false;
        };

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