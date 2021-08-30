"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var express_1 = require("express");
var promises_1 = require("fs/promises");
var nanoid_1 = require("nanoid");
var multer_1 = require("multer");
var route = express_1.Router();
// 设置文件保存规则
var storage = multer_1.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/image/');
    },
    filename: function (req, file, cb) {
        var fileType = file.originalname.slice(file.originalname.lastIndexOf('.'));
        cb(null, nanoid_1.nanoid() + fileType);
    }
});
// 设置过滤规则
var imageFilter = function (req, file, cb) {
    var acceptableMime = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (acceptableMime.indexOf(file.mimetype) !== -1) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
var upload = multer_1({ storage: storage, fileFilter: imageFilter });
route.post('/upload', upload.single('file'), function (req, res) {
    var file = req.file;
    if (file) {
        res.send({
            success: true,
            msg: '上传成功',
            data: file
        });
    }
    else {
        res.send({
            success: false,
            msg: '只能上传图片类型'
        });
    }
});
route.post('/unlink', function (req, res) {
    var filename = req.body.filename;
    var flag = true;
    if (filename) {
        promises_1.readdir(req.uploadPATH).then(function (files) {
            for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                var file = files_1[_i];
                if (file === filename) {
                    promises_1.unlink(req.uploadPATH + '/' + file);
                    flag = !flag;
                    res.send({
                        success: true,
                        msg: '删除成功'
                    });
                    return;
                }
            }
            if (flag) {
                res.send({
                    success: false,
                    msg: '删除失败'
                });
            }
        });
    }
    else {
        res.send({
            success: false,
            msg: '缺少参数filename'
        });
    }
});
route.get('/getNote', function (req, res) {
    var route = req.query.route;
    if (route) {
        var routeArr = req.noteDATA[0][route];
        if (!routeArr) {
            res.send({
                success: false,
                msg: 'route错误'
            });
        }
        else {
            res.send({
                success: true,
                msg: '获取成功',
                data: routeArr
            });
        }
    }
    else {
        res.send({
            success: false,
            msg: 'route错误'
        });
    }
});
route.post('/addNote', function (req, res) {
    // 存在route,找到route对应的数组
    // 数组push新的项
    // 写入文件
    var _a = req.body, route = _a.route, index = _a.index, title = _a.title, content = _a.content, important = _a.important;
    console.log(req.body);
    if (route) {
        var routeArr = req.noteDATA[0][route];
        if (!routeArr) {
            res.send({
                success: false,
                msg: 'route错误'
            });
            return;
        }
        if (index >= 0 && index < routeArr.length) {
            routeArr.splice(index, 0, {
                id: nanoid_1.nanoid(),
                title: title,
                content: content,
                important: important
            });
        }
        else {
            routeArr.push({
                id: nanoid_1.nanoid(),
                title: title,
                content: content,
                important: important
            });
        }
        promises_1.writeFile(req.notePATH, JSON.stringify(req.noteDATA)).then(function () {
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
            msg: '缺少route'
        });
    }
});
route.post('/addRoute', function (req, res) {
    var route = req.body.route;
    if (!(route in req.noteDATA[0])) {
        req.noteDATA[0][route] = [];
        promises_1.writeFile(req.notePATH, JSON.stringify(req.noteDATA)).then(function () {
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
            msg: 'route已存在'
        });
    }
});
route.post('/updateNote', function (req, res) {
    var _a = req.body, id = _a.id, route = _a.route, title = _a.title, content = _a.content, important = _a.important;
    var noSearch = true;
    if (id && route) {
        var routeArr_1 = req.noteDATA[0][route];
        if (!routeArr_1) {
            res.send({
                success: false,
                msg: 'route错误'
            });
            return;
        }
        routeArr_1.forEach(function (item, index) {
            if (item.id === id) {
                routeArr_1[index] = __assign(__assign({}, item), { title: title, content: content, important: important });
                noSearch = false;
                promises_1.writeFile(req.notePATH, JSON.stringify(req.noteDATA)).then(function () {
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
                return;
            }
        });
        if (noSearch) {
            res.send({
                success: false,
                msg: '找不到对应的id'
            });
        }
    }
    else {
        res.send({
            success: false,
            msg: '缺少id或route'
        });
    }
});
route.post('/delNote', function (req, res) {
    var _a = req.body, id = _a.id, route = _a.route;
    if (id && route) {
        var routeArr = req.noteDATA[0][route];
        if (!routeArr) {
            res.send({
                success: false,
                msg: 'route错误'
            });
            return;
        }
        req.noteDATA[0][route] = routeArr.filter(function (item) { return item.id !== id; });
        promises_1.writeFile(req.notePATH, JSON.stringify(req.noteDATA)).then(function () {
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
            msg: '缺少id或route'
        });
    }
});
module.exports = route;
