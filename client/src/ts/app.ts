//==================================================================================================
// Declares
//==================================================================================================

declare const moment: any;

//==================================================================================================
// app
//==================================================================================================

const app = angular.module('mcDatesApp', ['ngMaterial', 'ngMessages']);

//==================================================================================================
// mcDateUtils
//==================================================================================================

app.provider('mcDateUtils', <angular.IServiceProviderFactory>function () {
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
	$mdDateLocaleProvider.formatDate = (date) => {
		return mcDateUtilsProvider.dateToStr(date);
	};

	$mdDateLocaleProvider.parseDate = (dateString) => {
		return mcDateUtilsProvider.strToDate(dateString);
	};
});

//==================================================================================================
// mcDateConvert
//==================================================================================================

app.directive('mcDateConvert', function (mcDateUtils): angular.IDirective {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function (scope: any, element: any, attrs: any, ngModel: any) {

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

class mcDatesRootCtrl {
	public date1: string;
	public date2: string;

	public constructor() {
		this.date1 = null;
		this.date2 = null;
	}

	public changeDates(): void {
		setTimeout(() => {
			alert(`${this.date1} - ${this.date2}`);
		}, 0);
	}
}

class mcDatesRootComponent implements angular.IComponentOptions {
	public templateUrl: string;
	public controller: any;
	public bindings: any;

	constructor() {
		this.templateUrl = '/templates/mcDatesRoot.html';
		this.controller = mcDatesRootCtrl;
		this.bindings = {};
	}
}

app.component('mcDatesRoot', new mcDatesRootComponent());

//==================================================================================================
// mcDatesComponent
//==================================================================================================

class mcDatesCtrl {

	//----------------------------------------------------------------------------------------------
	// Fields and properties
	//----------------------------------------------------------------------------------------------

	private _mcDateUtils: any;

	public dateFromDate: Date;
	public dateToDate: Date;

	private _dateFrom: string;
	private _dateTo: string;

	public get dateFrom(): string {
		return this._dateFrom;
	}

	public set dateFrom(dateFrom: string) {
		this._dateFrom = dateFrom;
		this.dateFromDate = this._mcDateUtils.strToDate(dateFrom);
	}

	public get dateTo(): string {
		return this._dateTo;
	}

	public set dateTo(dateTo: string) {
		this._dateTo = dateTo;
		this.dateToDate = this._mcDateUtils.strToDate(dateTo);
	}

	//----------------------------------------------------------------------------------------------
	// Contructor
	//----------------------------------------------------------------------------------------------

	public constructor(mcDateUtils) {
		this._mcDateUtils = mcDateUtils;
	}

	//----------------------------------------------------------------------------------------------
	// Methods
	//----------------------------------------------------------------------------------------------

	public onDatesChange() {
		this['mcChange']();
	}

	public setYesterday() {
		this.dateFrom = this._mcDateUtils.dateToStr(moment().add(-1, 'days'));
		this.dateTo = this._mcDateUtils.dateToStr(moment().add(-1, 'days'));
		this.onDatesChange();
	}

	public setToday() {
		this.dateFrom = this._mcDateUtils.dateToStr(moment());
		this.dateTo = this._mcDateUtils.dateToStr(moment());
		this.onDatesChange();
	}

	public setTwoWeeks() {
		this.dateFrom = this._mcDateUtils.dateToStr(moment().add(-14, 'days'));
		this.dateTo = this._mcDateUtils.dateToStr(moment());
		this.onDatesChange();
	}

	public setMonth() {
		this.dateFrom = this._mcDateUtils.dateToStr(moment().add(-30, 'days'));
		this.dateTo = this._mcDateUtils.dateToStr(moment());
		this.onDatesChange();
	}

	public setAll() {
		this.dateFrom = null;
		this.dateTo = null;
		this.onDatesChange();
	}
}

class mcDatesComponent implements angular.IComponentOptions {
	public templateUrl: string;
	public controller: any;
	public bindings: any;

	constructor() {
		this.templateUrl = '/templates/mcDates.html';
		this.controller = mcDatesCtrl;
		this.bindings = {
			dateFrom: '=',
			dateTo: '=',
			mcChange: '&'
		};
	}
}

app.component('mcDates', new mcDatesComponent());

// EOF