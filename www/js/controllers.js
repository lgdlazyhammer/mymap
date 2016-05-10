mymap.controller('AppCtrl', function($rootScope, $scope, $ionicModal, $timeout, LoginService, $cordovaFile) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
      
      LoginService.setParams($scope.loginData.username,$scope.loginData.password);
      LoginService.getData().then(function (data) {
          
				console.log(data.headers('connection'));
				//save the session id
				if(data.data.result == 'success'){
                    var temp_token = data.data.sessionId;
                    globalInfo.get("user").set({token:temp_token});
                    globalInfo.get("user").set({name:data.data.name});
                    globalInfo.get("user").set({personImgUrl:data.data.personImgUrl});
                    $rootScope.$broadcast('user-logged-in');
                    alert("login success token "+temp_token);
                    
                    console.log(globalInfo.get("user"));
                    var fileLocation = null;
                    var isIOS = ionic.Platform.isIOS();
                    var isAndroid = ionic.Platform.isAndroid();

                    if(isIOS){
                        fileLocation = cordova.file.documentsDirectory;
                    }

                    if(isAndroid){
                        fileLocation = cordova.file.externalDataDirectory;
                    }
                    $cordovaFile.checkFile(fileLocation, "mymap_token.txt")
                      .then(function (success) {
                        // success
                        $cordovaFile.writeFile(fileLocation, "mymap_token.txt", temp_token, true)
                          .then(function (success) {
                            // success
                            alert("save token : "+success);
                          }, function (error) {
                            // error
                            alert("write token fail!");
                          });
                        
                      }, function (error) {
                        // error
                        $cordovaFile.createFile(fileLocation, "mymap_token.txt", true)
                          .then(function (success) {
                            // success
                            $cordovaFile.writeFile(fileLocation, "mymap_token.txt", temp_token, true)
                              .then(function (success) {
                                // success
                                alert("save token: "+success);
                              }, function (error) {
                                // error
                                alert("write token fail!");
                              });
                          }, function (error) {
                            // error
                            alert("create token file fail!");
                          });
                      });
                    
                    $cordovaFile.checkFile(fileLocation, "mymap_picurl.txt")
                      .then(function (success) {
                        // success
                        $cordovaFile.writeFile(fileLocation, "mymap_picurl.txt", globalInfo.get("user").get("personImgUrl") , true)
                          .then(function (success) {
                            // success
                            alert("save image url : "+success);
                          }, function (error) {
                            // error
                            alert("write image url fail!");
                          });
                        
                      }, function (error) {
                        // error
                        $cordovaFile.createFile(fileLocation, "mymap_picurl.txt", true)
                          .then(function (success) {
                            // success
                            $cordovaFile.writeFile(fileLocation, "mymap_picurl.txt", globalInfo.get("user").get("personImgUrl") , true)
                              .then(function (success) {
                                // success
                                alert("save image url: "+success);
                              }, function (error) {
                                // error
                                alert("save image fail!");
                              });
                          }, function (error) {
                            // error
                            alert("create image link file fail!");
                          });
                      });
					
				}else{
                    alert("login failed error code "+data.status);
				}
				
			},function(){
          alert("login fialed, Please check your internet!");
      });

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($rootScope, $scope, GetLocationListService, $cordovaFile, $timeout) {
    
    $scope.location = {list:null};
    
    //$timeout(function(){$rootScope.$broadcast('initialize-app'); }, 1000);
    
    $scope.$on('initialize-app', function(event, args) {
        verifyAuthentication();
        console.log("initializing app");
    });
    
    function verifyAuthentication(){
        
        var isIOS = ionic.Platform.isIOS();
        var isAndroid = ionic.Platform.isAndroid();
        var fileLocation = null;

        if(isIOS){
            fileLocation = cordova.file.documentsDirectory;
        }

        if(isAndroid){
            fileLocation = cordova.file.externalDataDirectory;
        }
        // READ
        $cordovaFile.readAsText(fileLocation, "mymap_token.txt")
          .then(function (success) {
            // success
            alert("authentication success : "+success);
            globalInfo.get("user").set({token:success});
          }, function (error) {
            alert("your authentication is not valid, please login.")
          });
        
        // READ
        $cordovaFile.readAsText(fileLocation, "mymap_picurl.txt")
          .then(function (success) {
            // success
            alert("load picture success : "+success);
            globalInfo.get("user").set({personImgUrl:success});
            $rootScope.$broadcast('user-picurl-loaded');
          }, function (error) {
            alert("your picture url is not valid, please login.")
          });
    }
      
    $scope.getLocationList = function(){

        GetLocationListService.setParams(0);
        GetLocationListService.getData().then(function (data) {
                $scope.location.list = data.data.result;
                globalInfo.set({locationListJson:data.data.result});
                var temp = [];
                globalInfo.set({locationList:temp});
        },function(){});
    }
})
    
