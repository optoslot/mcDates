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

	// Injections

	private $mdDialog: any;

	public constructor($mdDialog) {
		// Injections

		this.$mdDialog = $mdDialog;

		// Init

		this.date1 = null;
		this.date2 = null;
	}

	public changeDates(): void {
		setTimeout(() => {
			this.showAlert(
				null,
				'Диалог с информацией что был изменен диапазон даты',
				'Диапазон даты был изменен',
				`${this.date1 || '[Не выбрано]'} ${this.date2 || '[Не выбрано]'}`
			);
		}, 0);
	}

	private showAlert(ev, ariaLabel, title, textContent) {
		// Appending dialog to document.body to cover sidenav in docs app
		// Modal dialogs should fully cover application
		// to prevent interaction outside of dialog
		this.$mdDialog.show(
			this.$mdDialog.alert()
				.parent(angular.element(document.querySelector('body')))
				.clickOutsideToClose(true)
				.title(title)
				.textContent(textContent)
				.ariaLabel(ariaLabel)
				.ok('ОК')
				.targetEvent(ev)
		);
	};
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

	public dateFromDate: Date;
	public dateToDate: Date;

	private _dateFrom: string;
	private _dateTo: string;

	public get dateFrom(): string {
		return this._dateFrom;
	}

	public set dateFrom(dateFrom: string) {
		this._dateFrom = dateFrom;
		this.dateFromDate = this.mcDateUtils.strToDate(dateFrom);
	}

	public get dateTo(): string {
		return this._dateTo;
	}

	public set dateTo(dateTo: string) {
		this._dateTo = dateTo;
		this.dateToDate = this.mcDateUtils.strToDate(dateTo);
	}

	//----------------------------------------------------------------------------------------------
	// Contructor
	//----------------------------------------------------------------------------------------------

	private $timeout: any;
	private mcDateUtils: any;

	public constructor($timeout, mcDateUtils) {
		this.$timeout = $timeout;
		this.mcDateUtils = mcDateUtils;
	}

	//----------------------------------------------------------------------------------------------
	// Methods
	//----------------------------------------------------------------------------------------------

	public onDatesChange() {
		this['mcChange']();
	}

	private setDateFromToDefer(dateFrom: string, dateTo: string): void {
		this.dateFromDate = null;
		this.dateToDate = null;

		this.$timeout(() => {
			this.dateFrom = dateFrom;
			this.dateTo = dateTo;
			this.onDatesChange();
		}, 0);
	}

	public setYesterday() {
		this.setDateFromToDefer(
			this.mcDateUtils.dateToStr(moment().add(-1, 'days')),
			this.mcDateUtils.dateToStr(moment().add(-1, 'days'))
		);
	}

	public setToday() {
		this.setDateFromToDefer(
			this.mcDateUtils.dateToStr(moment()),
			this.mcDateUtils.dateToStr(moment())
		);
	}

	public setTwoWeeks() {
		this.setDateFromToDefer(
			this.mcDateUtils.dateToStr(moment().add(-14, 'days')),
			this.mcDateUtils.dateToStr(moment())
		);
	}

	public setMonth() {
		this.setDateFromToDefer(
			this.mcDateUtils.dateToStr(moment().add(-30, 'days')),
			this.mcDateUtils.dateToStr(moment())
		);
	}

	public setAll() {
		this.setDateFromToDefer(
			null,
			null
		);
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