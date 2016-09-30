app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'indexCtrl',
            templateUrl: 'pages/start.html'
        })
        .when('/learn', {
            controller: 'learnCtrl',
            templateUrl: 'pages/learn.html'
        })
        .when('/game', {
            controller: 'gameCtrl',
            templateUrl: 'pages/game.html'
        })
        .when('/word-manager', {
            controller: 'managerCtrl',
            templateUrl: 'pages/manager.html'
        })
        .when('/sign_up', {
            controller: 'createUserCtrl',
            templateUrl: 'pages/sign_up.html'
        })
        .when('/sign_in', {
            controller: 'signInCtrl',
            templateUrl: 'pages/sign_in.html'
        })
        .when('/add_word', {
            controller: 'addWordCtrl',
            templateUrl: 'pages/add_word.html'
        })
        .when('/add_category', {
            controller: 'addCategoryCtrl',
            templateUrl: 'pages/add_category.html'
        })
        .when('/edit_word/:id', {
            controller: 'editWordCtrl',
            templateUrl: 'pages/add_word.html'
        })
        .when('/edit_category/:id', {
            controller: 'editCategoryCtrl',
            templateUrl: 'pages/add_category.html'
        })
        .otherwise({
            template: '<h1>Not Found</h1>'
        });
});

app.controller('appCtrl', ["$scope",
    function ($scope) {

    }]);

app.controller('indexCtrl', function ($scope) {
    $scope.time = new Date();

    // sprawdz ilość słówek
    //      jeśli zero dodaj info o dodaniu jakichś i utwórz kategorię main


});

app.controller('gameCtrl', function ($scope) {

});

app.controller('learnCtrl', ["$scope", "dataAccess", "gameConfiguration",
    function ($scope, dataAccess, gameConfiguration) {
        /*$scope.page = 'select games mode';

        $scope.gameConfiguration = gameConfiguration;
        $scope.categories = dataAccess.connectArray('categories');

        // pobiera liczbę wszystkich wyrazów
        var list = dataAccess.connectArray('words');
        list.$loaded()
            .then(function () {
                gameConfiguration.allWordsNumber = list.length;
            });
        /////////////////////////////////////

        $scope.startGame = function () {
            gameConfiguration = $scope.gameConfiguration;
            $scope.page = 'running game';
        };

        $scope.setCategory = function (val) {
            $scope.gameConfiguration.category = val;
        };

        $scope.getCategory = function()
        {
            if(!$scope.gameConfiguration.category)
                return "Select category";
            else
                return $scope.gameConfiguration.category.categoryName;
        }*/

    }
]);

app.controller('managerCtrl', ["$scope", "dataAccess", "selectedItem", "managerModel",
    function ($scope, dataAccess, selectedItem, managerModel) {

        /*$scope.managerModel = managerModel;

        $scope.words = dataAccess.connectArray('words');
        $scope.categories = dataAccess.connectArray('categories');

        $scope.getCategory = function (index) {
            if ($scope.categories.$getRecord(index))
                return $scope.categories.$getRecord(index).categoryName;
            return 'empty';
        };*/

// jesli nie ma slowek wyswietl liste kategorii

        $scope.deleteWord = function (index) {
            var item = $scope.words[index];
            $scope.words.$remove(item);
        };

        $scope.deleteCategory = function (index) {
            var item = $scope.categories[index];
            $scope.categories.$remove(item);
        };

        $scope.editWord = function (item) {
            selectedItem = item;
        };
    }
])
;

app.controller("createUserCtrl", ["$scope", "Auth", function ($scope, Auth) {
    $scope.info = "Sign up";

    $scope.createUser = function () {
        Auth.$createUserWithEmailAndPassword(
            $scope.email,
            $scope.password
        ).then(function (userData) {
            console.log("User " + userData.uid + " created successfully!");
        }).then(function (authData) {
            console.log("Logged in as:", authData.uid);
        }).catch(function (error) {
            console.error("Error: ", error);
        });
    };

}
]);

