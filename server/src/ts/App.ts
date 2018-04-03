import * as express from 'express';
import indexRouter from './routes/index';

class App {
	public app;

	public constructor() {
		this.app = express();
		this.init();
	}

	private init(): void {
		var createError = require('http-errors');
		var express = require('express');
		var path = require('path');
		var fse = require('fs-extra');
		var cookieParser = require('cookie-parser');
		var logger = require('morgan');

		// view engine setup
		this.app.set('views', './server/views');
		this.app.set('view engine', 'pug');

		this.app.use(logger('dev'));
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: false }));
		this.app.use(cookieParser());
		this.app.use(express.static('./client/public'));

		// Copy files to public
		fse.copySync('./node_modules/jquery/dist/jquery.js', './client/public/js/jquery.js');
		fse.copySync('./node_modules/angular/angular.js', './client/public/js/angular.js');
		fse.copySync('./client/src/css/styles.css', './client/public/css/styles.css');
		fse.copySync('./client/dist/ts/app.js', './client/public/js/app.js');
		fse.copySync('./client/dist/ts/app.js.map', './client/public/js/app.js.map');

		this.app.use('/', indexRouter);

		// catch 404 and forward to error handler
		this.app.use(function (req, res, next) {
			next(createError(404));
		});

		// error handler
		this.app.use(function (err, req, res, next) {
			// set locals, only providing error in development
			res.locals.message = err.message;
			res.locals.error = req.app.get('env') === 'development' ? err : {};

			// render the error page
			res.status(err.status || 500);
			res.render('error');
		});
	}
}

export default (new App()).app;

// EOF