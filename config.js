"use strict";
exports.__esModule = true;
module.exports= {
    //=>WEB服务端口号
    HOST: '194.87.70.176',
    PORT: 9988,
    //=>CROS跨域相关信息
    CROS: {
        ALLOW_ORIGIN: '*',
        ALLOW_METHODS: 'GET,POST,PUT,DELETE,OPTIONS',
        HEADERS: 'Content-Type,Content-Length,token, Accept,X-Requested-With',
        CREDENTIALS: true
    }
};