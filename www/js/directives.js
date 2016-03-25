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
});