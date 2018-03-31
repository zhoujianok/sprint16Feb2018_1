var app = angular.module('expApp', ['datatables', 'angularUtils.directives.dirPagination']);

app.service("SharedProperties", function () {
    var _userName = null;
    var _userRole = null;

    return {
        getUser: function () {
            return _userName
        },
        getRole: function () {
            return _userRole
        },
        setUserData: function (userData) {
            _userName = userData.username;
            _userRole = userData.role;
            // localStorage.clear();
        },
        clearUserData: function (userData) {
            _userName = null;
            _userRole = null;
            // localStorage.clear();
        }
    }
});

app.controller('userController', ['$scope', '$http', 'DTOptionsBuilder', '$timeout', 'SharedProperties', function ($scope, $http, DTOptionsBuilder, $timeout, SharedProperties) {
    var token = '';
    var isFullDataSelected = 0;

    // Get user info from database
    // Set user details in service
    //function setUserDetails() {
    $http.get("/loginUserDetails/").then(function (response) {
        SharedProperties.setUserData(response.data);
        getUserDetails();
    });
    //}

    // Get user details from service
    // Detect role and set permissions accoring to role.
    function getUserDetails() {
        token = SharedProperties.getUser();
        getUserLog();
        $scope.username = SharedProperties.getUser();
        if ($scope.username == null) {
            window.location.href = '/login';
        }
        var _role = SharedProperties.getRole().toLowerCase();
        //alert(_role);
        if (_role == 'superadmin') {
            $scope.isSuperAdmin = true;
            $scope.isAdmin = true;
        }
        else if (_role == 'admin') {
            //alert('IS ADMIN');
            $scope.isSuperAdmin = false;
            $scope.isAdmin = true;
        }
        else {
            $scope.isSuperAdmin = false;
            $scope.isAdmin = false;
        }
    }

    // This is used to show paging for data and deltaE grid.
    $scope.currentPage = 1;
    $scope.currentDeltaEPage = 1;
    $scope.user = '';

    showloader();

    // These are the options for datatable.
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withDisplayLength(10)
        .withOption('bLengthChange', true)
        .withOption('scrollX', '100%')
        .withOption('scrollY', '290px')

    $scope.getShadeData = {};

    // Get distinct values for filter. (Filter Drop Down Binding)
    var _t0 = performance.now();
    $http.get("/defaultBindValues/").then(function (response) {
        //console.log("DEFAULT BIND VALUES => ")
        //console.log(response.data)
        $.each(response.data.Type_of_Fibre, function (index, item) {
            $("#ddlFibreType").append("<option selected='selected' value='" + item + "'>" + item + "</option>")
        })

        $.each(response.data.Fiber, function (index, item) {
            $("#ddlFibre").append("<option selected='selected' value='" + item + "'>" + item + "</option>")
        })

        $.each(response.data.Brand, function (index, item) {
            $("#ddlBrand").append("<option selected='selected' value='" + item + "'>" + item + "</option>")
        })

        $.each(response.data.Percent_White, function (index, item) {
            $("#ddlWPercent").append("<option selected='selected' value='" + item + "'>" + item + "</option>")
        })

        $.each(response.data.Fiber_Origin, function (index, item) {
            $("#ddlFiberOrigin").append("<option selected='selected' value='" + item + "'>" + item + "</option>")
        })

        $.each(response.data.Group, function (index, item) {
            //console.log("GROUP => ")
            //console.log(item.Group)
            $("#ddlGroup").append("<option selected='selected' value='" + item + "'>" + item + "</option>")
        })

        $.each(response.data.Processing_Time_min, function (index, item) {
            //if (typeof item === 'number') {
            //    $scope.PinTicketSearch(ticketPinOrEvent);
            //}

            if (!isNaN(item) && angular.isNumber(item)) {
                $("#ddlProcessingTime").append("<option selected='selected' value='" + item + "'>" + item + "</option>")
            }
            //$("#ddlProcessingTime").append("<option selected='selected' value='" + item + "'>" + item + "</option>")
        })

        $.each(response.data.Developer_Strength, function (index, item) {
            $("#ddlDeveloperStrength").append("<option selected='selected' value='" + item + "'>" + item + "</option>")
        })

        $("#ddlFibreType").val("All").change();
        $("#ddlFibre").val("All").change();
        $("#ddlBrand").val("All").change();
        $("#ddlWPercent").val("All").change();
        $("#ddlFiberOrigin").val("All").change();
        $("#ddlGroup").val("All").change();
        $("#ddlProcessingTime").val("All").change();
        $("#ddlDeveloperStrength").val("All").change();

        var _t1 = performance.now();
        var _divisor_for_minutes = (_t1 - _t0) / 1000;
        var _divisor_for_seconds = _divisor_for_minutes % 60;
        var _seconds = Math.ceil(_divisor_for_seconds);
        console.log("Call to do filtering took " + _seconds + " Seconds.");

        $timeout(function () {
            //setUserDetails();
            angular.element('#filterBtn').triggerHandler('click');
            getStatistic();
        }, 2000);
    });

    // This function shows the static count at top.
    function getStatistic() {
        $http.get("/statistics", {}).then(function (response) {
            $scope.stat = response.data
            //alert(response.data)
        })
    }

    //$timeout(function () {
    //    //setUserDetails();
    //    angular.element('#filterBtn').triggerHandler('click');
    //    getStatistic();
    //}, 2000);

    // Get minimum and maximum of L slider.
    $("#slider").bind("valuesChanged", function (e, data) {
        $("#hidMinL").val(parseFloat(data.values.min));
        $("#hidMaxL").val(parseFloat(data.values.max));
        $scope.filter.L_min = parseFloat(data.values.min);
        $scope.filter.L_max = parseFloat(data.values.max);
    });

    // Get minimum and maximum of a slider.
    $("#slider2").bind("valuesChanged", function (e, data) {
        $("#hidMinA").val(parseFloat(data.values.min));
        $("#hidMaxA").val(parseFloat(data.values.max));
        $scope.filter.a_min = parseFloat(data.values.min);
        $scope.filter.a_max = parseFloat(data.values.max);
    });

    // Get minimum and maximum of b slider.
    $("#slider3").bind("valuesChanged", function (e, data) {
        $("#hidMinB").val(parseFloat(data.values.min));
        $("#hidMaxB").val(parseFloat(data.values.max));
        $scope.filter.b_min = parseFloat(data.values.min);
        $scope.filter.b_max = parseFloat(data.values.max);
    });

    function ReturnSelectedValues(divId) {
        var _check = [];
        $('#' + divId + ' .fstChoiceItem').each(function (i) {
            _check.push($(this).attr('data-value'));
        });
        return _check;

    }

    function ReturnSelectedValues1(divId) {
        var _check = [];
        $('#' + divId + ' .spnSelectedText').each(function (i) {
            _check.push($(this).text());
        });
        return _check;

    }

    $scope.chdata = [];
    $scope.chBardata = [];
    $scope.erroredData = [];
    $scope.jsonToExport = {};

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $scope.clearImage = function (sprintID) {
        $('#img-upload').attr('src', '/shades/sprint_images/' + sprintID + '.jpg');
        $('#urlname').val(sprintID +'.jpg');
    }

    $scope.browseData = 1;

    $scope.getRange = function (filter) {
        isFullDataSelected = 0;
        $(".div-scroller_div").removeClass("Go_opacity_div");
        var t0 = performance.now();
        showloader();
        filter.Type_of_Fibre = ReturnSelectedValues1('divFibreType');
        filter.Percent_White = ReturnSelectedValues1('divPercentWhite');
        filter.Fiber_Origin = ReturnSelectedValues1('divFiberOrigin');
        filter.Group = ReturnSelectedValues1('divGroup');
        filter.Processing_Time_min = ReturnSelectedValues1('divProcessingTime');
        filter.Developer_Strength = ReturnSelectedValues1('divDeveloperStrength');
        filter.Fiber = ReturnSelectedValues1('divFibre');
        filter.Brand = ReturnSelectedValues1('divBrand');

        if (validateFilter(filter)) {

            if (valudateLab(filter)) {

                $scope.barPlotClicked = 0;
                $scope.scatterPlotClicked = 0;
                $scope.clusterPlotClicked = 0;
                $scope.nearestFormulaClicked = 0;
                $scope.scatter3DClicked = 0;
                $scope.browseData = 0;
                $scope.deltaEData = 0;
                $http.post("/colorshade/range", {
                    L_min: filter.L_min,
                    L_max: filter.L_max,
                    a_min: filter.a_min,
                    a_max: filter.a_max,
                    b_min: filter.b_min,
                    b_max: filter.b_max,
                    L: filter.L,
                    a: filter.a,
                    b: filter.b,
                    Type_of_Fibre: filter.Type_of_Fibre,
                    Fiber: filter.Fiber,
                    Percent_White: filter.Percent_White,
                    Fiber_Origin: filter.Fiber_Origin,
                    Group: filter.Group,
                    Processing_Time_min: filter.Processing_Time_min,
                    Developer_Strength: filter.Developer_Strength,
                    Brand: filter.Brand
                }).then(function (response) {
                    $scope.filteredData = (response.data.data.length == 0) ? response.data.data : JSON.parse(response.data.data);
                    // $scope.filteredData = JSON.parse(response.data.data); //response.data.data;
                    $scope.chdata = [];
                    $scope.chdata.push((response.data.data.length == 0) ? response.data.data : JSON.parse(response.data.data));
                    $scope.jsonToExport = (response.data.data.length == 0) ? response.data.data : JSON.parse(response.data.data);
                    $scope.chBardata = [];
                    $scope.chBardata.push($scope.filteredData);

                    $scope.showData = true;
                    $scope.pg_total = $scope.filteredData.length;
                    $scope.pg_de_total = $scope.filteredData.length;

                    var active_Tab = $('.active1').prop('id');
                    if (active_Tab != "tabCluster" && active_Tab != 'tabNearest' && active_Tab != 'tab3Dcluster') {
                        hideloader();
                    }

                    console.log("TOTAL RECORS : " + $scope.filteredData.length);
                    var t1 = performance.now();
                    var divisor_for_minutes = (t1 - t0) / 1000;
                    var divisor_for_seconds = divisor_for_minutes % 60;
                    var seconds = Math.ceil(divisor_for_seconds);
                    console.log("Call to do filtering took " + seconds + " Seconds.");

                    $timeout(function () {
                        resetIsClicked();
                        if (active_Tab == "tabCluster") {
                            $scope.getclusters();
                            $timeout(function () {
                                $scope.getNearestFormula();
                            }, 200)
                        }
                        else if (active_Tab == 'tabNearest') {
                            $scope.getNearestFormula();
                            $timeout(function () {
                                $scope.getclusters();
                            }, 200)
                        }
                        else if (active_Tab == 'tab3Dcluster') {
                            $scope.getclusters();
                            $timeout(function () {
                                $scope.getNearestFormula();
                            }, 200)
                        }
                        else {
                            $scope.getclusters();
                            $scope.getNearestFormula();
                        }
                    }, 100)

                    $scope.fileName = "Sprint Data";
                    $scope.exportData = [];
                    $scope.exportData.push(["Sprint ID", "Name Of Campaign", "Group", "Brand", "Line", "Commercial Shade Name",
                        "Technical Number", "Commercial Number", "Formula Number", "DeltaE Range Mean", "DeltaE Target", "Alkaline Agent",
                        "Booster Formula Number", "Quantity 49", "Quantity 671", "Developer Strength", "Developer Formula Number", "Mixture",
                        "Processing Time(min)", "Fiber Code", "Type Of Fibre", "Fiber", "Percent White", "Fiber Origin",
                        "L Transposed", "a Transposed", "b Transposed", "C Transposed", "H Transposed"]);
                    $.each($scope.jsonToExport, function (index, value) {
                        $scope.exportData.push([value.Sprint_Id, value.Name_of_Campaign, value.Group, value.Brand, value.Line, value.Commercial_Shade_Name,
                        value.Technical_Number, value.Commercial_Number, value.Formula_Number, value.deltaE_mean, value.deltaE_target, value.Alkaline_Agent,
                        value.Booster_Formula_Number, value.Quantity_49, value.Quantity_671, value.Developer_Strength, value.Developer_Formula_Number, value.Mixture,
                        value.Processing_Time_min, value.Fiber_Code, value.Type_of_Fibre, value.Fiber, value.Percent_White, value.Fiber_Origin,
                        value.L_Transposed, value.a_Transposed, value.b_Transposed, value.C_Transposed, value.H_Transposed,
                        ]);
                    });
                })
            }

        }
        else {
            $.alert({
                title: 'Warning!',
                content: 'All filters are mandatory!',
                theme: 'Material'
            });
        }
    }

    $scope.getFullData_ = function (isChecked, filter) {
        if (isChecked) {
            isFullDataSelected = 1;
            $(".div-scroller_div").addClass("Go_opacity_div");
            var t0 = performance.now();
            showloader();
            if (valudateLab(filter)) {

                $scope.barPlotClicked = 0;
                $scope.scatterPlotClicked = 0;
                $scope.clusterPlotClicked = 0;
                $scope.nearestFormulaClicked = 0;
                $scope.scatter3DClicked = 0;
                $scope.browseData = 0;
                $scope.deltaEData = 0;
                $http.post("/colorshade/fullData", {
                    L_min: 0,
                    L_max: 100,
                    a_min: -60,
                    a_max: 60,
                    b_min: -60,
                    b_max: 60,
                    L: filter.L,
                    a: filter.a,
                    b: filter.b,
                    Type_of_Fibre: filter.Type_of_Fibre,
                    Fiber: filter.Fiber,
                    Percent_White: filter.Percent_White,
                    Fiber_Origin: filter.Fiber_Origin,
                    Group: filter.Group,
                    Processing_Time_min: filter.Processing_Time_min,
                    Developer_Strength: filter.Developer_Strength,
                    Brand: filter.Brand
                }).then(function (response) {
                    console.log(response);  
                    $scope.filteredData = (response.data.data.length == 0) ? response.data.data : JSON.parse(response.data.data); //response.data.data;
                    $scope.chdata = [];
                    $scope.chdata.push((response.data.data.length == 0) ? response.data.data : JSON.parse(response.data.data));
                    $scope.jsonToExport = (response.data.data.length == 0) ? response.data.data : JSON.parse(response.data.data);;
                    $scope.chBardata = [];
                    $scope.chBardata.push($scope.filteredData);

                    $scope.showData = true;
                    $scope.pg_total = $scope.filteredData.length;
                    $scope.pg_de_total = $scope.filteredData.length;

                    var active_Tab = $('.active1').prop('id');
                    if (active_Tab != "tabCluster" && active_Tab != 'tabNearest' && active_Tab != 'tab3Dcluster') {
                        hideloader();
                    }

                    console.log("TOTAL RECORS : " + $scope.filteredData.length);

                    var t1 = performance.now();
                    var divisor_for_minutes = (t1 - t0) / 1000;
                    var divisor_for_seconds = divisor_for_minutes % 60;
                    var seconds = Math.ceil(divisor_for_seconds);
                    console.log("Call to get full data " + seconds + " Seconds.");

                    $timeout(function () {
                        resetIsClicked();
                        if (active_Tab == "tabCluster") {
                            $scope.getclusters();
                            $timeout(function () {
                                $scope.getNearestFormula();
                            }, 200)
                        }
                        else if (active_Tab == 'tabNearest') {
                            $scope.getNearestFormula();
                            $timeout(function () {
                                $scope.getclusters();
                            }, 200)
                        }
                        else if (active_Tab == 'tab3Dcluster') {
                            $scope.getclusters();
                            $timeout(function () {
                                $scope.getNearestFormula();
                            }, 200)
                        }
                        else {
                            $scope.getclusters();
                            $scope.getNearestFormula();
                        }
                    }, 100)

                    $scope.fileName = "Sprint Data";
                    $scope.exportData = [];
                    $scope.exportData.push(["Sprint ID", "Name Of Campaign", "Group", "Brand", "Line", "Commercial Shade Name",
                        "Technical Number", "Commercial Number", "Formula Number", "DeltaE Range Mean", "DeltaE Target", "Alkaline Agent",
                        "Booster Formula Number", "Quantity 49", "Quantity 671", "Developer Strength", "Developer Formula Number", "Mixture",
                        "Processing Time(min)", "Fiber Code", "Type Of Fibre", "Fiber", "Percent White", "Fiber Origin",
                        "L Transposed", "a Transposed", "b Transposed", "C Transposed", "H Transposed"]);
                    $.each($scope.jsonToExport, function (index, value) {
                        $scope.exportData.push([value.Sprint_Id, value.Name_of_Campaign, value.Group, value.Brand, value.Line, value.Commercial_Shade_Name,
                        value.Technical_Number, value.Commercial_Number, value.Formula_Number, value.deltaE_mean, value.deltaE_target, value.Alkaline_Agent,
                        value.Booster_Formula_Number, value.Quantity_49, value.Quantity_671, value.Developer_Strength, value.Developer_Formula_Number, value.Mixture,
                        value.Processing_Time_min, value.Fiber_Code, value.Type_of_Fibre, value.Fiber, value.Percent_White, value.Fiber_Origin,
                        value.L_Transposed, value.a_Transposed, value.b_Transposed, value.C_Transposed, value.H_Transposed,
                        ]);
                    });
                })
            }
        }
        else {
            $(".div-scroller_div").removeClass("Go_opacity_div");
            isFullDataSelected = 0;
            $scope.getRange($scope.filter);
        }
    }

    $scope.getData = function () {
        if (isFullDataSelected == 1) {
            $(".div-scroller_div").addClass("Go_opacity_div");
            $scope.getFullData_(true, $scope.filter);
        } else {
            $(".div-scroller_div").removeClass("Go_opacity_div");
            $scope.getRange($scope.filter);
        }
    }

    function resetIsClicked() {
        var param = $('.active1').prop('id');
        switch (param) {
            case "tabBarchart":
                $scope.barPlotClicked = 1;

                $scope.scatterPlotClicked = 0;
                $scope.clusterPlotClicked = 0;
                $scope.nearestFormulaClicked = 0;
                $scope.scatter3DClicked = 0;
                $scope.deltaEData = 0;
                $scope.browseData = 0;
                break;
            case "tabScatterPlot":
                $scope.scatterPlotClicked = 1;

                $scope.barPlotClicked = 0;
                $scope.clusterPlotClicked = 0;
                $scope.nearestFormulaClicked = 0;
                $scope.scatter3DClicked = 0;
                $scope.deltaEData = 0;
                $scope.browseData = 0;
                break;
            case "tabClusterChart":
                $scope.clusterPlotClicked = 1;

                $scope.scatterPlotClicked = 0;
                $scope.barPlotClicked = 0;
                $scope.nearestFormulaClicked = 0;
                $scope.scatter3DClicked = 0;
                $scope.deltaEData = 0;
                $scope.browseData = 0;
                break;
            case "tabNearestFormulaChart":
                $scope.nearestFormulaClicked = 1;
                $scope.clusterPlotClicked = 0;
                $scope.scatterPlotClicked = 0;
                $scope.barPlotClicked = 0;
                $scope.scatter3DClicked = 0;
                $scope.deltaEData = 0;
                $scope.browseData = 0;
                break;
            case "tab3Ddynamics":
                $scope.scatter3DClicked = 1;

                $scope.nearestFormulaClicked = 0;
                $scope.clusterPlotClicked = 0;
                $scope.scatterPlotClicked = 0;
                $scope.barPlotClicked = 0;
                $scope.deltaEData = 0;
                $scope.browseData = 0;
                break;
            case "tabDeltaE":
                $scope.deltaEData = 1;

                $scope.scatter3DClicked = 0;
                $scope.nearestFormulaClicked = 0;
                $scope.clusterPlotClicked = 0;
                $scope.scatterPlotClicked = 0;
                $scope.barPlotClicked = 0;
                $scope.browseData = 0;
                break;
            case "tabBrowseData":
                $scope.browseData = 1;

                $scope.deltaEData = 0;
                $scope.scatter3DClicked = 0;
                $scope.nearestFormulaClicked = 0;
                $scope.clusterPlotClicked = 0;
                $scope.scatterPlotClicked = 0;
                $scope.barPlotClicked = 0;
                break;
        }
    }

    function validateFilter(filter) {
        if (filter.Type_of_Fibre == "" || filter.Type_of_Fibre == null) {
            hideloader();
            return false;
        }
        if (filter.Percent_White == "" || filter.Percent_White == null) {
            hideloader();
            return false;
        }
        if (filter.Fiber_Origin == "" || filter.Fiber_Origin == null) {
            hideloader();
            return false;
        }
        if (filter.Group == "" || filter.Group == null) {
            hideloader();
            return false;
        }
        if (filter.Processing_Time_min == "" || filter.Processing_Time_min == null) {
            hideloader();
            return false;
        }
        if (filter.Developer_Strength == "" || filter.Developer_Strength == null) {
            hideloader();
            return false;
        }
        if (filter.Fiber == "" || filter.Fiber == null) {
            hideloader();
            return false;
        }
        if (filter.Brand == "" || filter.Brand == null) {
            hideloader();
            return false;
        }
        return true;
    }

    function valudateLab(filter) {

        if (filter.L == "" || filter.L == null || filter.L < 0 || filter.L > 100) {
            $.alert({
                title: 'Warning!',
                content: 'L values should be in range of 0 to 100',
                theme: 'Material'
            });
            hideloader();
            return false;
        }
        else if (filter.a == "" || filter.a == null || filter.a < -60 || filter.a > 60) {
            $.alert({
                title: 'Warning!',
                content: 'a values should be in range of -60 to 60',
                theme: 'Material'
            });
            hideloader();
            return false;
        }
        else if (filter.b == "" || filter.b == null || filter.b < -60 || filter.b > 60) {
            $.alert({
                title: 'Warning!',
                content: 'b values should be in range of -60 to 60',
                theme: 'Material'
            });
            hideloader();
            return false;
        }
        return true;
    }

    $scope.HideDeltaE = function () {
        $scope.showData = false;
        ng.columns.adjust().draw(false);
    }

    $scope.ShowDeltaE = function () {
        $scope.showData = true;
    }

    function getDataOnChange() {
        $scope.getRange($scope.filter);
    }

    $scope.getShadeData = function () {
        $http.post("/colorshade/range", {
            L_min: $("#hidMinL").val(),
            L_max: $("#hidMaxL").val(),
            a_min: $("#hidMinA").val(),
            a_max: $("#hidMaxA").val(),
            b_min: $("#hidMinB").val(),
            b_max: $("#hidMaxB").val(),
            L: $("#txtL").val(),
            a: $("#txtA").val(),
            b: $("#txtB").val(),
            Type_of_Fibre: ReturnSelectedValues('divFibreType'),
            Percent_White: ReturnSelectedValues('divPercentWhite'),
            Fiber_Origin: ReturnSelectedValues('divFiberOrigin'),
            Group: ReturnSelectedValues('divGroup'),
            Processing_Time_min: ReturnSelectedValues('divProcessingTime'),
            Developer_Strength: ReturnSelectedValues('divDeveloperStrength'),
            Fiber: ReturnSelectedValues('divFibre')
        }).then(function (response) {
            $scope.filteredData = response.data.data; //response.data.data;
            $scope.chdata = [];
            $scope.chdata.push(response.data.data);
            $scope.chBardata = [];
            $scope.chBardata.push($scope.filteredData);
            hideloader();
        })
    }

    $scope.getShade = function (id) {
        $http.get("/colorshade/" + id).then(function (response) {
            $scope.sData = response.data
        })
    }

    $scope.getFullData = function () {
        $http.get("/colorshade", {}).then(function (response) {
            $scope.allShades = response.data;
        })
    }

    $scope.createShade = function (shade) {
        $http.post("/colorshade", {
            Name_of_Campaign: shade.Name_of_Campaign,
            Date_Campaign: shade.Date_Campaign,
            Group: shade.Group,
            Division: shade.Division,
            Brand: shade.Brand,
            Line: shade.Line,
            Type_of_Product: shade.Type_of_Product,
            Product_Form: shade.Product_Form,
            Formula_Number: shade.Formula_Number,
            Commercial_Shade_Name: shade.Commercial_Shade_Name,
            Technical_Number: shade.Technical_Number,
            Commercial_Number: shade.Commercial_Number,
            Level: shade.Level,
            Booster_Formula_Number: shade.Booster_Formula_Number,
            Alkaline_Agent: shade.Alkaline_Agent,
            Quantity_49: shade.Quantity_49,
            Quantity_671: shade.Quantity_671,
            Developer_Strength: shade.Developer_Strength,
            Developer_Formula_Number: shade.Developer_Formula_Number,
            Mixture: shade.Mixture,
            Processing_Time_min: shade.Processing_Time_min,
            Fiber_Code: shade.Fiber_Code,
            Type_of_Fibre: shade.Type_of_Fibre,
            Fiber: shade.Fiber,
            Percent_White: shade.Percent_White,
            Fiber_Origin: shade.Fiber_Origin,
            L_Transposed: shade.L_Transposed,
            a_Transposed: shade.a_Transposed,
            b_Transposed: shade.b_Transposed,
            C_Transposed: shade.C_Transposed,
            H_Transposed: shade.H_Transposed,
            Reflect: shade.Reflect,
            Primary_Reflect: shade.Primary_Reflect,
            Secondary_Reflect: shade.Secondary_Reflect,

            ImageStr: $("#b64Image").val()
        }).then(function (response) {
            //console.log(response.data)
        })
    }

    $scope.fUploadTrial = function () {
        console.log("Image Upload Called")
        //$http.post("/fUploadTrial", {
        //    ImageStr: $("#b64Image").val()
        //}).then(function (response) {
        //    //console.log(response.data)
        //})
    }

    $scope.ShowPopUp = function (obj) {
        $scope.selectedData = obj;
        //console.log($scope.selectedData);
    }

    $scope.updateShade = function (obj) {
        $http.put("/colorshade/", {
            _id: obj._id,
            Sprint_Id: obj.Sprint_Id,
            Name_of_Campaign: obj.Name_of_Campaign,
            Group: obj.Group,
            Brand: obj.Brand,
            Line: obj.Line,
            Formula_Number: obj.Formula_Number,
            //Commercial_Shade_Name: obj.Commercial_Shade_Name,
            //Technical_Number: obj.Technical_Number,
            Commercial_Number: obj.Commercial_Number,
            Booster_Formula_Number: obj.Booster_Formula_Number,
            Alkaline_Agent: obj.Alkaline_Agent,
            Quantity_49: obj.Quantity_49,
            Quantity_671: obj.Quantity_671,
            Developer_Strength: obj.Developer_Strength,
            Developer_Formula_Number: obj.Developer_Formula_Number,
            Mixture: obj.Mixture,
            Processing_Time_min: obj.Processing_Time_min,
            Fiber_Code: obj.Fiber_Code,
            Type_of_Fibre: obj.Type_of_Fibre,
            Fiber: obj.Fiber,
            Percent_White: obj.Percent_White,
            Fiber_Origin: obj.Fiber_Origin,
            L_Transposed: obj.L_Transposed,
            a_Transposed: obj.a_Transposed,
            b_Transposed: obj.b_Transposed,
            C_Transposed: obj.C_Transposed,
            H_Transposed: obj.H_Transposed,
            Reflect: obj.Reflect,
            Primary_Reflect: obj.Primary_Reflect,
            Secondary_Reflect: obj.Secondary_Reflect,
            ImageStr: $("#b64Image_Update").val()
        }).then(function (response) {
            $scope.sData = response.data;
            $.alert({
                title: 'Success!',
                content: 'Data updated successfully!',
                theme: 'Material'
            });
            $('#myModal').hide();
            $('.modal-backdrop').hide();
        })
    }

    $scope.addShade = function (shade) {
        $http.post("/colorshade/", {
            Name_of_Campaign: shade.Name_of_Campaign,
            Date_Campaign: shade.Date_Campaign,
            Group: shade.Group,
            Division: shade.Division,
            Brand: shade.Brand,
            Line: shade.Line,
            Type_of_Product: shade.Type_of_Product,
            Product_Form: shade.Product_Form,
            Formula_Number: shade.Formula_Number,
            Commercial_Shade_Name: shade.Commercial_Shade_Name,
            Technical_Number: shade.Technical_Number,
            Commercial_Number: shade.Commercial_Number,
            Level: shade.Level,
            Booster_Formula_Number: shade.Booster_Formula_Number,
            Alkaline_Agent: shade.Alkaline_Agent,
            Quantity_49: shade.Quantity_49,
            Quantity_671: shade.Quantity_671,
            Developer_Strength: shade.Developer_Strength,
            Developer_Formula_Number: shade.Developer_Formula_Number,
            Mixture: shade.Mixture,
            Processing_Time_min: shade.Processing_Time_min,
            Fiber_Code: shade.Fiber_Code,
            Type_of_Fibre: shade.Type_of_Fibre,
            Fiber: shade.Fiber,
            Percent_White: shade.Percent_White,
            Fiber_Origin: shade.Fiber_Origin,
            L_Transposed: shade.L_Transposed,
            a_Transposed: shade.a_Transposed,
            b_Transposed: shade.b_Transposed,
            C_Transposed: shade.C_Transposed,
            H_Transposed: shade.H_Transposed,
            Reflect: shade.Reflect,
            Primary_Reflect: shade.Primary_Reflect,
            Secondary_Reflect: shade.Secondary_Reflect,
            ImageStr: $("#b64Image").val()
        }).then(function (response) {
            $scope.filteredData.push(response.data[0]);
            $.alert({
                title: 'Success!',
                content: 'Data added successfully!',
                theme: 'Material'
            });
            // $('#addModal').hide();
            $('#btnAddClose').click();
            // $('.modal-backdrop').hide();
            getStatistic();
        })
    }

    $scope.deleteShade = function (data) {

        $.confirm({
            title: 'Confirm!',
            content: 'Do you really want to delete this record?',
            buttons: {
                confirm: function () {
                    $http.delete("/colorshade/" + data._id).then(function (response) {
                        var index = $scope.filteredData.indexOf(data);
                        $scope.filteredData.splice(index, 1);
                        getStatistic();
                    })
                },
                cancel: function () {
                    //$.alert('Canceled!');
                }
            }
        });
    }

    $scope.uploadFile = function (data) {
        //console.log("token => " + token);
        console.log("File Upload Called")
        showloader();
        var errordata = [];
        if ($("#imgFile").val() != "" || $("#imgFile").val() != undefined) {
            if (window.FormData !== undefined) {
                var fileUpload = $("#imgFile").get(0);
                var files = fileUpload.files;
                // Create FormData object
                var fileData = new FormData();
                fileData.append("filetoupload", files[0]);
                fileData.append("username", token)

                $.ajax({
                    url: '/fileupload',
                    type: "POST",
                    contentType: false, // Not to set any content header
                    processData: false, // Not to process data
                    data: fileData,
                    success: function (result) {
                        $("#imgFile").val('');
                        hideloader();
                        $scope.erroredData.push(JSON.parse(result));
                        if ($scope.erroredData[0].db_push_status == "SUCCESS") {
                            $scope.stat = null;
                            $.alert({
                                title: 'Success!',
                                content: 'Data uploaded successfully!',
                                theme: 'Material'
                            });
                            $(".fileupload-preview").text('')

                            getUserLog();
                            getStatistic();
                            $timeout(function () {
                                angular.element('#filterBtn').triggerHandler('click');
                            }, 700)
                        }
                        else {
                            // added by vivek
                            $scope.notificationData = $scope.erroredData[0].error_data;
                            $scope.notificationMessage = 1;

                            $.alert({
                                title: 'Error!',
                                content: 'Uploaded data is not valid. Please correct the data and upload again!',
                                theme: 'Material'
                            });
                        }
                        window.location.reload();
                    },
                    error: function (err) {
                        hideloader();
                        $.alert({
                            title: 'Error..!',
                            content: 'Sorry, some internal error occured!' + '\n' + err,
                            theme: 'Material'
                        });
                    }
                });

            } else {
                alert("FormData is not supported.");
            }
        }
        else {
            $.alert({
                title: 'Warning!',
                content: 'Please select the file to be uploaded!',
                theme: 'Material'
            });
        }
    }

    function showloader() {
        $(".loader-container").show();
    }

    function hideloader() {
        $(".loader-container").fadeOut(200);
    }

    $scope.logout = function () {
        SharedProperties.clearUserData();
        window.location.href = '/login'
    }

    // added by vivek
    $scope.showNotificationDetails = function () {
        notificationMessage = "";
        //console.log($scope.notificationData);
    }

    $scope.revertUploadedData = function () {
        //console.log("Revert Call");

        $.confirm({
            title: 'Confirm!',
            content: 'Do you really want to revert recent changes to the database?',
            buttons: {
                confirm: function () {
                    console.log("$scope.logid => " + $scope.logid);
                    $http.delete("/colorshade/revertUpload/" + $scope.logid).then(function (response) {
                        $scope.stat = null;
                        $.alert({
                            title: 'Success!',
                            content: 'Recent changes are reverted successfully!',
                            theme: 'Material'
                        });

                        getUserLog();
                        getStatistic();
                        $timeout(function () {
                            angular.element('#filterBtn').triggerHandler('click');
                        }, 700)

                    })
                    //}
                },
                cancel: function () {
                    //$.alert('Canceled!');
                }
            }
        });
    }

    $scope.getclusters = function () {
        var active_Tab1 = $('.active1').prop('id');
        if (active_Tab1 == 'tabCluster') {
            showloader();
        }
        else if (active_Tab1 == 'tab3Dcluster') {
            showloader();
        }

        $http.post("/analytics/clusters", {
            "data": JSON.stringify($scope.filteredData),
            "n": $scope.filter.n_count
        }).then(function (response) {
            $scope.cluster = response.data.data;
            $scope.clusterData = [];
            $scope.clusterData.push($scope.cluster)
            console.log("CLUSTER SUCCESS");
            $scope.changeVal('ClusterChart');
            
            if (active_Tab1 == 'tabCluster') {
                hideloader();
            }
            else if (active_Tab1 == 'tab3Dcluster') {
                hideloader();
            }
        })
    }

    $scope.getNearestFormula = function () {
        $("#divLineReference").html('');
        $('#divLineReference').append('<span class="clust">Chosen Target</span> <span class="values-text" ><span  > L </span>: <span>' + $("#txtL").val() + ' </span><span class="border-mid "></span>  <span > a </span>: <span>' + $("#txtA").val() + '  </span><span class="border-mid "></span> <span > b</span>  <span>: ' + $("#txtB").val() + '</span></span>');
        $http.post("/analytics/nearestFormula", {
            "data": JSON.stringify($scope.filteredData),
            "L_min": $scope.filter.L_min,
            "L_max": $scope.filter.L_max,
            "a_min": $scope.filter.a_min,
            "a_max": $scope.filter.a_max,
            "b_min": $scope.filter.b_min,
            "b_max": $scope.filter.b_max,
            "L": $scope.filter.L,
            "a": $scope.filter.a,
            "b": $scope.filter.b,
            "n": $scope.filter.n_cluster
        }).then(function (response) {
            $scope.nearest = JSON.parse("[" + response.data.nearest + "]");
            $scope.nearestData = [];
            $scope.nearestData.push($scope.nearest)
            $scope.byAction = false;
            $scope.changeVal('NearestFormulaChart');
            //$(".div-scroller").css('height', '899px');
            var activeTab = $('.active1').prop('id');
            if (activeTab == "tabNearest") {
                $(".div-scroller_div").css('height', '924px');
                hideloader();
            }
        })
    }

    $scope.getNearestFormulaAction = function (data) {

        $("#divLineReference").html('');
        //if (data.Formula_Number.toLowerCase() == 'empty' || data.Formula_Number.toLowerCase() == '' || data.Formula_Number == null) {
        //    $('#divLineReference').append('<span class="clust">Chosen Reference</span> <span class="values-text"><span> ' + data.Name_of_Campaign + ' ' + data.Brand + '</span>');
        //} else {
        //    $('#divLineReference').append('<span class="clust">Chosen Reference</span> <span class="values-text"><span> ' + data.Formula_Number + '</span>');
        //}

        var formulaNo = data.Formula_Number;
        if (formulaNo === null || data.Formula_Number.toLowerCase() == 'empty' || formulaNo.toLowerCase() == '' || isNaN(formulaNo)) {
            $('#divLineReference').append('<span class="clust">Chosen Reference</span> <span class="values-text"><span> ' + data.Name_of_Campaign + ' ' + data.Brand + '</span>');
        } else {
            $('#divLineReference').append('<span class="clust">Chosen Reference</span> <span class="values-text"><span> ' + data.Formula_Number + '</span>');
        }

        $scope.referenceNearestData = data;
        $http.post("/analytics/nearestFormula", {
            "data": JSON.stringify($scope.filteredData),
            "L_min": $scope.filter.L_min,
            "L_max": $scope.filter.L_max,
            "a_min": $scope.filter.a_min,
            "a_max": $scope.filter.a_max,
            "b_min": $scope.filter.b_min,
            "b_max": $scope.filter.b_max,
            "L": data.L_Transposed,
            "a": data.a_Transposed,
            "b": data.b_Transposed,
            "n": $scope.filter.n_cluster
        }).then(function (response) {
            $scope.nearest = JSON.parse("[" + response.data.nearest + "]");
            $scope.nearestData = [];
            $scope.nearestData.push($scope.nearest)
            $scope.nearestFormulaClicked = 1;
            $scope.byAction = true;
            //$(".div-scroller_div").css('height', '924px');
        })
    }

    function getUserLog() {
        $http.get("/getLogs/" + SharedProperties.getUser()).then(function (response) {
            $scope.userLogs = response.data.log;
        })
    }

    $scope.resizeGraph = function () {
        $timeout(function () {
            $(window).trigger('resize');
        }, 300);
    }

    $scope.changeVal = function (param) {
        switch (param) {
            case "barPlot":
                $scope.barPlotClicked = 1;
                break;
            case "scatterPlot":
                $scope.scatterPlotClicked = 1;
                break;
            case "ClusterChart":
                $scope.clusterPlotClicked = 1;
                break;
            case "NearestFormulaChart":
                $scope.nearestFormulaClicked = 1;
                break;
            case "3D_Dynamics":
                $scope.scatter3DClicked = 1;
                break;
            case "bindDeltaE":
                if ($scope.deltaEData == 0) {
                    $scope.filteredDeltaEData = $scope.filteredData;
                    $scope.deltaEData = 1;
                }
                break;
            case "bindBrowseData":
                if ($scope.browseData == 0) {
                    $scope.filteredBrowseData = $scope.filteredData;
                    $scope.browseData = 1;
                }
                break;
        }

    }

    $scope.EditUser = function (obj) {
        $scope.user = clone(obj);
        getPassword(obj.password);
        $("#btnAddUser").text("Update");
    }

    function getPassword(password) {
        $http.post("/getPassword/", {
            password: password
        }).then(function (response) {
            $scope.user.password = response.data;
            return response.data;
        })
    }

    $scope.addUser = function (userData) {
        if (userData._id == 0) {
            $http.post("/addUser/", {
                firstname: userData.firstname,
                lastname: userData.lastname,
                contact: userData.contact,
                email: userData.email,
                username: userData.username,
                password: userData.password,
                role: userData.role
            }).then(function (response) {
                $.alert({
                    title: 'Success!',
                    content: 'User added successfully!',
                    theme: 'Material'
                });
                $("#btnAddUser").text("Add");
                $scope.clearUserData(userData);
                $scope.getAllUsers();
                getStatistic();
            })
        }
        else {
            $http.post("/updateUser/", {
                _id: userData._id,
                firstname: userData.firstname,
                lastname: userData.lastname,
                contact: userData.contact,
                email: userData.email,
                username: userData.username,
                password: userData.password,
                role: userData.role
            }).then(function (response) {
                $.alert({
                    title: 'Success!',
                    content: 'User updated successfully!',
                    theme: 'Material'
                });
                $("#btnAddUser").text("Add");
                $scope.clearUserData(userData);
                $scope.getAllUsers();
                getStatistic();
            })
        }

    }

    $scope.deleteUser = function (data) {
        $.confirm({
            title: 'Confirm!',
            content: 'Do you really want to delete this record?',
            buttons: {
                confirm: function () {
                    $http.post("/deleteUser/", {
                        _id: data._id,
                        username: data.username
                    }).then(function (response) {
                        $.alert({
                            title: 'Success!',
                            content: 'User deleted successfully!',
                            theme: 'Material'
                        });
                        $scope.getAllUsers();
                        getStatistic();
                    })
                },
                cancel: function () {
                    //$.alert('Canceled!');
                }
            }
        });
    }

    $scope.getAllUsers = function () {
        $http.get("/getSystemUsers/", {
        }).then(function (response) {
            $scope.systemUsersData = response.data;
            })
            $(window).resize(function () {      
            });
       
    }
   
 


    $scope.pg_upper = 10;
    $scope.pg_lower = 1;
    $scope.pageChangeHandler = function (num) {

        $scope.pg_total = $scope.sea_fil_data.length;
        var upperlimit = $scope.pageSizeBrowseData * num;
        $scope.pg_upper = upperlimit > $scope.pg_total ? $scope.pg_total : upperlimit
        var threshold = parseInt($scope.pg_total / $scope.pageSizeBrowseData);
        var maxthresholditems = threshold * $scope.pageSizeBrowseData;
        $scope.pg_lower = $scope.pg_upper > maxthresholditems ? maxthresholditems + 1 : $scope.pg_upper - ($scope.pageSizeBrowseData - 1);

    };

    $scope.clearUserData = function (user) {
        user._id = 0;
        delete user.firstname;
        delete user.lastname;
        delete user.email;
        delete user.contact;
        delete user.username;
        delete user.role;
        delete user.password;
        $("#btnAddUser").text("Add");
    }

    $scope.pg_de_upper = 10;

    $scope.pg_de_lower = 1;

    $scope.delteEPageChangeHandler = function (num) {
        $scope.pg_de_total = $scope.sea_fil_data_de.length;
        var upperlimit = $scope.pageSizeDeltaE * num;
        $scope.pg_de_upper = upperlimit > $scope.pg_de_total ? $scope.pg_de_total : upperlimit
        var threshold = parseInt($scope.pg_de_total / $scope.pageSizeDeltaE);
        var maxthresholditems = threshold * $scope.pageSizeDeltaE;
        $scope.pg_de_lower = $scope.pg_de_upper > maxthresholditems ? maxthresholditems + 1 : $scope.pg_de_upper - ($scope.pageSizeDeltaE - 1);
    };

    $scope.search_change = function () {
        $scope.pg_total = $scope.sea_fil_data.length;
    }

    $scope.de_search_change = function () {
        $scope.pg_de_total = $scope.sea_fil_data_de.length;
    }

    // Generate Password //

    $scope.checkboxModel = {
        symbols: false,
        numbers: true,
        upperCase: true,
        lowerCase: false
    };
    $scope.passwordLength = '8';
    $scope.user.password = '';
    $scope.upperCaseArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    $scope.lowerCaseArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    $scope.numbersArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    $scope.symbolsArray = ['@', '#', '&', '*'];
    $scope.generatePassword = function () {
        $scope.user.password = "";
        for (var i = 0; i < $scope.passwordLength; i++) {
            /*
            upperCase : true,
            lowerCase : false,
            numbers   : false,
            symbols   : false,
            */
            if ($scope.checkboxModel.upperCase === true && $scope.checkboxModel.lowerCase === false && $scope.checkboxModel.numbers === false && $scope.checkboxModel.symbols === false) {
                $scope.temp = Math.floor(Math.random() * $scope.upperCaseArray.length);
                $scope.user.password += $scope.upperCaseArray[$scope.temp];
            }
            /*
            upperCase : false,
            lowerCase : true,
            numbers   : false,
            symbols   : false,
            */
            else if ($scope.checkboxModel.upperCase === false && $scope.checkboxModel.lowerCase === true && $scope.checkboxModel.numbers === false && $scope.checkboxModel.symbols === false) {
                $scope.temp = Math.floor(Math.random() * $scope.lowerCaseArray.length);
                $scope.user.password += $scope.lowerCaseArray[$scope.temp];
            }
            /*
             upperCase : false,
             lowerCase : false,
             numbers   : true,
             symbols   : false,
             */
            else if ($scope.checkboxModel.upperCase === false && $scope.checkboxModel.lowerCase === false && $scope.checkboxModel.numbers === true && $scope.checkboxModel.symbols === false) {
                $scope.temp = Math.floor(Math.random() * $scope.numbersArray.length);
                $scope.user.password += $scope.numbersArray[$scope.temp];
            }
            /*
            upperCase : false,
            lowerCase : false,
            numbers   : false,
            symbols   : true
            */
            else if ($scope.checkboxModel.upperCase === false && $scope.checkboxModel.lowerCase === false && $scope.checkboxModel.numbers === false && $scope.checkboxModel.symbols === true) {
                $scope.temp = Math.floor(Math.random() * $scope.symbolsArray.length);
                $scope.user.password += $scope.symbolsArray[$scope.temp];
            }

            /*
            upperCase : true,
            lowerCase : true,
            numbers   : false,
            symbols   : fasle
            */
            else if ($scope.checkboxModel.upperCase === true && $scope.checkboxModel.lowerCase === true && $scope.checkboxModel.numbers === false && $scope.checkboxModel.symbols === false) {
                $scope.upperLowerArray = $scope.upperCaseArray.concat($scope.lowerCaseArray);
                $scope.temp = Math.floor(Math.random() * $scope.upperLowerArray.length);
                $scope.user.password += $scope.upperLowerArray[$scope.temp];
            }

            /*
            upperCase : true,
            lowerCase : false,
            numbers   : true,
            symbols   : fasle
            */
            else if ($scope.checkboxModel.upperCase === true && $scope.checkboxModel.lowerCase === false && $scope.checkboxModel.numbers === true && $scope.checkboxModel.symbols === false) {
                $scope.upperNumbersArray = $scope.upperCaseArray.concat($scope.numbersArray);
                $scope.temp = Math.floor(Math.random() * $scope.upperNumbersArray.length);
                $scope.user.password += $scope.upperNumbersArray[$scope.temp];
            }

            /*
            upperCase : false,
            lowerCase : true,
            numbers   : true,
            symbols   : fasle
            */
            else if ($scope.checkboxModel.upperCase === false && $scope.checkboxModel.lowerCase === true && $scope.checkboxModel.numbers === true && $scope.checkboxModel.symbols === false) {
                $scope.lowerNumbersArray = $scope.lowerCaseArray.concat($scope.numbersArray);
                $scope.temp = Math.floor(Math.random() * $scope.lowerNumbersArray.length);
                $scope.user.password += $scope.lowerNumbersArray[$scope.temp];
            }

            /*
            upperCase : false,
            lowerCase : true,
            numbers   : false,
            symbols   : true
            */
            else if ($scope.checkboxModel.upperCase === false && $scope.checkboxModel.lowerCase === true && $scope.checkboxModel.numbers === false && $scope.checkboxModel.symbols === true) {
                $scope.lowerSymbolsArray = $scope.lowerCaseArray.concat($scope.symbolsArray);
                $scope.temp = Math.floor(Math.random() * $scope.lowerSymbolsArray.length);
                $scope.user.password += $scope.lowerSymbolsArray[$scope.temp];
            }

            /*
            upperCase : false,
            lowerCase : false,
            numbers   : true,
            symbols   : true
            */
            else if ($scope.checkboxModel.upperCase === false && $scope.checkboxModel.lowerCase === false && $scope.checkboxModel.numbers === true && $scope.checkboxModel.symbols === true) {
                $scope.numbersSymbolsArray = $scope.numbersArray.concat($scope.symbolsArray);
                $scope.temp = Math.floor(Math.random() * $scope.numbersSymbolsArray.length);
                $scope.user.password += $scope.numbersSymbolsArray[$scope.temp];
            }

            /*
            upperCase : true,
            lowerCase : false,
            numbers   : false,
            symbols   : true
            */
            else if ($scope.checkboxModel.upperCase === true && $scope.checkboxModel.lowerCase === false && $scope.checkboxModel.numbers === false && $scope.checkboxModel.symbols === true) {
                $scope.upperSymbolsArray = $scope.upperCaseArray.concat($scope.symbolsArray);
                $scope.temp = Math.floor(Math.random() * $scope.upperSymbolsArray.length);
                $scope.user.password += $scope.upperSymbolsArray[$scope.temp];
            }

            /*
            upperCase : true,
            lowerCase : true,
            numbers   : true,
            symbols   : false
            */
            else if ($scope.checkboxModel.upperCase === true && $scope.checkboxModel.lowerCase === true && $scope.checkboxModel.numbers === true && $scope.checkboxModel.symbols === false) {
                $scope.upperLowerArray = $scope.upperCaseArray.concat($scope.lowerCaseArray);
                $scope.upperLowerNumbersArray = $scope.upperLowerArray.concat($scope.numbersArray);
                $scope.temp = Math.floor(Math.random() * $scope.upperLowerNumbersArray.length);
                $scope.user.password += $scope.upperLowerNumbersArray[$scope.temp];
            }

            /*
            upperCase : false,
            lowerCase : true,
            numbers   : true,
            symbols   : true
            */
            else if ($scope.checkboxModel.upperCase === false && $scope.checkboxModel.lowerCase === true && $scope.checkboxModel.numbers === true && $scope.checkboxModel.symbols === true) {
                $scope.lowerNumbersArray = $scope.lowerCaseArray.concat($scope.numbersArray);
                $scope.lowerNumbersSymbolsArray = $scope.lowerNumbersArray.concat($scope.symbolsArray);
                $scope.temp = Math.floor(Math.random() * $scope.lowerNumbersSymbolsArray.length);
                $scope.user.password += $scope.lowerNumbersSymbolsArray[$scope.temp];
            }

            /*
            upperCase : true,
            lowerCase : false,
            numbers   : true,
            symbols   : true
            */
            else if ($scope.checkboxModel.upperCase === true && $scope.checkboxModel.lowerCase === false && $scope.checkboxModel.numbers === true && $scope.checkboxModel.symbols === true) {
                $scope.numbersSymbolsArray = $scope.numbersArray.concat($scope.symbolsArray);
                $scope.numbersSymbolsUpperArray = $scope.numbersSymbolsArray.concat($scope.upperCaseArray);
                $scope.temp = Math.floor(Math.random() * $scope.numbersSymbolsUpperArray.length);
                $scope.user.password += $scope.numbersSymbolsUpperArray[$scope.temp];
            }

            /*
            upperCase : true,
            lowerCase : true,
            numbers   : false,
            symbols   : true
            */
            else if ($scope.checkboxModel.upperCase === true && $scope.checkboxModel.lowerCase === true && $scope.checkboxModel.numbers === false && $scope.checkboxModel.symbols === true) {
                $scope.upperLowerArray = $scope.upperCaseArray.concat($scope.lowerCaseArray);
                $scope.upperLowerSymbolsArray = $scope.upperLowerArray.concat($scope.symbolsArray);
                $scope.temp = Math.floor(Math.random() * $scope.upperLowerSymbolsArray.length);
                $scope.user.password += $scope.upperLowerSymbolsArray[$scope.temp];
            }

            /*
            upperCase : true,
            lowerCase : true,
            numbers   : true,
            symbols   : true
            */
            else if ($scope.checkboxModel.upperCase === true && $scope.checkboxModel.lowerCase === true && $scope.checkboxModel.numbers === true && $scope.checkboxModel.symbols === true) {
                $scope.upperLowerArray = $scope.upperCaseArray.concat($scope.lowerCaseArray);
                $scope.numbersSymbolsArray = $scope.numbersArray.concat($scope.symbolsArray);
                $scope.upperLowerSymbolsNumbersArray = $scope.upperLowerArray.concat($scope.numbersSymbolsArray);
                $scope.temp = Math.floor(Math.random() * $scope.upperLowerSymbolsNumbersArray.length);
                $scope.user.password += $scope.upperLowerSymbolsNumbersArray[$scope.temp];
            }

            /*
            upperCase : false,
            lowerCase : false,
            numbers   : false,
            symbols   : false
            */
            else {
                // nothing happens
            }

        }
    };

    $scope.uploadZip = function () {
        var errordata = [];
        if ($("#zipFile").val() != "" || $("#zipFile").val() != undefined) {
            if (window.FormData !== undefined) {
                console.log("In zip upload")
                var fileUpload = $("#zipFile").get(0);
                var files = fileUpload.files;
                console.log(files);
                // Create FormData object
                var fileData = new FormData();
                fileData.append("filetoupload", files[0]);
                fileData.append("username", SharedProperties.getUser())

                $.ajax({
                    url: '/fUploadTrial',
                    type: "POST",
                    contentType: false, // Not to set any content header
                    processData: false, // Not to process data
                    data: fileData,
                    success: function (result) {
                        $("#zipFile").val('');
                        hideloader();

                        $.alert({
                            title: 'Success!',
                            content: 'Images uploaded successfully!',
                            theme: 'Material'
                        });

                        window.location.reload();
                    },
                    error: function (err) {
                        hideloader();
                        $.alert({
                            title: 'Error..!',
                            content: 'Sorry, some internal error occured!' + '\n' + err,
                            theme: 'Material'
                        });
                    }
                });

            } else {
                alert("FormData is not supported.");
            }
        }
        else {
            $.alert({
                title: 'Warning!',
                content: 'Please select the file to be uploaded!',
                theme: 'Material'
            });
        }
    }

    //$("#img-upload").load(function () {
    //    alert("Image loaded");

    //    if (this.files && this.files[0]) {

    //        var FR = new FileReader();

    //        FR.addEventListener("load", function (e) {
    //            document.getElementById("img-upload").src = e.target.result;
    //            alert(e.target.result);
    //        });

    //        FR.readAsDataURL(this.files[0]);
    //    }
    //});

    function readFile() {
        //alert("Image loaded");
        if (this.files && this.files[0]) {

            var FR = new FileReader();

            FR.addEventListener("load", function (e) {
                document.getElementById("img-upload").src = e.target.result;
                //alert(e.target.result);
                document.getElementById("b64").innerHTML = e.target.result;
            });

            FR.readAsDataURL(this.files[0]);
        }

    }

   // document.getElementById("imgInp").addEventListener("change", readFile);

    function encodeImageFileAsURL_Update1(element) {
        //alert('UPDATE');
        var file = element.files[0];
        var reader = new FileReader();
        reader.onloadend = function () {
           // console.log('RESULT', reader.result)
            $("#b64Image_Update").val(reader.result.split(',')[1])
        }
        reader.readAsDataURL(file);
    }
}])

