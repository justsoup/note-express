"use strict";
exports.__esModule = true;
var express = require("express");
var promises = require("fs/promises");
// import jwt from 'jsonwebtoken'
var jwt = require('jsonwebtoken');
var route = express.Router();
route.get('/getRoutes', function (req, res) {
    var data = req.routesDATA;
    res.send({
        success: true,
        msg: 'OK!',
        data: data
    });
});
route.post('/addRoutes', function (req, res) {
    var _a = req.body, parent = _a.parent, key = _a.key, title = _a.title;
    if (parent) {
        var targetObj = req.routesDATA.find(function (item) { return item.key === parent; });
        if (targetObj) {
            targetObj.children.push({
                key: key,
                title: title
            });
            promises.writeFile(req.routesPATH, JSON.stringify(req.routesDATA)).then(function () {
                res.send({
                    success: true,
                    msg: '保存成功'
                });
            })["catch"](function (err) {
                res.send({
                    success: false,
                    msg: '保存失败'
                });
            });
        }
        else {
            res.send({
                success: false,
                msg: '父路由不存在'
            });
        }
    }
    else {
        req.routesDATA.push({
            title: title,
            key: key,
            children: []
        });
        promises.writeFile(req.routesPATH, JSON.stringify(req.routesDATA)).then(function () {
            res.send({
                success: true,
                msg: '保存成功'
            });
        })["catch"](function (err) {
            res.send({
                success: false,
                msg: '保存失败'
            });
        });
    }
});
route.post('/login', function (req, res) {
    var _a = req.body, account = _a.account, password = _a.password;
    console.log(account, password);
    if (account === 'who' && password === 'cec7f2c2a3b40235bf9320df9ea0a073') {
        var token = jwt.sign({
            account: account,
            password: password
        }, 'express', { expiresIn: 60 * 60 });
        promises.writeFile(req.tokenPATH, JSON.stringify(token)).then(function () {
            console.log('token已存入');
            res.send({
                success: true,
                msg: '登录成功',
                data: token
            });
        })["catch"](function (err) {
            console.log(err);
            res.send({
                success: false,
                msg: 'token异常'
            });
        });
    }
    else {
        res.send({
            success: false,
            msg: '账号或密码错误'
        });
    }
});
module.exports = route;
