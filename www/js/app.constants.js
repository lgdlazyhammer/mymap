'use strict';

mymap.constant('constants', {
	
    operationServices: {
        uploadPicture:'http://120.25.102.53:8080/uploadpicture',
		login:'http://120.25.102.53:8080/loginapi',
		register:'http://120.25.102.53:8080/registerapi',
		uploadPersonPicture:'http://120.25.102.53:8080/uploadpersonpictureapi',
		addLocation:'http://120.25.102.53:8080/addlocationapi',
		addLocationPicture:'http://120.25.102.53:8080/addlocationpictureapi',
        getLocationList:'http://120.25.102.53:8080/getlocationlistapi',
        getLocationListSize:'http://120.25.102.53:8080/getlocationlistsizeapi'
    },
	
	notoperationServices:{
		uploadPicture:'/uploadpicture',
		login:'/loginapi',
		register:'/registerapi',
		uploadPersonPicture:'/uploadpersonpictureapi',
		addLocation:'/addlocationapi',
		addLocationPicture:'/addlocationpictureapi',
        getLocationList:'/getlocationlistapi',
        getLocationListSize:'/getlocationlistsizeapi'
	}
});