app.filter('capitalize', function () {

    return function (input) {
        //if (input.toLowerCase() == "empty" || input == null || input == "")
        //    return "_";

        var strArr = input.split(' ');
        if (strArr.length == 1) {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        }
        else {
            output = ''
            for (i = 0; i < strArr.length; i++) {
                output += (!!input) ? strArr[i].charAt(0).toUpperCase() + strArr[i].substr(1).toLowerCase() : '';
                output += ' ';
            }
            return output.trim();
        }
    }
});

app.filter('trim', function () {

    return function (input) {
        if (input.toLowerCase() == "empty" || input == null || input == "")
            return "_";

        var strArr = input.split(' ');
        if (strArr.length == 1) {
            return (!!input) ? input.trim() + "_" : '';
        }
        else {
            output = ''
            for (i = 0; i < strArr.length; i++) {
                output += strArr[i].trim();
                output += '_';
            }
            return output.trim();
        }
    }
});

function trimString(input) {
    if (input.toLowerCase() == "empty" || input == null || input == "")
        return "_";

    var strArr = input.split(' ');
    if (strArr.length == 1) {
        return (!!input) ? input.trim() + "_" : '';
    }
    else {
        output = ''
        for (i = 0; i < strArr.length; i++) {
            output += strArr[i].trim();
            output += '_';
        }
        return output.trim();
    }
}