.controller('SearchCtrl', function($scope, $cordovaGeolocation, $ionicModal, $timeout) {
    
    var map = null;
    
    $scope.form = {display:false,start:null,destination:null};
    
    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/savelocation.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeSaveLocation = function() {
        $scope.modal.hide();
    };
    
    $scope.toggleSearchForm = function(){
        $scope.form.start = globalInfo.get("user").get('locationName');
        $scope.form.destination = globalInfo.get("user").get('destination');
        $scope.form.display = !$scope.form.display;
    };
    
    $scope.searchBusRoute = function(){
        //draw the bus route on map
        var transit = new BMap.TransitRoute(map, {    
         renderOptions: {map: map}    
        });    
        transit.search($scope.form.start, $scope.form.destination);
        $scope.form.display = false;
        
        var transit = new BMap.TransitRoute(map, {
            renderOptions: {map: map, panel: "r-result"}
        });
        transit.search($scope.form.start, $scope.form.destination);
    }
    
    $scope.resendPositionRequest = function(){
    
        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        
        $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          var lat  = position.coords.latitude
          var long = position.coords.longitude
          alert('latitude:'+lat +'longtitude:'+long);
          globalInfo.get("user").set({longtitude:long});
          globalInfo.get("user").set({latitude:lat});
            var myGeo = new BMap.Geocoder();      
            // 根据坐标得到地址描述    
            myGeo.getLocation(new BMap.Point(long, lat), function(result){      
                 if (result){
                     globalInfo.get("user").set({locationName:result.address});
                     alert(result.address+"has been set as current location.")
                  } 
            });
          
            var container = document.getElementById("baidumapcontainer");
            map = new BMap.Map(container);          // 创建地图实例 
            var point = new BMap.Point(long,lat);  // 创建点坐标  
            map.centerAndZoom(point, 15);                 // 初始化地图，设置中心点坐标和地图级别 
            
            var marker = new SquareOverlay(point, 15, "green"); 
            map.addOverlay(marker);
            
            var locationList = globalInfo.get("locationList");
            for(var i=0;i<locationList.length;i++){
                (function(i){
                    var tempLocation = locationList[i];
                    var point = new BMap.Point(tempLocation.longtitude,tempLocation.latitude);
                    var marker = new BMap.Marker(point);
                    function clickMarkerFunc(e){
                        globalInfo.get("user").set({destination:tempLocation.name});
                        alert(tempLocation.name+"has been set as local location.");
                        marker.removeEventListener("click", clickMarkerFunc);
                    }
                    marker.addEventListener("click",clickMarkerFunc);
                    map.addOverlay(marker);
                })(i);
            }
        
            /*var marker = new BMap.Marker(point);            
            marker.addEventListener("click", function(){ 
                //alert("latitude:"+position.coords.latitude+"  longtitude:"+position.coords.longitude);
                var opts = {    
                 width : 250,       
                 height: 100,        
                 title : "Position"  
                }    
                var infoWindow = new BMap.InfoWindow("latitude:"+position.coords.latitude+"  longtitude:"+position.coords.longitude, opts);   
                marker.openInfoWindow(infoWindow);    
            });
            map.addOverlay(marker);
        
            var point2 = new BMap.Point(121.527609999,31.2222144);
            var marker2 = new BMap.Marker(point2);
            map.addOverlay(marker2);
            
            // 创建地址解析器实例     
            var myGeo = new BMap.Geocoder();      
            // 将地址解析结果显示在地图上，并调整地图视野    
            myGeo.getPoint("巨峰路399弄1号", function(pointDecoded){      
                      if (pointDecoded) {     
                          console.log(pointDecoded);
                          console.log(pointDecoded.lng);
                          console.log(pointDecoded.lat);
                          var point2 = new BMap.Point(pointDecoded.lng,pointDecoded.lat);
                          console.log("point2 ---");
                          console.log(point2);
                          var marker2 = new BMap.Marker(point2);
                          console.log("marker2 ---");
                          console.log(marker2);
                          console.log("map ---");
                          console.log(map);
                            map.addOverlay(marker2);     
                      }      
                  }, "巨峰路399弄1号");*/
            
            
            
        
        }, function(err) {
          // error
        });
        
    };
    
    //define the record function
    $scope.recordPosition = function(){
        $scope.modal.show();
        var myGeo = new BMap.Geocoder();      
        // 根据坐标得到地址描述    
        myGeo.getLocation(new BMap.Point(globalInfo.get("user").get("longtitude"), globalInfo.get("user").get("latitude")), function(result){      
             if (result){
                 globalInfo.get("user").set({locationName:result.address});
                 alert(globalInfo.get("user").get('locationName')+" have been sent as local location.");
                 $scope.modal.show();
              } 
        });

    };
    
})

