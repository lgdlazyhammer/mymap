mymap.factory('LoginService', function ($q, $http, constants) {
	
	var user_name, user_password;
    //#region Common WS Retry functionality
    function doGetQuery(deferred, URL, counter) {
		
		var req = {
		 method: 'POST',
		 url: URL,
		 headers: {
		   'Content-Type': 'multipart',
		   'Authorization': globalInfo.get("user").get("token")
		 },
		 data: { name: user_name, password:user_password }
		};
		$http(req).then(function(data, status, headers, config){ deferred.resolve(data, status, headers, config); }
		,function(data, status){
			if (counter < 1) {
                    counter++;
                    doGetQuery(deferred, url, counter);
                } else {
                    deferred.reject(data, status, headers, config);
                    //$ionicLoading.hide();
                }
			}
		);
		
    }

	function makeUrl() {
        return constants.operationServices.login;
    }

    return {
		setParams: function(NAME, PASSWORD){
			user_name = NAME;
			user_password = PASSWORD;
		},
        getData: function () {
            //get eid based on pnum from api
            var deferred = $q.defer();
            doGetQuery(deferred, makeUrl(), 1);
            return deferred.promise;
        }
    };

})

.factory('RegisterService', function ($q, $http, constants) {
	
	var user_email, user_name, user_password, user_gender, user_picture;
    //#region Common WS Retry functionality
    function doGetQuery(deferred, URL, counter) {
		
		var req = {
		 method: 'POST',
		 url: URL,
		 headers: {
		   'Content-Type': 'multipart'
		 },
		 data: { email: user_email, name: user_name, password: user_password, gender: user_gender}
		};
		$http(req).then(function(data){ deferred.resolve(data); }, function(data){
			if (counter < 1) {
                    counter++;
                    doGetQuery(deferred, url, counter);
                } else {
                    deferred.reject({ data: data, status: status });
                    //$ionicLoading.hide();
                }
			}
		);
		
    }

    function makeUrl() {
        return constants.operationServices.register;
    }

    return {
		setParams: function(EMAIL, NAME, PASSWORD, GENDER){
			user_email = EMAIL;
			user_name = NAME;
			user_password = PASSWORD;
			user_gender = GENDER;
		},
        getData: function () {
            //get eid based on pnum from api
            var deferred = $q.defer();
            doGetQuery(deferred, makeUrl(), 1);
            return deferred.promise;
        }
    };

})

.factory('AddLocationService', function ($q, $http, constants) {
	
	var location_name, location_longtitude,location_latitude,location_comment,location_picurl;
    //#region Common WS Retry functionality
    function doGetQuery(deferred, URL, counter) {
		
		var req = {
		 method: 'POST',
		 url: URL,
		 headers: {
		   'Content-Type': 'multipart',
		   'Authorization': globalInfo.get("user").get("token")
		 },
		 data: { name: location_name, longtitude: location_longtitude, latitude: location_latitude, comment:location_comment, picurl:location_picurl }
		};
		$http(req).then(function(data){ deferred.resolve(data); }, function(data){
			if (counter < 1) {
                    counter++;
                    doGetQuery(deferred, url, counter);
                } else {
                    deferred.reject({ data: data, status: status });
                    //$ionicLoading.hide();
                }
			}
		);
		
    }

    function makeUrl() {
        return constants.operationServices.addLocation;
    }

    return {
		setParams: function(NAME, LONGTITUDE, LATITUDE, COMMENT, PICURL){
			location_name = NAME;
			location_longtitude = LONGTITUDE;
			location_latitude = LATITUDE;
            location_comment = COMMENT;
			location_picurl = PICURL;
		},
        getData: function () {
            //get eid based on pnum from api
            var deferred = $q.defer();
            doGetQuery(deferred, makeUrl(), 1);
            return deferred.promise;
        }
    };

})

.factory('GetLocationListService', function ($q, $http, constants) {
	
	var number_start;
    //#region Common WS Retry functionality
    function doGetQuery(deferred, URL, counter) {
		console.log(globalInfo.get("user").get("token"));
		var req = {
		 method: 'POST',
		 url: URL,
		 headers: {
		   'Content-Type': 'multipart',
		   'Authorization': globalInfo.get("user").get("token")
		 },
		 data: { start: number_start }
		};
		$http(req).then(function(data){ deferred.resolve(data); }, function(data){
			if (counter < 1) {
                    counter++;
                    doGetQuery(deferred, url, counter);
                } else {
                    deferred.reject({ data: data, status: status });
                    //$ionicLoading.hide();
                }
			}
		);
		
    }

    function makeUrl() {
        return constants.operationServices.getLocationList;
    }

    return {
		setParams: function(START){
			number_start = START;
		},
        getData: function () {
            //get eid based on pnum from api
            var deferred = $q.defer();
            doGetQuery(deferred, makeUrl(), 1);
            return deferred.promise;
        }
    };

})

.factory('GetLocationListSizeService', function ($q, $http, constants) {
	
    //#region Common WS Retry functionality
    function doGetQuery(deferred, URL, counter) {
		
		var req = {
		 method: 'POST',
		 url: URL,
		 headers: {
		   'Content-Type': 'multipart',
		   'Authorization': globalInfo.get("user").get("token")
		 },
		 data: {}
		};
		$http(req).then(function(data){ deferred.resolve(data); }, function(data){
			if (counter < 1) {
                    counter++;
                    doGetQuery(deferred, url, counter);
                } else {
                    deferred.reject({ data: data, status: status });
                    //$ionicLoading.hide();
                }
			}
		);
		
    }

    function makeUrl() {
        return constants.operationServices.getLocationListSize;
    }

    return {
        getData: function () {
            //get eid based on pnum from api
            var deferred = $q.defer();
            doGetQuery(deferred, makeUrl(), 1);
            return deferred.promise;
        }
    };

})

.factory('GetSpecifyLocationService', function ($q, $http, constants) {
	
	var location_id;
	
    //#region Common WS Retry functionality
    function doGetQuery(deferred, URL, counter) {
		
		var req = {
		 method: 'POST',
		 url: URL,
		 headers: {
		   'Content-Type': 'multipart'
		 },
		 data: { locationid: location_id }
		};
		$http(req).then(function(data){ deferred.resolve(data); }, function(data){
			if (counter < 1) {
                    counter++;
                    doGetQuery(deferred, url, counter);
                } else {
                    deferred.reject({ data: data, status: status });
                    //$ionicLoading.hide();
                }
			}
		);
		
    }

    function makeUrl() {
        return constants.operationServices.getSpecifyLocation;
    }

    return {
		setParams: function(LOCATIONID){
			location_id = LOCATIONID;
		},
        getData: function () {
            //get eid based on pnum from api
            var deferred = $q.defer();
            doGetQuery(deferred, makeUrl(), 1);
            return deferred.promise;
        }
    };

});