'use strict';

/**
 * @ngdoc directive
 * @name weatherApp.directive:LineChart
 * @description
 * # LineChart
 */
angular.module('weatherApp')
  .directive('lineChart', function () {
    return {
      restrict: 'A',
      scope: {
          lineData: '=',
          lineXkey: '@',
          lineYkeys: '=',
          lineLabels: '=',
          lineColors: '='
      },
      link: function(scope, elem) {
          scope.$watch('lineData', function() {
              if (scope.lineData) {
                  if (typeof scope.lineData === 'string')
                      scope.lineData = JSON.parse(scope.lineData);
                  if (typeof scope.lineYkeys === 'string')
                      scope.lineYkeys = JSON.parse(scope.lineYkeys);
                  if (typeof scope.lineYkeys === 'string')
                      scope.lineYkeys = JSON.parse(scope.lineYkeys);
                  if (typeof scope.lineLabels === 'string')
                      scope.lineLabels = JSON.parse(scope.lineLabels);
                  if (typeof scope.lineColors === 'string')
                      scope.lineColors = JSON.parse(scope.lineColors);
                  if (!scope.lineInstance) {
                      scope.lineInstance = new Morris.Line({
                          element: elem,
                          data: scope.lineData,
                          xkey: scope.lineXkey,
                          ykeys: scope.lineYkeys,
                          labels: scope.lineLabels,
                          resize: true,
                          postUnits: 'ºC',
                          lineColors: scope.lineColors || ['#0b62a4', '#7a92a3', '#4da74d', '#afd8f8', '#edc240', '#cb4b4b', '#9440ed'],
                          xLabelFormat: function(date) {
                            return format(date);
                          },
                          dateFormat: function(date) {
                            return format(date);
                          }
                      });
                  } else {
                      scope.lineInstance.setData(scope.lineData);
                  }
              }
          });

          function format(value) {
            var date;

            if (date instanceof Date) {
              date = value;
            } else {
              date = new Date(value);
            }

            return ("0" + date.getDate()).slice(-2) + '/' + ("0" + (date.getMonth() + 1)).slice(-2);
            // ugly trick to always display day and month with two digits
          }
      }
  }
  });
