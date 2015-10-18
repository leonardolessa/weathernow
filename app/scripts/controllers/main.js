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
      Weather.states().then(function(response) {
        var data = response.data;
        main.states = data.states;
        setState(main.currentState.initials);
        getInfo();
      });
      //should threat exceptions with the promise

    }

    function getInfo(data) {
        Weather.info(main.currentState, main.currentCity)
          .then(function(data) {
            main.forecast = data;
            getMinMax(data);
            getWeekend(data);
          }, function(err) {
            console.log(err);
          });
    }

    function getMinMax(data) {
      main.min = data.previsoes.reduce(function(prev, curr) {
        return prev.temperatura_min < curr.temperatura_min ? prev : curr;
      });

      main.max = data.previsoes.reduce(function(prev, curr) {
        return prev.temperatura_max > curr.temperatura_max ? prev : curr;
      });
    }

    function getWeekend(data) {

    }
  });