function calculateSum(array) {
    var total = 0;
    for (var i = 0; i < array.length; i++) {
        total += array[i];
    }
    return total;
}

function calculateAverage(array) {
    var arraySum = calculateSum(array);
    return arraySum / array.length;
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function getAverage(array) {
    var retVal = [];
    var _a = [];
    var _b = [];
    var _L = [];

    $.each(array, function (index, value) {
        var retVal = [];

        _a.push(array[index][0]);
        _b.push(array[index][1]);
        _L.push(array[index][2]);
    });
    var _avg_L = calculateAverage(_L);
    var _avg_a = calculateAverage(_a);
    var _avg_b = calculateAverage(_b);

    retVal.push(_avg_L);
    retVal.push(_avg_a);
    retVal.push(_avg_b);

    return retVal;
}

function encodeImageFileAsURL(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        //console.log('RESULT', reader.result)
        $("#b64Image").val(reader.result.split(',')[1])
        $("#b64Image_Update").val(reader.result.split(',')[1])
    }
    reader.readAsDataURL(file);
}

function encodeImageFileAsURL_Update(element) {
    //alert('UPDATE');
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
       // console.log('RESULT', reader.result)
        $("#b64Image_Update").val(reader.result.split(',')[1])
    }
    reader.readAsDataURL(file);
}

