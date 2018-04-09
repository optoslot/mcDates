//==================================================================================================
// Declares
//==================================================================================================
//==================================================================================================
// app
//==================================================================================================
var app = angular.module('mcDatesApp', ['ngMaterial', 'ngMessages']);
//==================================================================================================
// mcDateUtils
//==================================================================================================
app.provider('mcDateUtils', function () {
    this.$get = function () {
        return this;
    };
    this.dateToStr = function (date) {
        return date
            ? moment(date).format('YYYY-MM-DD')
            : null;
    };
    this.strToDate = function (str) {
        if (!str) {
            return null;
        }
        var m = moment(str, 'YYYY-MM-DD', true);
        return m.isValid() ? m.toDate() : null;
    };
});
//==================================================================================================
// Datepicker format
//==================================================================================================
app.config(function ($mdDateLocaleProvider, mcDateUtilsProvider) {
    $mdDateLocaleProvider.formatDate = function (date) {
        return mcDateUtilsProvider.dateToStr(date);
    };
    $mdDateLocaleProvider.parseDate = function (dateString) {
        return mcDateUtilsProvider.strToDate(dateString);
    };
});
//==================================================================================================
// mcDateConvert
//==================================================================================================
app.directive('mcDateConvert', function (mcDateUtils) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            // Don't do anything unless we have a model
            if (ngModel) {
                ngModel.$parsers.push(function (value) {
                    return mcDateUtils.dateToStr(value);
                });
                ngModel.$formatters.push(function (value) {
                    return mcDateUtils.strToDate(value);
                });
            }
        }
    };
});
//==================================================================================================
// mcDatesRootComponent
//==================================================================================================
var mcDatesRootCtrl = /** @class */ (function () {
    function mcDatesRootCtrl($mdDialog) {
        // Injections
        this.$mdDialog = $mdDialog;
        // Init
        this.date1 = null;
        this.date2 = null;
    }
    mcDatesRootCtrl.prototype.changeDates = function () {
        var _this = this;
        setTimeout(function () {
            _this.showAlert(null, 'Диалог с информацией что был изменен диапазон даты', 'Диапазон даты был изменен', (_this.date1 || '[Не выбрано]') + " " + (_this.date2 || '[Не выбрано]'));
        }, 0);
    };
    mcDatesRootCtrl.prototype.showAlert = function (ev, ariaLabel, title, textContent) {
        // Appending dialog to document.body to cover sidenav in docs app
        // Modal dialogs should fully cover application
        // to prevent interaction outside of dialog
        this.$mdDialog.show(this.$mdDialog.alert()
            .parent(angular.element(document.querySelector('body')))
            .clickOutsideToClose(true)
            .title(title)
            .textContent(textContent)
            .ariaLabel(ariaLabel)
            .ok('ОК')
            .targetEvent(ev));
    };
    ;
    return mcDatesRootCtrl;
}());
var mcDatesRootComponent = /** @class */ (function () {
    function mcDatesRootComponent() {
        this.templateUrl = '/templates/mcDatesRoot.html';
        this.controller = mcDatesRootCtrl;
        this.bindings = {};
    }
    return mcDatesRootComponent;
}());
app.component('mcDatesRoot', new mcDatesRootComponent());
//==================================================================================================
// mcDatesComponent
//==================================================================================================
var mcDatesCtrl = /** @class */ (function () {
    function mcDatesCtrl($timeout, mcDateUtils) {
        this.$timeout = $timeout;
        this.mcDateUtils = mcDateUtils;
    }
    Object.defineProperty(mcDatesCtrl.prototype, "dateFrom", {
        get: function () {
            return this._dateFrom;
        },
        set: function (dateFrom) {
            this._dateFrom = dateFrom;
            this.dateFromDate = this.mcDateUtils.strToDate(dateFrom);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(mcDatesCtrl.prototype, "dateTo", {
        get: function () {
            return this._dateTo;
        },
        set: function (dateTo) {
            this._dateTo = dateTo;
            this.dateToDate = this.mcDateUtils.strToDate(dateTo);
        },
        enumerable: true,
        configurable: true
    });
    //----------------------------------------------------------------------------------------------
    // Methods
    //----------------------------------------------------------------------------------------------
    mcDatesCtrl.prototype.onDatesChange = function () {
        this['mcChange']();
    };
    mcDatesCtrl.prototype.setDateFromToDefer = function (dateFrom, dateTo) {
        var _this = this;
        this.dateFromDate = null;
        this.dateToDate = null;
        this.$timeout(function () {
            var isChanged = _this.dateFrom !== dateFrom
                || _this.dateTo !== dateTo;
            _this.dateFrom = dateFrom;
            _this.dateTo = dateTo;
            if (isChanged) {
                _this.onDatesChange();
            }
        }, 0);
    };
    mcDatesCtrl.prototype.setYesterday = function () {
        this.setDateFromToDefer(this.mcDateUtils.dateToStr(moment().add(-1, 'days')), this.mcDateUtils.dateToStr(moment().add(-1, 'days')));
    };
    mcDatesCtrl.prototype.setToday = function () {
        this.setDateFromToDefer(this.mcDateUtils.dateToStr(moment()), this.mcDateUtils.dateToStr(moment()));
    };
    mcDatesCtrl.prototype.setTwoWeeks = function () {
        this.setDateFromToDefer(this.mcDateUtils.dateToStr(moment().add(-14, 'days')), this.mcDateUtils.dateToStr(moment()));
    };
    mcDatesCtrl.prototype.setMonth = function () {
        this.setDateFromToDefer(this.mcDateUtils.dateToStr(moment().add(-30, 'days')), this.mcDateUtils.dateToStr(moment()));
    };
    mcDatesCtrl.prototype.setAll = function () {
        this.setDateFromToDefer(null, null);
    };
    return mcDatesCtrl;
}());
var mcDatesComponent = /** @class */ (function () {
    function mcDatesComponent() {
        this.templateUrl = '/templates/mcDates.html';
        this.controller = mcDatesCtrl;
        this.bindings = {
            dateFrom: '=',
            dateTo: '=',
            mcChange: '&'
        };
    }
    return mcDatesComponent;
}());
app.component('mcDates', new mcDatesComponent());
// EOF
//# sourceMappingURL=app.js.map