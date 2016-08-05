var myFontApp = angular.module('myFontApp', ['ngRoute']);

myFontApp.config(['$routeProvider', function($routeProvider){

  $routeProvider
    .when('/home', {
      templateUrl:'views/home.html'
    })
    .when('/fonts', {
      templateUrl:'views/fonts.html',
      controller:'fontController'
    }).otherwise({
      redirectTo:'/home'
    });

}]);

myFontApp.controller('fontController', ['$scope', '$http', function($scope, $http){

  //check box filters - jquery dependent
  $scope.categoryIncludes = [];
  $scope.includeCategory = function(category) {
    var i = $.inArray(category, $scope.categoryIncludes);
    if (i > -1) {
        $scope.categoryIncludes.splice(i, 1);
    } else {
        $scope.categoryIncludes.push(category);
    }
  };
  $scope.categoryFilter = function(fonts) {
    popoutMatchFontsListHeight();
    if ($scope.categoryIncludes.length > 0) {
        if ($.inArray(fonts.category, $scope.categoryIncludes) < 0)
            return;
    }
    return fonts;
  };

  $http.get('data/fonts.json').success(function(data){
    $scope.fonts = data;
    //runs the script for writing the @font-face rule and classes for each font object
    data.forEach(createFontFamily);
    function createFontFamily(data) {
      var fontName = data.name;
      var otfPath = data.otfPath;
      var ttfPath = data.ttfPath;
      //locates style sheet of choice that is connected to the HTML page
      function getStyleSheet(unique_title) {
        for(var i=0; i<document.styleSheets.length; i++) {
          var sheet = document.styleSheets[i];
            if(sheet.title == unique_title) {
              return sheet;
          }
        }
      };
      //passes what style sheet to locate for later use
      var testCss = getStyleSheet('testcss');
      //Writes css rules on specified style sheet that creates font family and creates class for each font name that is passed in
      testCss.insertRule("."+ fontName +" {font-family: '"+ fontName +"';}", 0);
      testCss.insertRule("@font-face {font-family: '"+ fontName +"';src: url('"+ otfPath +"') format('opentype'),url('"+ ttfPath +"')  format('truetype');font-weight: normal;font-style: normal;}", 0);
    };
  });

  //maintains menu style as filters are sorting data
  var openfilter = document.querySelector(".popout");
  var openBtn = document.querySelector('.open_filterNav_btn');
  var quickSearchWrap = document.querySelector('.quick_search_wrap');
  var fontsList = document.querySelector('ul.directory.fonts_directory');

  var popoutMatchFontsListHeight = function(){
    var getFontsListHeight = document.querySelector('#fonts_content').clientHeight;
    openfilter.style.height = getFontsListHeight + 'px';
  };

  var quickSearchInput = document.querySelector('.quick_search').onkeyup = function() {popoutMatchFontsListHeight()};

  $scope.openFilters = function(){
    openfilter.style.left = "0";
    openBtn.style.cursor = "default";
    quickSearchWrap.style.left = "280px";
    fontsList.style.paddingLeft = "240px";
    popoutMatchFontsListHeight();
  };
  $scope.closeFilters = function(){
    openfilter.style.left = "-261px";
    openBtn.style.cursor = "pointer";
    quickSearchWrap.style.left = "150px";
    fontsList.style.paddingLeft = "0";
    popoutMatchFontsListHeight();
  };

  //quick font size changer
  var quickFontSize = document.getElementById('fontSizeDD');
  quickFontSize.onchange = function () {
    var fontBox = document.querySelectorAll(".font_name");
    var i;
    for (i = 0; i < fontBox.length; i++) {
        fontBox[i].style.fontSize = this.value +"%";
    }
    popoutMatchFontsListHeight();
  };

  //Mess with box functions
  $scope.messWithSize = function(){
    //find all font changing drop downs
    var messWithSize = document.querySelectorAll('.messWithSize'), i;
    for (i = 0; i < messWithSize.length; i++) {
      messWithSize[i].onchange = function(){
        //change all font sizes of the showcase box
        var showcaseBox = document.querySelectorAll('.showcase_text_area'), i;
        for (i = 0; i < showcaseBox.length; i++) {
          var setOption = this.value;
          showcaseBox[i].style.fontSize = setOption +"%";
          //also edit which option was chosen on each drop down
          messWithSize[i].value = setOption;
        };
      };
    };
  };

}]);