app.directive('eChart', function () {
    function drawEChart(scope, el, symbol, condition) {
        var _xScale = [];
        var _yScale = [];
        var _data = [];
        var _colorObj = [];
        var _colorObjScale = [];

        var dataCount = scope.data.length;

        var delta_mean_a = 0;
        var delta_mean_b = 0;

        var delta_mean_L = 0;
        var delta_mean_C = 0;
        var delta_mean_H = 0;

        var delta_target_a = 0;
        var delta_target_b = 0;

        var delta_target_L = 0;
        var delta_target_C = 0;
        var delta_target_H = 0;

        if (dataCount > 0) {
            delta_mean_a = scope.data[0].a_delta_mean
            delta_mean_b = scope.data[0].b_delta_mean

            delta_mean_L = scope.data[0].L_delta_mean
            delta_mean_C = scope.data[0].c_delta_mean
            delta_mean_H = scope.data[0].H_mean

            delta_target_a = scope.data[0]["a_delta_target"]
            delta_target_b = scope.data[0]["b_delta_target"]

            delta_target_L = scope.data[0]["L_delta_target"]
            delta_target_C = scope.data[0]["c_delta_target"]
            delta_target_H = scope.data[0]["H_target"]
        }

        var deltaTarget = 0;
        var deltaMean = 0;

        $.each(scope.data.slice(0, 13000), function (index, value) {

            // AMOL
            //#808080

            var transposedVal = 0;
            switch (symbol) {
                case "a":
                    deltaTarget = delta_target_a;
                    deltaMean = delta_mean_a;
                    transposedVal = this.a_Transposed;
                    _yScale.push(this.a_Transposed);
                    break;
                case "b":
                    deltaTarget = delta_target_b;
                    deltaMean = delta_mean_b;
                    transposedVal = this.b_Transposed;
                    _yScale.push(this.b_Transposed);
                    break;
                case "L":
                    deltaTarget = delta_target_L;
                    deltaMean = delta_mean_L;
                    transposedVal = this.L_Transposed;
                    _yScale.push(this.L_Transposed);
                    break;
                case "C":
                    deltaTarget = delta_target_C;
                    deltaMean = delta_mean_C;
                    transposedVal = this.C_Transposed;
                    _yScale.push(this.C_Transposed);
                    break;
                case "H":
                    deltaTarget = delta_target_H;
                    deltaMean = delta_mean_H;
                    transposedVal = this.H_Transposed;
                    _yScale.push(this.H_Transposed);
                    break;
            }

            switch (condition) {
                case "GreaterThanTarget":
                    if (transposedVal < deltaTarget) {
                        _colorObj.push("#808080");
                        break;
                    }
                    _colorObj.push("#" + this.rgb_Color);
                    break;
                case "LessThanTarget":
                    if (transposedVal > deltaTarget) {
                        _colorObj.push("#808080");
                        break;
                    }
                    _colorObj.push("#" + this.rgb_Color);
                    break;
                case "GreaterThanMean":
                    if (transposedVal < deltaMean) {
                        _colorObj.push("#808080");
                        break;
                    }
                    _colorObj.push("#" + this.rgb_Color);
                    break;
                case "LessThanMean":
                    if (transposedVal > deltaMean) {
                        _colorObj.push("#808080");
                        break;
                    }
                    _colorObj.push("#" + this.rgb_Color);
                    break;
                case "Select":
                    _colorObj.push("#" + this.rgb_Color);
                    break;
            }


            // END

            _xScale.push(this.Sprint_Id);
            //_yScale.push(this.a_Transposed);
            item = {}
            item["xAxis"] = index;
            item["y"] = 350;
            item["name"] = this.Sprint_Id;
            item["symbolSize"] = 0
            _data.push(item);
            //_colorObj.push("#" + this.rgb_Color);
            _colorObjScale.push("#" + this.rgb_Color);
        });

        var yMax = 0;
        var y_Max = Math.max.apply(Math, _yScale);

        var maxVal = 0;
        if (deltaMean <= deltaTarget) {
            maxVal = deltaTarget;
        } else {
            maxVal = deltaMean;
        }

        if (maxVal <= y_Max) {
            yMax = y_Max;
        } else {
            yMax = maxVal;
        }

        var chart = document.getElementById("eChartContainer");
        var myChart = echarts.init(chart);
        var option = {
            color: ['brown', 'green'],
            title: {
                //subtext: symbol + "_Transposed Bar Chart"
            },
            legend: [
                {
                    //data: [symbol + '_Transposed', 'Average', 'Target']
                }
            ],
            tooltip: {
                trigger: 'axis',
                position: function (pos, params, dom, rect, size) {
                    // tooltip will be fixed on the right if mouse hovering on the left,
                    // and on the left if hovering on the right.
                    var obj = { top: 50 };
                    obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
                    return obj;
                },
                backgroundColor: 'rgba(50,50,50,0.8)',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function (params) {
                    var tFilterdata = $.grep(scope.data, function (d) {
                        if (d.Sprint_Id == params[0].name) {
                            return d;
                        }
                    })
                    var tdata = tFilterdata[0];
                    return '<div style="padding:5px 5px 5px 5px;" class="tipbox-div">' +

                        '<table border="1" class="tooltip-table">' +
                        '<tr>' +
                        '<td  colspan="4" class="img-width">' +
                        '<span style="width: 234px; display:block;float:left;"><span style="float:left; padding-top:5px;width:100%;">' + 'Sprint ID ' + '<span style="margin-left:28px"> : ' + tdata.Sprint_Id + '</span> ' + '</span> ' + '<span style="float:left; padding-top:0px;width:100%;">' + 'DeltaE Target : ' + tdata.deltaE_target.toFixed(2) + '</span>' + '</span>' + '<span style="width:150px; float:right;"><img src="/shades/sprint_images/' + tdata.Sprint_Id + '.jpg" /></span>' +
                        ' </td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td>' + 'Formula No' + '</td>' +
                        '<td>' + tdata.Formula_Number + '</td>' +
                        '<td>' + 'Group' + '</td>' +
                        '<td>' + tdata.Group + '</td>' +
                        '</tr>' +

                        '<tr>' +
                        '<td>' + 'Brand' + '</td>' +
                        '<td>' + tdata.Brand + '</td>' +
                        '<td>' + 'Shade Name' + '</td>' +
                        '<td>' + tdata.Commercial_Shade_Name + '</td>' +
                        '</tr>' +

                        '<tr>' +
                        '<td>' + 'Line' + '</td>' +
                        '<td>' + tdata.Line + '</td>' +
                        '<td>' + 'L Transposed' + '</td>' +
                        '<td>' + tdata.L_Transposed + '</td>' +
                        '</tr>' +

                        '<tr>' +
                        '<td>' + 'a Transposed' + '</td>' +
                        '<td>' + tdata.a_Transposed + '</td>' +
                        '<td>' + 'b Transposed' + '</td>' +
                        '<td>' + tdata.b_Transposed + '</td>' +
                        '</tr>' +

                        '<tr>' +
                        '<td>' + 'C Transposed' + '</td>' +
                        '<td>' + tdata.C_Transposed + '</td>' +
                        '<td>' + 'H Transposed' + '</td>' +
                        '<td>' + tdata.H_Transposed + '</td>' +
                        '</tr>' +

                        '</table>' +
                        '</div>';
                }
            },
            grid: {
                left: '3%',
                right: '5%',
                bottom: '0%',
                containLabel: true
            },
            toolbox: {
                show: true,
                itemGap: 15,
                feature: {
                    mark: { show: true },
                    dataZoom: {
                        show: true,
                        title: {
                            zoom: 'Zoom In',
                            back: 'Zoom Out',
                        },
                    },
                    magicType: {
                        show: true, type: ['line', 'bar'],
                        title: {
                            line: 'Line Chart',
                            bar: 'Bar Chart'
                        }
                    },
                    restore: { show: true, title: 'Restore' },
                    saveAsImage: { show: true, title: 'Save' }
                }
            },
            //dataZoom: {
            //    show: true,
            //    realtime: false,
            //    start: 0,
            //    end: 100
            //},
            xAxis: [
                {
                    name: "SprintId",
                    orient: 'vertical',
                    x: 'left',
                    y: 'center',
                    type: 'category',
                    data: _xScale,
                    show: false,
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    //min: 0,
                    max: Math.ceil(yMax + 2),
                    name: symbol + "_Transposed",
                    type: 'value'
                }
            ],
            series:
            [
                {
                    name: symbol + '_Transposed',
                    type: 'bar',
                    barWidth: '60%',
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                var colorList = _colorObj;
                                return colorList[params.dataIndex]
                            },
                            label: {
                                show: false,
                                position: 'top',
                                formatter: '{b}\n{c}'
                            }
                        }
                    },
                    data: _yScale,
                    markLine: {
                        smooth: true,
                        effect: {
                            show: true,
                            color: '#FFA500',
                            scaleSize: 1,
                            period: 30
                        }
                        ,
                        data: [
                            {
                                name: 'Average',
                                value: 60,
                                xAxis: 0,
                                yAxis: deltaMean,
                                itemStyle: {
                                    normal: {
                                        borderWidth: 1,
                                        color: "orange",
                                        lineStyle: {
                                            type: 'solid'
                                        }
                                    }
                                }
                            },
                            {
                                name: 'Target',
                                value: 80,
                                xAxis: 0,
                                yAxis: deltaTarget,
                                itemStyle: {
                                    normal: {
                                        borderWidth: 1,
                                        color: "green",
                                        lineStyle: {
                                            type: 'solid'
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    markPoint: {
                        tooltip: {
                            trigger: 'item',
                            backgroundColor: 'rgba(0,0,0,0)',
                            formatter: function (params) {
                                return '<img src="'
                                    + params.data.symbol.replace('image://', '')
                                    + '"/>';
                            }
                        },
                        data: _data
                    }
                }
            ]
        };
        myChart.setOption(option, true);
    }

    return {
        link: function drawCHART(scope, el) {
            scope.$watch('symbol', function () {
                if (scope.clicked == 1 || scope.clicked == "1") {
                    drawEChart(scope, el, scope.symbol, scope.condition);
                }
            });

            scope.$watch('condition', function () {
                if (scope.clicked == 1 || scope.clicked == "1") {
                    drawEChart(scope, el, scope.symbol, scope.condition);
                }
            });

            scope.$watch('clicked', function myfunction() {
                if (scope.clicked == 1 || scope.clicked == "1") {
                    drawEChart(scope, el, scope.symbol, scope.condition);
                }
            });

        },
        restrict: 'E',
        scope: {
            data: "=",
            symbol: '=ngModel',
            condition: '=ngCondition',
            clicked: '=ngIsclicked'
        },
        template: '<input type="hidden" ng-model="symbol"/>',
        template: '<input type="hidden" ng-Condition="condition"/>',
        template: '<input type="hidden" ng-Isclicked="barPlotClicked"/>'
    }
});

app.directive('eScatter', function () {
    function drawScatter(scope, el, firstSymbol, secondSymbol) {

        var _transposed = [];
        var _varDeltaMean = [];
        var _deltaMean = [];
        var _varDeltaTarget = [];
        var _deltaTarget = [];

        var delta_mean_a = 0;
        var delta_mean_b = 0;

        var delta_mean_L = 0;
        var delta_mean_C = 0;
        var delta_mean_H = 0;

        var delta_target_a = 0;
        var delta_target_b = 0;

        var delta_target_L = 0;
        var delta_target_C = 0;
        var delta_target_H = 0;

        var dataCount = scope.data.length;
        if (dataCount > 0) {
            delta_mean_a = scope.data[0].a_delta_mean
            delta_mean_b = scope.data[0].b_delta_mean

            delta_mean_L = scope.data[0].L_delta_mean
            delta_mean_C = scope.data[0].c_delta_mean
            delta_mean_H = scope.data[0].H_mean

            delta_target_a = scope.data[0]["a_delta_target"]
            delta_target_b = scope.data[0]["b_delta_target"]

            delta_target_L = scope.data[0]["L_delta_target"]
            delta_target_C = scope.data[0]["c_delta_target"]
            delta_target_H = scope.data[0]["H_target"]


            switch (firstSymbol) {
                case "a":
                    _varDeltaTarget.push(delta_target_a)
                    _varDeltaMean.push(delta_mean_a)
                    break;
                case "b":
                    _varDeltaTarget.push(delta_target_b)
                    _varDeltaMean.push(delta_mean_b)
                    break;
                case "L":
                    _varDeltaTarget.push(delta_target_L)
                    _varDeltaMean.push(delta_mean_L)
                    break;
                case "C":
                    _varDeltaTarget.push(delta_target_C)
                    _varDeltaMean.push(delta_mean_C)
                    break;
                case "H":
                    _varDeltaTarget.push(delta_target_H)
                    _varDeltaMean.push(delta_mean_H)
                    break;
            }

            switch (secondSymbol) {
                case "a":
                    _varDeltaTarget.push(delta_target_a)
                    _varDeltaMean.push(delta_mean_a)
                    break;
                case "b":
                    _varDeltaTarget.push(delta_target_b)
                    _varDeltaMean.push(delta_mean_b)
                    break;
                case "L":
                    _varDeltaTarget.push(delta_target_L)
                    _varDeltaMean.push(delta_mean_L)
                    break;
                case "C":
                    _varDeltaTarget.push(delta_target_C)
                    _varDeltaMean.push(delta_mean_C)
                    break;
                case "H":
                    _varDeltaTarget.push(delta_target_H)
                    _varDeltaMean.push(delta_mean_H)
                    break;
            }

            _deltaMean.push(_varDeltaMean);
            _deltaTarget.push(_varDeltaTarget);
        }

        var _colorObj = [];
        //.slice(0, 1000)
        $.each(scope.data, function (index, value) {
            _colorObj.push("#" + this.rgb_Color);
        });

        var _transposed1 = [];

        function getTransposed() {
            $.each(scope.data, function (index, value) {
                var _val1 = [];
                switch (firstSymbol) {
                    case "a":
                        _val1.push(this.a_Transposed)
                        break;
                    case "b":
                        _val1.push(this.b_Transposed)
                        break;
                    case "L":
                        _val1.push(this.L_Transposed)
                        break;
                    case "C":
                        _val1.push(this.C_Transposed)
                        break;
                    case "H":
                        _val1.push(this.H_Transposed)
                        break;
                }

                switch (secondSymbol) {
                    case "a":
                        _val1.push(this.a_Transposed)
                        _val1.push(this.Sprint_Id)
                        break;
                    case "b":
                        _val1.push(this.b_Transposed)
                        _val1.push(this.Sprint_Id)
                        break;
                    case "L":
                        _val1.push(this.L_Transposed)
                        _val1.push(this.Sprint_Id)
                        break;
                    case "C":
                        _val1.push(this.C_Transposed)
                        _val1.push(this.Sprint_Id)
                        break;
                    case "H":
                        _val1.push(this.H_Transposed)
                        _val1.push(this.Sprint_Id)
                        break;
                }
                _transposed1.push(_val1);
            });
            return _transposed1;
        }

        $("#divLoadScatterPlot").html('');
        $('#divLoadScatterPlot').append('<div id="eScatterContainer" class="eResize" style="width:100% !important; height:450px;"></div >');

        var chart = document.getElementById("eScatterContainer");
        var myChart = echarts.init(chart);
        option = {
            title: {
                //subtext: firstSymbol + ' vs ' + secondSymbol + ' Scatter Plot'
            },
            grid: {
                left: '4.8%',
                right: '10%',
                bottom: '3%',
                containLabel: true
            },
            tooltip: {
                // trigger: 'axis',
                backgroundColor: 'rgba(50,50,50,0.8)',
                showDelay: 0,
                formatter: function (params) {
                    if (params.seriesName == 'Average') {
                        if (params.value.length > 1) {
                            return '<div style="padding:5px 5px 5px 5px;">' +
                                params.seriesName + ' :<br/>' +
                                '<table border="1" class="tooltip-table">' +
                                '<tr>' +
                                '<td>' + firstSymbol + ' Average' + '</td>' +
                                '<td>' + params.value[0] + '</td>' +

                                '</tr>' +

                                '<tr>' +
                                '<td>' + secondSymbol + ' Average' + '</td>' +
                                '<td>' + params.value[1] + '</td>' +
                                '</tr>' +

                                '</table>' +
                                '</div>';
                        }
                        else {
                            return params.seriesName + ' :<br/>'
                                + params.name + ' : '
                                + params.value;
                        }
                    }
                    else if (params.seriesName == 'Target') {
                        if (params.value.length > 1) {
                            return '<div style="padding:5px 5px 5px 5px;">' +
                                params.seriesName + ' :<br/>' +
                                '<table border="1" class="tooltip-table">' +
                                '<tr>' +
                                '<td>' + firstSymbol + ' Target' + '</td>' +
                                '<td>' + params.value[0] + '</td>' +

                                '</tr>' +

                                '<tr>' +
                                '<td>' + secondSymbol + ' Target' + '</td>' +
                                '<td>' + params.value[1] + '</td>' +
                                '</tr>' +

                                '</table>' +
                                '</div>';
                        }
                        else {
                            return params.seriesName + ' :<br/>'
                                + params.name + ' : '
                                + params.value;
                        }
                    }
                    else {
                        if (params.value.length > 1) {
                            var tFilterdata = $.grep(scope.data, function (d) {
                                if (d.Sprint_Id == params.value[2]) {
                                    return d;
                                }
                            })
                            var tdata = tFilterdata[0];
                            return '<div style="padding:5px 5px 5px 5px;" class="tipbox-div">' +

                                '<table border="1" class="tooltip-table">' +
                                '<tr>' +
                                '<td  colspan="4" class="img-width">' +
                                '<span style="width: 234px; display:block;float:left;"><span style="float:left; padding-top:5px;width:100%;">' + 'Sprint ID ' + '<span style="margin-left:28px"> : ' + tdata.Sprint_Id + '</span> ' + '</span> ' + '<span style="float:left; padding-top:0px;width:100%;">' + 'DeltaE Target : ' + tdata.deltaE_target.toFixed(2) + '</span>' + '</span>' + '<span style="width:150px; float:right;"><img src="/shades/sprint_images/' + tdata.Sprint_Id + '.jpg" /></span>' +
                                ' </td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>' + 'Formula No' + '</td>' +
                                '<td>' + tdata.Formula_Number + '</td>' +
                                '<td>' + 'Group' + '</td>' +
                                '<td>' + tdata.Group + '</td>' +
                                '</tr>' +

                                '<tr>' +
                                '<td>' + 'Brand' + '</td>' +
                                '<td>' + tdata.Brand + '</td>' +
                                '<td>' + 'Shade Name' + '</td>' +
                                '<td>' + tdata.Commercial_Shade_Name + '</td>' +
                                '</tr>' +

                                '<tr>' +
                                '<td>' + 'Line' + '</td>' +
                                '<td>' + tdata.Line + '</td>' +
                                '<td>' + 'L Transposed' + '</td>' +
                                '<td>' + tdata.L_Transposed + '</td>' +
                                '</tr>' +

                                '<tr>' +
                                '<td>' + 'a Transposed' + '</td>' +
                                '<td>' + tdata.a_Transposed + '</td>' +
                                '<td>' + 'b Transposed' + '</td>' +
                                '<td>' + tdata.b_Transposed + '</td>' +
                                '</tr>' +

                                '<tr>' +
                                '<td>' + 'C Transposed' + '</td>' +
                                '<td>' + tdata.C_Transposed + '</td>' +
                                '<td>' + 'H Transposed' + '</td>' +
                                '<td>' + tdata.H_Transposed + '</td>' +
                                '</tr>' +

                                '</table>' +
                                '</div>';
                        }
                        else {
                            return params.seriesName + ' :<br/>'
                                + params.name + ' : '
                                + params.value;
                        }
                    }
                },
                axisPointer: {
                    show: true,
                    type: 'cross',
                    lineStyle: {
                        type: 'dashed',
                        width: 1
                    }
                },
                zlevel: 1
            },
            toolbox: {
                show: true,
                itemGap: 15,
                feature: {
                    mark: { show: true },
                    dataZoom: {
                        show: true,
                        title: {
                            zoom: 'Zoom In',
                            back: 'Zoom Out',
                        },
                    },
                    restore: { show: true, title: 'Restore' },
                    saveAsImage: { show: true, title: 'Save' }
                }
            },
            legend: {
                data: ['Shade', 'Average', 'Target'],
                left: 'center'
            },
            xAxis: [
                {
                    type: 'value',
                    name: firstSymbol + '_Transposed',
                    scale: true,
                    axisLabel: {
                        formatter: '{value}'
                    },
                    splitLine: {
                        show: false
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: secondSymbol + '_Transposed',
                    scale: true,
                    axisLabel: {
                        formatter: '{value}'
                    },
                    splitLine: {
                        show: false
                    }
                }
            ],
            series: [
                {
                    name: 'Shade',
                    type: 'scatter',
                    //large: true,
                    symbolSize: 18,
                    data: getTransposed(),
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                var colorList = _colorObj;
                                return colorList[params.dataIndex]
                            },
                            label: {
                                show: false,
                                position: 'top',
                                formatter: '{b}\n{c}'
                            }
                        }
                    }
                },
                {
                    name: 'Average',
                    type: 'scatter',
                    data: _deltaMean,
                    symbol: 'square', //'circle', 'rectangle', 'triangle', 'diamond', 'emptyCircle', 'emptyRectangle', 'emptyTriangle', 'emptyDiamond', 'pin'
                    symbolSize: 18,
                    itemStyle: {
                        normal: {
                            color: "orange",
                            label: {
                                show: false,
                                position: 'top',
                                formatter: '{b}\n{c}'
                            }
                        }
                    }
                },
                {
                    name: 'Target',
                    type: 'scatter',
                    data: _deltaTarget,
                    symbol: 'triangle', //'circle', 'rectangle', 'triangle', 'diamond', 'emptyCircle', 'emptyRectangle', 'emptyTriangle', 'emptyDiamond', 'pin'
                    symbolSize: 20,
                    itemStyle: {
                        normal: {
                            color: "green",
                            label: {
                                show: false,
                                position: 'top',
                                formatter: '{b}\n{c}'
                            }
                        }
                    }
                }
            ]
        };
        myChart.setOption(option, true);
    }

    return {
        link: function barScatterChart(scope, el) {
            scope.$watch('firstSymbol', function () {
                if (scope.clicked == 1 || scope.clicked == "1") {
                    drawScatter(scope, el, scope.firstSymbol, scope.secondSymbol);
                }
            });

            scope.$watch('secondSymbol', function () {
                if (scope.clicked == 1 || scope.clicked == "1") {
                    drawScatter(scope, el, scope.firstSymbol, scope.secondSymbol);
                }
            });

            scope.$watch('clicked', function () {
                if (scope.clicked == 1 || scope.clicked == "1") {
                    drawScatter(scope, el, scope.firstSymbol, scope.secondSymbol);
                }
            });

        },
        restrict: 'E',
        transclude: true,
        scope: {
            data: "=",
            type: "=ngType",
            typeData: "=",
            firstSymbol: '=ngModel',
            secondSymbol: '=ngSecondmodel',
            clicked: '=ngIsclicked'
        },
        template: '<input type="hidden" ng-model="firstSymbol"/>',
        template: '<input type="hidden" ng-Secondmodel="secondSymbol"/>',
        template: '<input type="hidden" ng-Isclicked="scatterPlotClicked"/>'
    }
});

app.directive('eScatterthreed', function () {
    function drawScatter3D(scope, el) {
        var range = scope.range;
        var mean = {
            "L_Transposed": ((parseInt(range.L_min) + parseInt(range.L_max)) / 2),
            "a_Transposed": ((parseInt(range.a_min) + parseInt(range.a_max)) / 2),
            "b_Transposed": ((parseInt(range.b_min) + parseInt(range.b_max)) / 2)
        };

        var target = {
            "L_Transposed": parseInt(range.L),
            "a_Transposed": parseInt(range.a),
            "b_Transposed": parseInt(range.b)
        };

        var _colorObj = [];
        var _transposed = [];


        var cloneData = clone(scope.data);

        $.each(cloneData, function (index, value) {
            var _val = [];

            _val.push(this.L_Transposed);
            _val.push(this.a_Transposed);
            _val.push(this.b_Transposed);
            _val.push(this.Sprint_Id);

            _transposed.push(_val);
            _colorObj.push("#" + this.rgb_Color);
        });

        var delta_mean = [];
        var _rval_mean = [];
        _rval_mean.push(((parseInt(range.L_min) + parseInt(range.L_max)) / 2));
        _rval_mean.push(((parseInt(range.a_min) + parseInt(range.a_max)) / 2));
        _rval_mean.push(((parseInt(range.b_min) + parseInt(range.b_max)) / 2));
        _rval_mean.push('Average');
        delta_mean.push(_rval_mean);

        var delta_target = [];
        var _rval_target = [];
        _rval_target.push(parseInt(range.L));
        _rval_target.push(parseInt(range.a));
        _rval_target.push(parseInt(range.b));
        _rval_target.push('Target');

        delta_target.push(_rval_target);

        $("#testID").html('');
        $('#testID').append('<div id="eScatter3D" class="eResize" style="width:100 % !important; height: 490px; "></div >');

        var chart = document.getElementById("eScatter3D");
        var myChart = echarts.init(chart);


        var valMin = -0.50392554006250002; //Infinity;
        var valMax = 0.50392554006250002; //-Infinity;

        var data = _transposed; //generateData(2, -5, 5);

        option = {
            title: {
                subtext: "3D Dynamics"
            },
            legend: {
                data: ['Shades', 'Average', 'Target'],
                left: 'center'
            },
            tooltip: {
                backgroundColor: 'rgba(50,50,50,0.8)',
                trigger: 'item',
                position: function (pos, params, dom, rect, size) {
                    // tooltip will be fixed on the right if mouse hovering on the left,
                    // and on the left if hovering on the right.
                    var obj = { top: 50 };
                    obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
                    return obj;
                },
                formatter: function (params) {
                    var tFilterdata = $.grep(scope.data, function (d) {
                        if (d.Sprint_Id == params.data[3]) {
                            return d;
                        }
                    })
                    var tdata = tFilterdata[0];
                    if (params.data[3] == "Average") {
                        return '<div style="padding:5px 5px 5px 5px;">' +
                            params.data[3] + ' :<br/>' +
                            '<table border="1" class="tooltip-table">' +
                            '<tr>' +
                            '<td>' + 'L Average' + '</td>' +
                            '<td>' + mean.L_Transposed + '</td>' +
                            '</tr>' +

                            '<tr>' +
                            '<td>' + 'a Average' + '</td>' +
                            '<td>' + mean.a_Transposed + '</td>' +
                            '</tr>' +

                            '<tr>' +
                            '<td>' + 'b Average' + '</td > ' +
                            '<td>' + mean.b_Transposed + '</td>' +
                            '</tr>' +

                            '</table>' +
                            '</div>';
                    }
                    else if (params.data[3] == "Target") {
                        return '<div style="padding:5px 5px 5px 5px;">' +
                            params.data[3] + ' :<br/>' +
                            '<table border="1" class="tooltip-table">' +
                            '<tr>' +
                            '<td>' + 'L Target' + '</td>' +
                            '<td>' + target.L_Transposed + '</td>' +
                            '</tr>' +

                            '<tr>' +
                            '<td>' + 'a Target' + '</td>' +
                            '<td>' + target.a_Transposed + '</td>' +
                            '</tr>' +

                            '<tr>' +
                            '<td>' + 'b Target' + '</td > ' +
                            '<td>' + target.b_Transposed + '</td>' +
                            '</tr>' +

                            '</table>' +
                            '</div>';
                    }
                    else {
                        return '<div style="padding:5px 5px 5px 5px;" class="tipbox-div">' +

                            '<table border="1" class="tooltip-table">' +
                            '<tr>' +
                            '<td  colspan="4" class="img-width">' +
                            '<span style="width: 234px; display:block;float:left;"><span style="float:left; padding-top:5px;width:100%;">' + 'Sprint ID ' + '<span style="margin-left:28px"> : ' + tdata.Sprint_Id + '</span> ' + '</span> ' + '<span style="float:left; padding-top:0px;width:100%;">' + 'DeltaE Target : ' + tdata.deltaE_target.toFixed(2) + '</span>' + '</span>' + '<span style="width:150px; float:right;"><img src="/shades/sprint_images/' + tdata.Sprint_Id + '.jpg" /></span>' +
                            ' </td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>' + 'Formula No' + '</td>' +
                            '<td>' + tdata.Formula_Number + '</td>' +
                            '<td>' + 'Group' + '</td>' +
                            '<td>' + tdata.Group + '</td>' +
                            '</tr>' +

                            '<tr>' +
                            '<td>' + 'Brand' + '</td>' +
                            '<td>' + tdata.Brand + '</td>' +
                            '<td>' + 'Shade Name' + '</td>' +
                            '<td>' + tdata.Commercial_Shade_Name + '</td>' +
                            '</tr>' +

                            '<tr>' +
                            '<td>' + 'Line' + '</td>' +
                            '<td>' + tdata.Line + '</td>' +
                            '<td>' + 'L Transposed' + '</td>' +
                            '<td>' + tdata.L_Transposed + '</td>' +
                            '</tr>' +

                            '<tr>' +
                            '<td>' + 'a Transposed' + '</td>' +
                            '<td>' + tdata.a_Transposed + '</td>' +
                            '<td>' + 'b Transposed' + '</td>' +
                            '<td>' + tdata.b_Transposed + '</td>' +
                            '</tr>' +

                            '<tr>' +
                            '<td>' + 'C Transposed' + '</td>' +
                            '<td>' + tdata.C_Transposed + '</td>' +
                            '<td>' + 'H Transposed' + '</td>' +
                            '<td>' + tdata.H_Transposed + '</td>' +
                            '</tr>' +

                            '</table>' +
                            '</div>';
                    }
                }
            },
            toolbox: {
                show: true,
                itemGap: 15,
                feature: {
                    mark: { show: true },
                    restore: { show: true, title: 'Restore' },
                    saveAsImage: { show: true, title: 'Save' }
                }
            },
            xAxis3D: {
                type: 'value',
                name: 'L'
            },
            yAxis3D: {
                type: 'value',
                name: 'a'
            },
            zAxis3D: {
                type: 'value',
                name: 'b'
            },
            grid3D: {
                axisLine: {
                    lineStyle: { color: '#000' }
                },
                axisPointer: {
                    lineStyle: { color: '#000' }
                },
                viewControl: {
                    // autoRotate: true
                }
            },
            series: [{
                name: 'Shades',
                type: 'scatter3D',
                data: data,
                symbolSize: 18,

                itemStyle: {
                    color: function (params) {
                        var colorList = _colorObj;
                        return colorList[params.dataIndex]
                    },
                }
            },
            {
                name: 'Average',
                type: 'scatter3D',
                data: delta_mean,
                symbolSize: 20,
                symbol: 'square',
                itemStyle: {
                    color: 'orange'
                }
            },
            {
                name: 'Target',
                type: 'scatter3D',
                data: delta_target,
                symbol: 'triangle',
                symbolSize: 20,
                itemStyle: {
                    color: 'green'
                }
            }
            ]
        };

        myChart.setOption(option, true);
    }

    return {
        //link: drawScatter3D,
        link: function draw3DScatterPlot(scope, el) {
            scope.$watch('clicked', function myfunction() {
                if (scope.clicked == 1 || scope.clicked == "1") {
                    drawScatter3D(scope, el);
                }
            });
        },
        restrict: 'E',
        transclude: true,
        scope: {
            data: "=",
            range: '=ngRange',
            clicked: '=ngIsclicked'
        },
        template: '<input type="hidden" ng-range="range"/>',
        template: '<input type="hidden" ng-Isclicked="scatter3DClicked"/>'
    }
});

app.directive('excelExport', function () {
    return {
        restrict: 'A',
        scope: {
            fileName: "@",
            data: "&exportData"
        },
        replace: true,
        template: '<button class="btn btn-primary btn-ef btn-ef-3 btn-ef-3c mb-10 export-ex" ng-click="download()">Export to Excel <i class="icon-download-alt e-i"></i></button>',
        link: function (scope, element) {

            scope.download = function () {

                function datenum(v, date1904) {
                    if (date1904) v += 1462;
                    var epoch = Date.parse(v);
                    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
                };

                function getSheet(data, opts) {
                    var ws = {};
                    var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
                    for (var R = 0; R != data.length; ++R) {
                        for (var C = 0; C != data[R].length; ++C) {
                            if (range.s.r > R) range.s.r = R;
                            if (range.s.c > C) range.s.c = C;
                            if (range.e.r < R) range.e.r = R;
                            if (range.e.c < C) range.e.c = C;
                            var cell = { v: data[R][C] };
                            if (cell.v == null) continue;
                            var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

                            if (typeof cell.v === 'number') cell.t = 'n';
                            else if (typeof cell.v === 'boolean') cell.t = 'b';
                            else if (cell.v instanceof Date) {
                                cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                                cell.v = datenum(cell.v);
                            }
                            else cell.t = 's';

                            ws[cell_ref] = cell;
                        }
                    }
                    if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
                    return ws;
                };

                function Workbook() {
                    if (!(this instanceof Workbook)) return new Workbook();
                    this.SheetNames = [];
                    this.Sheets = {};
                }

                var wb = new Workbook(), ws = getSheet(scope.data());
                /* add worksheet to workbook */
                wb.SheetNames.push(scope.fileName);
                wb.Sheets[scope.fileName] = ws;
                var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });

                function s2ab(s) {
                    var buf = new ArrayBuffer(s.length);
                    var view = new Uint8Array(buf);
                    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                    return buf;
                }

                saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), scope.fileName + '.xlsx');

            };

        }
    };
});

