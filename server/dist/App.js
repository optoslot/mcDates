"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var index_1 = require("./routes/index");
var App = /** @class */ (function () {
    function App() {
        this.app = express();
        this.init();
    }
    App.prototype.init = function () {
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
        fse.copySync('./node_modules/angular/angular.js', './client/public/js/angular.js');
        this.app.use('/', index_1.default);
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
    };
    return App;
}());
exports.default = (new App()).app;
// EOF
//# sourceMappingURL=App.js.map