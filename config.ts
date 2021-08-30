const CONFIG = {
    //=>WEB服务端口号
    HOST: '194.87.70.176',
    PORT: 9988,

    //=>CROS跨域相关信息
    CROS: {
        ALLOW_ORIGIN: '*',//=>客户端的WEB地址和端口
        ALLOW_METHODS: 'GET,POST,PUT,DELETE,OPTIONS',
        HEADERS: 'Content-Type,Content-Length,token, Accept,X-Requested-With',
        CREDENTIALS: true
    },

};

export default CONFIG