app.controller('signInCtrl', ["$scope", "Auth", function ($scope, Auth) {
    $scope.info = "Login";

    $scope.isLogged = function () {
        var authData = Auth.$getAuth();

        console.log(authData);

        if (authData) {
            console.log("Logged in as:", authData.email);
        } else {
            console.log("Logged out");
        }
    };


    $scope.loggIn = function () {
        Auth.$signInWithEmailAndPassword($scope.email, $scope.password).then(function (authData) {
            console.log("Logged in as:", authData.email);
        }).catch(function (error) {
            console.error("Authentication failed:", error);
        });
    };

    $scope.loginFromGoogle = function () {
        Auth.$signInWithPopup("google").then(function (authData) {
            console.log("Logged in as:", authData.email);
        }).catch(function (error) {
            console.error("Authentication failed:", error);
        });
    };

    $scope.loginFromFacebook = function () {
        Auth.$signInWithPopup('facebook').then(function (authData) {
            console.log("Logged in as:", authData);
        }).catch(function (error) {
            console.error("Authentication failed:", error);
        });
    };
}]);

app.controller('addWordCtrl', ["$scope", "dataAccess", "alert",
    function ($scope, dataAccess, alert) {

        var alertComp = alert.setText("Word added succesfully!");

        $scope.categories = dataAccess.connectArray('categories');

        $scope.saveWord = function () {

            console.log($scope.categorySelected);

            if (!$scope.categorySelected) {
                // todo: alert z Select category!
                console.log('categorySelected:' + $scope.categorySelected);
            }
            else {
                var list = dataAccess.connectArray('words');

                var wordObj =
                {
                    first: $scope.first,
                    second: $scope.second,
                    refresh: 0,
                    win: 0,
                    lost: 0,
                    category: $scope.categorySelected.$id,
                    data_added: Math.round(new Date().getTime())
                };

                list.$add(wordObj).then(function (ref) {

                    $scope.first = '';
                    $scope.second = '';
                    $scope.category = $scope.categorySelected;
                    alertComp.show();

                    console.log(ref);

                }, function (error) {
                    console.log("Error:", error);
                });
            }
        };

        $scope.setCategory = function (val) {
            $scope.categorySelected = val;
            console.log($scope.categorySelected);
        };

        $scope.getCategory = function () {
            if (!$scope.categorySelected)
                $scope.categorySelected.categoryName = CATEGORY_TITLE;
        };
    }
]);
app.controller('addCategoryCtrl', ["$scope", "alert", "dataAccess",
    function ($scope, alert, dataAccess) {

        var alertComp = alert.setText("Category added succesfully.");

        $scope.saveCategory = function () {

            var list = dataAccess.connectArray('categories');

            var categoryObj = {
                categoryName: $scope.category
            };

            list.$add(categoryObj).then(function (ref) {
                $scope.category = '';
                alertComp.show();
            });
        };
    }]
);

app.controller('editWordCtrl', ["$scope", "$routeParams", "dataAccess", "alert",
    function ($scope, $routeParams, dataAccess, alert) {

        $scope.categories = dataAccess.connectArray('categories');

        var alertComp = alert.setText("Word updated succesfully.");

        var word = {};
        var id = $routeParams.id;
        var list = dataAccess.connectArray('words');

        list.$loaded()
            .then(function (x) {
                word = list[id];

                $scope.first = word.first;
                $scope.second = word.second;
                $scope.category = $scope.categorySelected;
            });

        $scope.saveWord = function () {
            if (!$scope.categorySelected) {
                // todo: alert z Select category!
                console.log('categorySelected:' + $scope.categorySelected);
            }
            else {
                word.first = $scope.first;
                word.second = $scope.second;
                word.category = $scope.categorySelected.$id;

                list[id] = word;

                list.$save(word).then(function (ref) {
                    alertComp.show();
                }).catch(function (error) {
                    console.error("updated failed:", list);
                });
            }
        };

        $scope.setCategory = function (val) {
            $scope.categorySelected = val;
        };

        $scope.getCategory = function () {
            if (!$scope.categorySelected)
                $scope.categorySelected = CATEGORY_TITLE;
        };

    }]
);
app.controller('editCategoryCtrl', ["$scope", "$routeParams", "dataAccess", "alert",
    function ($scope, $routeParams, dataAccess, alert) {

        var alertComp = alert.setText("Category updated succesfully.");

        var category = {};
        var id = $routeParams.id;
        var listOfCategories = dataAccess.connectArray('categories');

        listOfCategories.$loaded()
            .then(function (x) {
                category = listOfCategories[id];
                console.log(listOfCategories);
                $scope.category = category.categoryName;
            });

        $scope.saveCategory = function () {
            category.categoryName = $scope.category;
            listOfCategories[id] = category;

            listOfCategories.$save(category).then(function (ref) {
                alertComp.show();
            }).catch(function (error) {
                console.error("updated failed:", listOfCategories);
            });
        }

    }]
);