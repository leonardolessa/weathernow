'use strict';

/**
 * @ngdoc directive
 * @name weatherApp.directive:loading
 * @description
 * # loading
 */
angular.module('weatherApp')
  .directive('loading', function ($http) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.isLoading = function() {
          return $http.pendingRequests.length > 0;
        };

        scope.$watch(scope.isLoading, function (value) {
            if (value) {
              element.show();
            } else {
              element.hide();
            }
        })
      }
    };
  });
