var UserModel = Backbone.Model.extend({
    defaults: {
        uuid:'',
        name: '',
        password: '',
        token:'',
        longtitude:'',
        latitude:'',
        locationName:'',
        destination:''
    }
});

var LocationModel = Backbone.Model.extend({
    defaults: {
        uiid:'', 
        name: '',
        longtitude: '',
        latitude:'',
        comment:'',
        picurl:''
    }
});

var GlobalInfoModel = Backbone.Model.extend({
    defaults: {
        user: null, 
        locationList:[],
        locationListJson:null
    }
});

var globalInfo = new GlobalInfoModel();

globalInfo.set({user: new UserModel()});

/*var locationList = globalInfo.get("locationList");

globalInfo.get("user").set({name:"peter"});
locationList.push(new LocationModel());
locationList[0].set({name:"pairs"})

console.log(globalInfo.get("user").get("name"));
console.log(globalInfo.get("locationList")[0].get("name"));*/