.controller('BrowseCtrl', function($scope, RegisterService) {
    
    $scope.registerData = {username:null, password:null, email:null, gender:null};
    
    $scope.doRegister = function(){
        RegisterService.setParams($scope.registerData.email,$scope.registerData.username,$scope.registerData.password,$scope.registerData.gender);
        RegisterService.getData().then(function (data) {
            alert("Register "+data.data.result);
        },function(){});
    }
})

.controller('SaveLocationCtrl', function($scope, AddLocationService) {
    
    $scope.current = {currentLocationName:null,currentLocationComment:null,picUrlContent:null};
    
    
    /*var tempLocationName = globalInfo.get("user").get('locationName');

    if(tempLocationName != null && tempLocationName != ""){
        $scope.current.currentLocationName = tempLocationName;
    }else{
        $scope.current.currentLocationName = "unset";
    }*/
    
    $scope.current.currentLocationComment = null;
    
    $scope.refreshLocationName = function(){
        $scope.current.currentLocationName = globalInfo.get("user").get('locationName')
    }
    
     //define the record function
    $scope.updatePositionDetail = function(){

        if(globalInfo.get("user").get('locationName') != null && globalInfo.get("user").get('locationName') != '' && globalInfo.get("user").get('locationName') != undefined){
            AddLocationService.setParams(globalInfo.get("user").get('locationName'), globalInfo.get("user").get('longtitude'), globalInfo.get("user").get('latitude'), $scope.current.currentLocationComment, "");
            AddLocationService.getData().then(function (data) {
                alert("Add Location "+data.data.result);
            },function(){});
        }else{
            alert("current location is not set!")
        }
       // 创建地理编码实例      
        /*var myGeo = new BMap.Geocoder();      
        // 根据坐标得到地址描述    
        myGeo.getLocation(new BMap.Point($cookies.get('currentLng'), $cookies.get('currentLat')), function(result){      
                         if (result){      
                             alert(result.address);  
                             
                                var transit = new BMap.TransitRoute(map, {    
                                 renderOptions: {map: map}    
                                });    
                                transit.search(result.address, "巨峰路399弄1号");
                          } });*/

    };
    
})

.controller('PlaylistCtrl', function($scope, $stateParams, $cordovaCamera, $ionicPopup, $cordovaFileTransfer, constants) {
    
    var tempDomain = "http://120.25.102.53:8080/";
    $scope.displayURI = [];
    $scope.current = { picUrlContent:"" };
    
    $scope.selectPicture = function(){
		
		var options = {
		    destinationType: Camera.DestinationType.FILE_URI,
		    sourceType: Camera.PictureSourceType.CAMERA,
		};

		$cordovaCamera.getPicture(options).then(function(imageURI) {
			//make display list
			var tempURI= {};
			tempURI['picurl'] = imageURI;
			$scope.displayURI.push(tempURI);

			var name = imageURI;
			if (name != null && name != '') {
				var i = name.lastIndexOf('/');
				name = name.substring(i + 1);
				if($scope.current.picUrlContent==null || $scope.current.picUrlContent==''){ $scope.current.picUrlContent += name; }else{ $scope.current.picUrlContent += ','+name;}
			}
			
			//display the made list
			$ionicPopup.alert({
				title: 'Selected Pictures',
				content: $scope.current.picUrlContent
				}).then(function(res) {
			});

		}, function(err) {
		});

	};
    
    function uploadPicture(uploadFileURI){
        
		var options = {
			fileKey: "file",
			fileName: uploadFileURI.substring(uploadFileURI.lastIndexOf('/')+1),
			chunkedMode: false,
			mimeType: "image/"+uploadFileURI.substring(uploadFileURI.lastIndexOf('/')+1).substring(uploadFileURI.substring(uploadFileURI.lastIndexOf('/')+1).lastIndexOf('.')+1),
			params: {
				headers: { 'Authorization': globalInfo.get("user").get("token"), 'locationid':$stateParams.playlistId }
			}
		};
						
		$cordovaFileTransfer.upload(constants.operationServices.addLocationPicture, uploadFileURI, options).then(function(result) {
            alert("upload succeed : "+ result);
		}, function(err) {
            alert("upload failed : "+err);
		}, function (progress) {
			// constant progress updates
		});
	}
    
    $scope.updatePicture = function(){
        
        for(var i=0;i<$scope.displayURI.length;i++){
            (function(i){
                alert($scope.displayURI[i].picurl);
                uploadPicture($scope.displayURI[i].picurl);
            })(i);
        }
        
    };
    
    console.log($stateParams.playlistId);
    
    console.log(globalInfo.get("locationListJson"));
    
    $scope.currentLocation = { info:null ,picArr:null ,localDomain:null };
    $scope.currentLocation.localDomain = tempDomain;
    var locationJsonList = globalInfo.get("locationListJson");
    
    
    for(var i=0;i<locationJsonList.length;i++){
        if($stateParams.playlistId == locationJsonList[i]._id){
            $scope.currentLocation.info = locationJsonList[i];
            $scope.currentLocation.picArr = parseArrayToJson($scope.currentLocation.info.picurl.split(","));   
            console.log(JSON.stringify($scope.currentLocation.info.picurl.split(",")));
        }
    }
    
    console.log($scope.currentLocation.info);
        
    function parseArrayToJson(arr){
        
        //var locationArr = '[';
        var locArr = [];
        
        for(var i=0;i<arr.length;i++){
            //var temp = '{"picurl":"'+arr[i]+'"},';
            //locationArr += temp;
            (function(i){
                var temp = { picurl: ''};
                temp.picurl = arr[i];
                locArr.push(temp);
                console.log(JSON.stringify(locArr));
            })(i);
            //locationArr.push(JSON.parse(temp));
        }
        //locationArr = locationArr.substring(0, locationArr.length - 1);
        //locationArr += ']';
              
        //return JSON.parse(locationArr);
        return locArr;
    }
})

