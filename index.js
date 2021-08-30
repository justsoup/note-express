var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var express = require('express');
var readFile = require('fs/promises').readFile;
var CONFIG = require('./config.js');
var routeRoutes = require('./routes/routes.js');
var routeNote = require('./routes/note.js');
var routesPATH = './json/routes.json';
var notePATH = './json/note.json';
var tokenPATH = './json/token.json';
var uploadPATH = './public/image';
/*-初始化服务*/
var app = express();
app.listen(CONFIG.PORT, function () {
    console.log("The service runs on url: http://" + CONFIG.HOST + ":" + CONFIG.PORT);
});
/*-实现CROS跨域的中间件-*/
app.use(function (req, res, next) {
    var _a = CONFIG.CROS, ALLOW_ORIGIN = _a.ALLOW_ORIGIN, CREDENTIALS = _a.CREDENTIALS, HEADERS = _a.HEADERS, ALLOW_METHODS = _a.ALLOW_METHODS;
    res.header("Access-Control-Allow-Origin", ALLOW_ORIGIN);
    res.header("Access-Control-Allow-Credentials", CREDENTIALS);
    res.header("Access-Control-Allow-Headers", HEADERS);
    res.header("Access-Control-Allow-Methods", ALLOW_METHODS);
    req.method === 'OPTIONS' ? res.send('Current services support cross domain requests!') : next();
});
app.use('/public/image', express.static('./public/image'));
/*-token验证中间件-*/
app.use(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var saveToken, _a, _b, headerToken;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                console.log(req.url);
                if (!(req.url === '/routes/login')) return [3 /*break*/, 1];
                next();
                return [3 /*break*/, 3];
            case 1:
                _b = (_a = JSON).parse;
                return [4 /*yield*/, readFile(tokenPATH, 'utf8')];
            case 2:
                saveToken = _b.apply(_a, [_c.sent()]);
                headerToken = (req.get('token'));
                if (headerToken === saveToken) {
                    next();
                }
                else {
                    res.send('Not Found!');
                }
                _c.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
/*-把所有POST请求，请求主体传递的内容进行解析
 *把URL-ENCODED格式转换为对象，存放到REQ.BODY属性上的-*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/*-在所有的请求开始之前，把JSON中的数据获取到
 *挂载到REQ的某些属性上
 *以后想获取，直接的从属性读取即可-*/
app.use(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                req.routesPATH = routesPATH;
                req.notePATH = notePATH;
                req.tokenPATH = tokenPATH;
                req.uploadPATH = uploadPATH;
                _a = req;
                _c = (_b = JSON).parse;
                return [4 /*yield*/, readFile(routesPATH, 'utf8')];
            case 1:
                _a.routesDATA = _c.apply(_b, [_g.sent()]);
                _d = req;
                _f = (_e = JSON).parse;
                return [4 /*yield*/, readFile(notePATH, 'utf8')];
            case 2:
                _d.noteDATA = _f.apply(_e, [_g.sent()]);
                next();
                return [2 /*return*/];
        }
    });
}); });
/*-ROUTE-
 *EXPRESS中的路由管控
 *例如：请求的API接口地址是 '/user/xxx'
 *直接进入到 './routes/user' 这个模块执行代码*/
app.use('/routes', routeRoutes);
app.use('/note', routeNote);
app.use(function (req, res, next) {
    res.status(404);
    res.send('Not Found!');
});
