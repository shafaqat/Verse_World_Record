(function (ng) {
  "use strict";
  var flagDirectiveConstructor = function flagDirectiveConstructorF() {
    var linker, template;
    template = [
      '<span class="f{{size}}">',
        '<span class="flag {{country}}"></span>',
      '</span>'
    ].join('');
    linker = function linkerF(iScope) {
      var watchCountry = function (newValues, oldValues) {
        if (newValues[0] !== oldValues[0]) {
          iScope.size = newValues[0];
        }
        if (newValues[1] !== newValues[0]) {
          iScope.country = angular.lowercase(newValues[1]);
        }
      };
      iScope.size = 16;
      iScope.$watchGroup(['size', 'country'], watchCountry);
    };
    return {
      restrict: 'E',
      replace:  true,
      link:     linker,
      template: template,
      scope:    {size: '@', country: '@'}
    };
  };
  ng.module('ykDropdownFlag', [])
    .directive('ykDropdownFlag', flagDirectiveConstructor);
}(angular));