.controller('UpdatePersonPictureCtrl', function($scope, $cordovaFile) {
    
    $scope.personInfo = {imgUrl:null,name:null};
    
    var tempDomain = "http://120.25.102.53:8080/";
    
    $scope.$on('user-logged-in', function(event, args) {
        init();
    });
    
    $scope.$on('user-picurl-loaded', function(event, args) {
        init();
    });
    
    function init(){
        
        $scope.personInfo.imgUrl = tempDomain + globalInfo.get("user").get("personImgUrl");
        $scope.personInfo.name = globalInfo.get("user").get("name");
        //globalInfo.get("user").get("personImgUrl");
        //globalInfo.get("user").get("name");
        console.log($scope.personInfo.imgUrl);
        console.log($scope.personInfo.name);
        
        var isIOS = ionic.Platform.isIOS();
        var isAndroid = ionic.Platform.isAndroid();
        var fileLocation = null;

        if(isIOS){
            fileLocation = cordova.file.documentsDirectory;
        }

        if(isAndroid){
            fileLocation = cordova.file.externalDataDirectory;
        }
        // READ
        $cordovaFile.readAsText(fileLocation, "mymap_token.txt")
          .then(function (success) {
            // success
            alert("authentication success : "+success);
            globalInfo.get("user").set({token:success});
          }, function (error) {
            alert("your authentication is not valid, please login.")
          });
        
        // READ
        $cordovaFile.readAsText(fileLocation, "mymap_picurl.txt")
          .then(function (success) {
            // success
            alert("picture url : "+success);
            $scope.personInfo.imgUrl = tempDomain + success;
          }, function (error) {
            alert("can not get your picture." + error);
          });
        
    };
    
})

.controller('UpdatePictureCtrl', function($scope, constants, $cordovaCamera, $cordovaFileTransfer) {
    
    $scope.person = {imgUrl:null};
    
    $scope.selectPicture = function(){
		
		var options = {
		    destinationType: Camera.DestinationType.FILE_URI,
		    sourceType: Camera.PictureSourceType.CAMERA,
		};

		$cordovaCamera.getPicture(options).then(function(imageURI) {
			//make display list
			$scope.person.imgUrl = imageURI;
			//display the made list
			$ionicPopup.alert({
				title: 'Selected Pictures',
				content: $scope.person.imgUrl
				}).then(function(res) {
			});

		}, function(err) {
		});

	}
    
    $scope.updatePersonPicture = function(){
        
        if(globalInfo.get("user").get("token") == null || globalInfo.get("user").get("token") == "" || globalInfo.get("user").get("token") == undefined){
            alert("please login first!");
        }else{
            uploadPicture($scope.person.imgUrl);
        }
    }
    
    function uploadPicture(uploadFileURI){
        
		var options = {
			fileKey: "file",
			fileName: uploadFileURI.substring(uploadFileURI.lastIndexOf('/')+1),
			chunkedMode: false,
			mimeType: "image/"+uploadFileURI.substring(uploadFileURI.lastIndexOf('/')+1).substring(uploadFileURI.substring(uploadFileURI.lastIndexOf('/')+1).lastIndexOf('.')+1),
			params: {
				headers: { 'Authorization': globalInfo.get("user").get("token") }
			}
		};
						
		$cordovaFileTransfer.upload(constants.operationServices.uploadPersonPicture, uploadFileURI, options).then(function(result) {
            alert("upload succeed : "+ result);
		}, function(err) {
            alert("upload failed : "+err);
		}, function (progress) {
			// constant progress updates
		});
	}
    
});
