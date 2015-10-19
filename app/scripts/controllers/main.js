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
    main.getForecast = getForecast;
    main.toggleStorage = toggleStorage;

    getDefaultOptions();
    getStates();

    function setState(value) {
      var initials = value ? value : main.location.state;
      var len = main.states.length;

      for(var i = 0; i < len; i++) {
        if (main.states[i].initials === initials) {
          return main.activeState = main.states[i];
        }
      }
    }

    function getDefaultOptions() {
      main.location = Weather.defaultOptions();
    }

    function getStates() {
      Weather.states().then(function(response) {
        var data = response.data;
        main.states = data.states;
        setState(main.location.state);
        getForecast();
      });
      //should threat exceptions with the promise

    }

    function getForecast(data) {
        main.location.remember = Weather.checkData(main.location);

        if (!main.location.city) {
          return;
        }

        Weather.forecast(main.location.state, main.location.city)
          .then(function(data) {
            main.forecast = data;
            //get minMax widget data
            main.minMax = Weather.minMax(data.previsoes);
            //get weekend widget data
            main.weekend = Weather.weekend(data.previsoes);
            //get chart widget data
            main.chart = Weather.chart(data.previsoes);
          }, function(err) {

          });
    }

    function toggleStorage(remember) {
      Weather.toggle(main.location, remember);
    }
  });
