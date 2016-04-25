mymap.directive('popuppicture', function ($ionicModal) {

    return {
        restrict: 'A',
        replace: false,
        scope: false,
		controller: function($scope, $element, $attrs){
			
			function openPopupPicture(){
				
				$ionicModal.fromTemplateUrl('templates/popuppicture.html', {
					scope: $scope,
					animation: 'slide-in-up'
					}).then(function(modal) {
					$scope.PopupModal = modal;
					$scope.popPicture = $attrs.src;
					$scope.PopupModal.show();
					//login close function
					$scope.closePopupModal = function(){
					$scope.PopupModal.hide();
					};
			    });
			};
			
			$element.on('click', function(event) {
				// Prevent default dragging of selected content
				console.log('elment on click.');
				openPopupPicture();
				
			});  
			
			/*$element.on('ondblclick', function(event) {
				// Prevent default dragging of selected content
				event.preventDefault();
				modalInstance.close();
			});*/

        },
        link: function (scope, element, attrs) {
        }
    };
})

.directive('selectlocation', function () {

    return {
        restrict: 'A',
        replace: false,
        scope: false,
		controller: function($scope, $element, $attrs){
			
			$element.on('click', function(event) {
				// Prevent default dragging of selected content
				console.log('elment on click.'+$attrs.value);
                console.log($element[0].checked);
                
                var locationJsonList = globalInfo.get("locationListJson");
                var locationListTemp = globalInfo.get("locationList");
    
                if($element[0].checked){
                    for(var i=0;i<locationJsonList.length;i++){
                        if($attrs.value == locationJsonList[i]._id){
                            locationListTemp.push(locationJsonList[i]);
                        }
                    }
                }else{
                    for(var i=0;i<locationListTemp.length;i++){
                        if($attrs.value == locationListTemp[i]._id){
                            locationListTemp.splice(i,1);  
                        }
                    }
                }
                        console.log(locationListTemp)
                
                globalInfo.set({locationList:locationListTemp});
                
			});  
			
			/*$element.on('ondblclick', function(event) {
				// Prevent default dragging of selected content
				event.preventDefault();
				modalInstance.close();
			});*/

        },
        link: function (scope, element, attrs) {
        }
    };
});