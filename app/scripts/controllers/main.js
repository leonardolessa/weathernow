'use strict';

/**
 * @ngdoc function
 * @name weatherApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the weatherApp
 */
angular.module('weatherApp')
  .controller('MainCtrl', function (Weather) {
    var main = this;

    main.setState = setState;
    main.getInfo = getInfo;
    main.currentCity = 'Blumenau';
    main.currentState = 'SC';

    getStates();

    function setState(value) {
      var initials = value ? value : main.currentState;
      var len = main.states.length;

      for(var i = 0; i < len; i++) {
        if (main.states[i].initials === initials) {
          return main.activeState = main.states[i];
        }
      }
    }

    function getStates() {
      Weather.states().success(function(data) {
        main.states = data.states;
        setState(main.currentState.initials);
      }).then(function() {
        getInfo();
      });
    }

    function getInfo(data) {
        Weather.info(main.currentState, main.currentCity)
          .success(function(data) {
            main.forecast = data;
            console.log(data);
          });
    }
  });
