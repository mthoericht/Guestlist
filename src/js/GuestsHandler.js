'use strict';

var angularGuestListModule;
angularGuestListModule = angular.module('guestList', []);

//start server in Terminal: json-server --watch data/guests.json
var jsonURL                     = "http://localhost:3000";


var guestsControl = function($scope, $filter, $attrs)
{
    var jsonGuests                  = [];
    $scope.sortType     = 'firstName';  //default-Sort Type
    $scope.sortReverse  = false;
    $scope.searchGuest   = '';

    //Firstly load the Json from REST-Service
    $scope.init = function ()
    {
        $.getJSON(jsonURL + "/db", function (data) {
            jsonGuests = data;
            $scope.guests = jsonGuests;
            $scope.$apply();
        });
    };

    //Update the Checked-Status in the Database
    $scope.onClickGuestChecked = function($event, $guest)
    {
        //console.log("BAAM " + $guest.firstName);
        $.ajax(
            {
                type: "PUT",
                contentType: "application/json; charset=utf-8",
                url: jsonURL + "/post/" + $guest.id,
                data: JSON.stringify($guest),
                dataType: "json",

                complete: function (response, status, xhr)
                {
                    if(status === "success")
                    {
                        console.log("Check Update is Succeed!! ID: " + $guest.id);
                    }
                },

                error: function (response, status, error)
                {
                    alert('Check Update Error');
                    //addInSaveHoldingStack($index);
                }
            });
    };


    //Add new Guest
    $scope.submitGuest = function($guest)
    {
        //console.log("CLICK ADD GUEST NUM CHECKED IN " + guestsService.getNumOfCheckedInGuests(jsonGuests));
        console.log("ADD: " + $guest.firstName);

        //Auslagern (Service?)
        //-------------------------------
        var tmpLastUsedID   = 0;

        for(var i = 0; i < jsonGuests.length; i++)
        {
            if(jsonGuests[i].id > tmpLastUsedID)
            {
                tmpLastUsedID = jsonGuests[i].id;
            }
        }

        $guest.class = "guest";
        $guest.id = (tmpLastUsedID + 1);
        //-------------------------------

        jsonGuests.push($guest);

        $.ajax(jsonURL + '/posts',
            {
                method: 'POST',
                data: JSON.stringify($guest)
            }).then(function(data) {
                console.log(data);
            });

        //Clear Form
        $scope.guest={};
    };

    $scope.init();
};


var guestsService = function()
{
    this.getNumOfCheckedInGuests = function($jsonGuests)
    {
        return $.grep($jsonGuests, function(guest)
        {
            return guest.checked == true;
        }).length;
    };
};

angularGuestListModule.controller('GuestsControl', guestsControl);
//angularGuestListModule.service('GuestsService', guestsService);