app.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});

app.directive('eLine', function () {

    function drawLineChart(scope, el) {
        var _xScale = [];
        var _yScale = [];
        var _data = [];
        var _series = [];
        var _colorObj = [];

        for (var index in scope.data[0]) {
            var formulaNo = scope.data[0][index].Formula_Number;
            if (formulaNo === null || formulaNo.toLowerCase() == 'empty' || isNaN(formulaNo)) {
                _data.push(scope.data[0][index].Name_of_Campaign + ' ' + scope.data[0][index].Brand);
            } else {
                _data.push(scope.data[0][index].Formula_Number);
            }
            

            //if (scope.data[0][index].Formula_Number.toLowerCase() == 'empty' || scope.data[0][index].Formula_Number.toLowerCase() == '' || scope.data[0][index].Formula_Number == null) {
            //    _data.push(scope.data[0][index].Name_of_Campaign + ' ' + scope.data[0][index].Brand);
            //} else {
            //    _data.push(scope.data[0][index].Formula_Number);
            //}
            var _val = [];

            _val.push(scope.data[0][index].L_Transposed);
            _val.push(scope.data[0][index].a_Transposed);
            _val.push(scope.data[0][index].b_Transposed);
            _val.push(scope.data[0][index].C_Transposed);
            _val.push(scope.data[0][index].H_Transposed);
            _yScale.push(_val);

            _colorObj.push("#" + scope.data[0][index].rgb_Color);
        }

        var firstNearestName = null;
        var secondNearestName = null;
        var thirdNearestName = null;
        var fourthNearestName = null;
        var fifthNearestName = null;
        var sixthNearestName = null;
        var seventhNearestName = null;
        var eigthNearestName = null;
        var ninethNearestName = null;
        var tenthNearestName = null;
        var eleventhNearestName = null;
        var twelfthNearestName = null;
        var thirteenthNearestName = null;

        var firstNearestColor = null;
        var secondNearestColor = null;
        var thirdNearestColor = null;
        var fourthNearestColor = null;
        var fifthNearestColor = null;
        var sixthNearestColor = null;
        var seventhNearestColor = null;
        var eigthNearestColor = null;
        var ninethNearestColor = null;
        var tenthNearestColor = null;
        var eleventhNearestColor = null;
        var twelfthNearestColor = null;
        var thirteenthNearestColor = null;

        var firstNearestData = [];
        var secondNearestData = [];
        var thirdNearestData = [];
        var fourthNearestData = [];
        var fifthNearestData = [];
        var sixthNearestData = [];
        var seventhNearestData = [];
        var eigthNearestData = [];
        var ninethNearestData = [];
        var tenthNearestData = [];
        var eleventhNearestData = [];
        var twelfthNearestData = [];
        var thirteenthNearestData = [];

        for (var i in _yScale) {
            item = {};
            var normal = {};
            var itemStyle = {};
            item['name'] = _data[i];
            item['type'] = 'line';
            item['smooth'] = true;
            item['data'] = _yScale[i];

            normal['color'] = _colorObj[i];
            itemStyle['normal'] = normal;
            item['itemStyle'] = itemStyle;
            _series.push(item)



            switch (parseInt(i)) {
                case 0:
                    firstNearestName = _data[i];
                    firstNearestColor = _colorObj[i];
                    firstNearestData = _yScale[i];
                    break;
                case 1:
                    secondNearestName = _data[i];
                    secondNearestColor = _colorObj[i];
                    secondNearestData = _yScale[i];
                    break;
                case 2:
                    thirdNearestName = _data[i];
                    thirdNearestColor = _colorObj[i];
                    thirdNearestData = _yScale[i];
                    break;
                case 3:
                    fourthNearestName = _data[i];
                    fourthNearestColor = _colorObj[i];
                    fourthNearestData = _yScale[i];
                    break;
                case 4:
                    fifthNearestName = _data[i];
                    fifthNearestColor = _colorObj[i];
                    fifthNearestData = _yScale[i];
                    break;
                case 5:
                    sixthNearestName = _data[i];
                    sixthNearestColor = _colorObj[i];
                    sixthNearestData = _yScale[i];
                    break;
                case 6:
                    seventhNearestName = _data[i];
                    seventhNearestColor = _colorObj[i];
                    seventhNearestData = _yScale[i];
                    break;
                case 7:
                    eigthNearestName = _data[i];
                    eigthNearestColor = _colorObj[i];
                    eigthNearestData = _yScale[i];
                    break;
                case 8:
                    ninethNearestName = _data[i];
                    ninethNearestColor = _colorObj[i];
                    ninethNearestData = _yScale[i];
                    break;
                case 9:
                    tenthNearestName = _data[i];
                    tenthNearestColor = _colorObj[i];
                    tenthNearestData = _yScale[i];
                    break;
                case 10:
                    eleventhNearestName = _data[i];
                    eleventhNearestColor = _colorObj[i];
                    eleventhNearestData = _yScale[i];
                    break;
                case 11:
                    twelfthNearestName = _data[i];
                    twelfthNearestColor = _colorObj[i];
                    twelfthNearestData = _yScale[i];
                    break;
                case 12:
                    thirteenthNearestName = _data[i];
                    thirteenthNearestColor = _colorObj[i];
                    thirteenthNearestData = _yScale[i];
                    break;
            }
        }
        _xScale.unshift('L', 'a', 'b', 'C', 'H');
        var chart = document.getElementById("eLineContainer");
        var myChart = echarts.init(chart);
        var option = {
            title: {
                //subtext: 'LINE'
            },
            legend: [
                {
                    data: _data
                }
            ],
            tooltip: {
                trigger: 'axis',
            },
            grid: {
                left: '1%',
                right: '8%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                show: true,
                itemGap: 20,
                orient: 'vertical',
                x: '95%',
                y: '160px',
                feature: {
                    mark: { show: true },
                    dataZoom: {
                        show: true,
                        title: {
                            zoom: 'Zoom In',
                            back: 'Zoom Out',
                        },
                    },
                    magicType: {
                        show: true, type: ['line', 'bar'],
                        title: {
                            line: 'Line Chart',
                            bar: 'Bar Chart'
                        }
                    },
                    restore: { show: true, title: 'Restore' },
                    saveAsImage: { show: true, title: 'Save' }
                }
            },
            xAxis: [
                {
                    type: 'category',
                    data: _xScale,
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: firstNearestName,
                    type: 'line',
                    smooth: true,
                    //color: firstNearestColor,
                    data: firstNearestData,
                    itemStyle: {
                        normal: {
                            color: firstNearestColor
                        }
                    }
                },
                {
                    name: secondNearestName,
                    type: 'line',
                    smooth: true,
                    //color: secondNearestColor,
                    data: secondNearestData,
                    itemStyle: {
                        normal: {
                            color: secondNearestColor
                        }
                    }
                },
                {
                    name: thirdNearestName,
                    type: 'line',
                    smooth: true,
                    //color: thirdNearestColor,
                    data: thirdNearestData,
                    itemStyle: {
                        normal: {
                            color: thirdNearestColor
                        }
                    }
                },
                {
                    name: fourthNearestName,
                    type: 'line',
                    smooth: true,
                    //color: fourthNearestColor,
                    data: fourthNearestData,
                    itemStyle: {
                        normal: {
                            color: fourthNearestColor
                        }
                    }
                },
                {
                    name: fifthNearestName,
                    type: 'line',
                    smooth: true,
                    //color: fifthNearestColor,
                    data: fifthNearestData,
                    itemStyle: {
                        normal: {
                            color: fifthNearestColor
                        }
                    }
                },
                {
                    name: sixthNearestName,
                    type: 'line',
                    smooth: true,
                    //color: sixthNearestColor,
                    data: sixthNearestData,
                    itemStyle: {
                        normal: {
                            color: sixthNearestColor
                        }
                    }
                },
                {
                    name: seventhNearestName,
                    type: 'line',
                    smooth: true,
                    //color: seventhNearestColor,
                    data: seventhNearestData,
                    itemStyle: {
                        normal: {
                            color: seventhNearestColor
                        }
                    }
                },
                {
                    name: eigthNearestName,
                    type: 'line',
                    smooth: true,
                    //color: eigthNearestColor,
                    data: eigthNearestData,
                    itemStyle: {
                        normal: {
                            color: eigthNearestColor
                        }
                    }
                },
                {
                    name: ninethNearestName,
                    type: 'line',
                    smooth: true,
                    //color: ninethNearestColor,
                    data: ninethNearestData,
                    itemStyle: {
                        normal: {
                            color: ninethNearestColor
                        }
                    }
                },
                {
                    name: tenthNearestName,
                    type: 'line',
                    smooth: true,
                    //color: tenthNearestColor,
                    data: tenthNearestData,
                    itemStyle: {
                        normal: {
                            color: tenthNearestColor
                        }
                    }
                },
                {
                    name: eleventhNearestName,
                    type: 'line',
                    smooth: true,
                    //color: eleventhNearestColor,
                    data: eleventhNearestData,
                    itemStyle: {
                        normal: {
                            color: eleventhNearestColor
                        }
                    }
                },
                {
                    name: twelfthNearestName,
                    type: 'line',
                    smooth: true,
                    color: twelfthNearestColor,
                    //data: twelfthNearestData,
                    itemStyle: {
                        normal: {
                            color: twelfthNearestColor
                        }
                    }
                },
                {
                    name: thirteenthNearestName,
                    type: 'line',
                    smooth: true,
                    //color: thirteenthNearestColor,
                    data: thirteenthNearestData,
                    itemStyle: {
                        normal: {
                            color: thirteenthNearestColor
                        }
                    },
                    //markLine: {
                    //    silent: true,
                    //    data: [{
                    //        yAxis: 50
                    //    }, {
                    //        yAxis: 45
                    //    }, {
                    //        yAxis: 35
                    //    }]
                    //}
                    markLine: {
                        smooth: true,
                        effect: {
                            show: true,
                            color: '#FFA500',
                            scaleSize: 1,
                            period: 30
                        }
                        ,
                        data: [
                            {
                                name: 'Average',
                                value: 60,
                                xAxis: 0,
                                yAxis: 55,
                                itemStyle: {
                                    normal: {
                                        borderWidth: 1,
                                        color: "orange",
                                        lineStyle: {
                                            type: 'dashed'
                                        }
                                    }
                                }
                            },
                            {
                                name: 'Target',
                                value: 80,
                                xAxis: 0,
                                yAxis: 30,
                                itemStyle: {
                                    normal: {
                                        borderWidth: 1,
                                        color: "green",
                                        lineStyle: {
                                            type: 'dashed'
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            ]
        };
        myChart.setOption(option, true);
    }

    return {
        //link: drawLineChart,
        link: function drawNearestFormula(scope, el) {
            scope.$watch('clicked', function myfunction() {
                if (scope.clicked == 1 || scope.clicked == "1") {
                    drawLineChart(scope, el);
                }
            });
        },
        restrict: 'E',
        scope: {
            data: "=",
            clicked: '=ngIsclicked'
        },
        template: '<input type="hidden" ng-Isclicked="nearestFormulaClicked"/>'
    }
});

app.directive('eCluster3d', function () {
    function drawCluster3D(scope, el) {

        var uniqueNames = [];
        var uniqueObj = [];
        for (i = 0; i < scope.data.length; i++) {
            if (uniqueNames.indexOf(scope.data[i].label) === -1) {
                uniqueObj.push(scope.data[i].label)
                uniqueNames.push(scope.data[i].label);
            }
        }

        var clusterLegend = [];
        var outerClusters = [];
        for (var i = 1; i <= uniqueObj.length; i++) {
            clusterLegend.push("Cluster " + i)
            outerClusters.push([]);
        }
        //console.log(outerClusters);

        //added by vivek
        var idx = 0;

        $.each(scope.data, function (index, value) {
            var label = this.label;
            var innerClusters = [];
            //innerClusters.push(this.x)
            //innerClusters.push(this.y)
            innerClusters.push(this.a_Transposed)
            innerClusters.push(this.b_Transposed)
            innerClusters.push(this.L_Transposed)
            innerClusters.push(this.label + 1)
            outerClusters[label].push(innerClusters);
        });

        ////added by vivek
        var seriesData = [];
        //var symbolCollection = ['circle', 'square', 'triangle', 'diamond', 'emptyDiamond', 'emptyTriangle']
        var symbolCollection = ['circle', 'square', 'triangle', 'diamond']

        for (var i = 1; i <= uniqueObj.length; i++) {
            var seriesProp = {};
            var normal = {};
            seriesProp['name'] = 'Cluster ' + i;
            seriesProp['type'] = 'scatter3D';
            seriesProp['symbol'] = symbolCollection[Math.floor(Math.random() * 5) + 1];
            seriesProp['data'] = outerClusters[i - 1];
            normal['color'] = getRandomColor();
            seriesProp['itemStyle'] = normal;
            seriesData.push(seriesProp);
            //console.log("Series Data");
            //console.log(seriesData);
        }

        function getRandomColor() {
            var letters = '0123456789ABCDEFGHIJKLMNOP';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }


        //---------------------------------------------------------------//

        // END //
        $("#testClusterID").html('');
        $('#testClusterID').append('<div id="eTestCluster3D" class="eResize" style="width:100 % !important; height: 490px; "></div >');
        var chart = document.getElementById("eTestCluster3D");
        var myChart = echarts.init(chart);
        var valMin = -0.50392554006250002; //Infinity;
        var valMax = 0.50392554006250002; //-Infinity;


        option = {
            title: {
                //subtext: 'Classification'
            },
            grid: {
                left: '3%',
                right: '7%',
                bottom: '3%',
                containLabel: true
            },
            tooltip: {
                // trigger: 'axis',
                backgroundColor: 'rgba(50,50,50,0.8)',
                showDelay: 0,
                formatter: function (params) {
                    if (params.value.length > 1) {
                        return '<div style="padding:5px 5px 5px 5px;">' +
                            params.seriesName + ' :<br/>' +
                            '<table border="1" class="tooltip-table">' +
                            '<tr>' +
                            '<td>' + 'L Transposed' + '</td>' +
                            '<td>' + params.value[2] + '</td>' +
                            '</tr>' +

                            '<tr>' +
                            '<td>' + 'a Transposed' + '</td>' +
                            '<td>' + params.value[0] + '</td>' +
                            '</tr>' +

                            '<tr>' +
                            '<td>' + 'b Transposed' + '</td > ' +
                            '<td>' + params.value[1] + '</td>' +
                            '</tr>' +

                            '</table>' +
                            '</div>';


                    }
                    else {
                        return params.seriesName + ' :<br/>'
                            + params.name + ' : '
                            + params.value;
                    }
                },
                axisPointer: {
                    show: true,
                    type: 'cross',
                    lineStyle: {
                        type: 'dashed',
                        width: 1
                    }
                }
            },
            toolbox: {
                show: true,
                itemGap: 20,
                orient: 'vertical',
                x: '95%',
                y: '180px',
                feature: {
                    mark: { show: true },
                    restore: { show: true, title: 'Restore' },
                    saveAsImage: { show: true, title: 'Save' }
                }
            },
            legend: {
                //data: ['Cluster 1', 'Cluster 2', 'Cluster 3', 'Cluster 4', 'Cluster 5', 'Cluster 6', 'Cluster 7'],
                type: 'scroll',
                data: clusterLegend,
                //left: 'center',
                tooltip: {
                    show: true,
                    trigger: 'item',
                    triggerOn: 'mousemove'
                    ,
                    formatter: function (name) {
                        var drres = $.grep(seriesData, function (e) { return e.name == name.name });
                        var result = getAverage(drres[0].data)
                        //console.log(result);
                        if (result != null) {
                            return '<div style="padding:5px 5px 5px 5px;">' +
                                name.name + ' :<br/>' +
                                '<table border="1" class="tooltip-table">' +
                                '<tr>' +
                                '<td>' + 'L Average' + '</td>' +
                                '<td>' + (result[0]).toFixed(2) + '</td>' +
                                '</tr>' +

                                '<tr>' +
                                '<td>' + 'a Average' + '</td>' +
                                '<td>' + (result[1]).toFixed(2) + '</td>' +
                                '</tr>' +

                                '<tr>' +
                                '<td>' + 'b Average' + '</td > ' +
                                '<td>' + (result[2]).toFixed(2) + '</td>' +
                                '</tr>' +

                                '</table>' +
                                '</div>';
                        }
                    }
                }
            },
            xAxis3D: {
                type: 'value',
                name: 'a'
            },
            yAxis3D: {
                type: 'value',
                name: 'b'
            },
            zAxis3D: {
                type: 'value',
                name: 'L'
            },
            grid3D: {
                axisLine: {
                    lineStyle: { color: '#000' }
                },
                axisPointer: {
                    lineStyle: { color: '#000' }
                },
                viewControl: {
                    // autoRotate: true
                }
            },
            series: seriesData
        };
        myChart.setOption(option, true);
    }

    return {
        //link: drawScatter,
        link: function draw3DCHART(scope, el) {
            scope.$watch('clicked', function myfunction() {
                drawCluster3D(scope, el, scope.symbol, scope.condition);
            });
        },
        restrict: 'E',
        transclude: true,
        scope: {
            data: "="
        }
    }
});