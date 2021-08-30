const express = require('express')
const readFile = require('fs/promises').readFile
const CONFIG = require('./config')
const routeRoutes = require('./routes/routes')
const routeNote = require('./routes/note')


const routesPATH = './json/routes.json'
const notePATH = './json/note.json'
const tokenPATH = './json/token.json'
const uploadPATH = './public/image'
/*-初始化服务*/
const app = express();
app.listen(CONFIG.PORT, () => {
    console.log(`The service runs on url: http://${CONFIG.HOST}:${CONFIG.PORT}`);
});


/*-实现CROS跨域的中间件-*/
app.use((req:any, res:any, next:Function) => {
    const {ALLOW_ORIGIN, CREDENTIALS, HEADERS, ALLOW_METHODS} = CONFIG.CROS;
    res.header("Access-Control-Allow-Origin", ALLOW_ORIGIN);
    res.header("Access-Control-Allow-Credentials", CREDENTIALS);
    res.header("Access-Control-Allow-Headers", HEADERS);
    res.header("Access-Control-Allow-Methods", ALLOW_METHODS);
    req.method === 'OPTIONS' ? res.send('Current services support cross domain requests!') : next();
});

app.use('/public/image',express.static('./public/image'))


/*-token验证中间件-*/
app.use(async (req:any, res:any, next:Function) => {
    console.log(req.url)
    if(req.url === '/routes/login') next();
    else{
        const saveToken = JSON.parse(await readFile(tokenPATH,'utf8'))
        const headerToken = (req.get('token'))
        if(headerToken === saveToken){
            next();
        }else{
            res.send('Not Found!');
        }
    }
});


/*-把所有POST请求，请求主体传递的内容进行解析
 *把URL-ENCODED格式转换为对象，存放到REQ.BODY属性上的-*/
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/*-在所有的请求开始之前，把JSON中的数据获取到
 *挂载到REQ的某些属性上
 *以后想获取，直接的从属性读取即可-*/
app.use(async(req:any, res:any, next:Function) => {
    req.routesPATH = routesPATH
    req.notePATH = notePATH
    req.tokenPATH = tokenPATH
    req.uploadPATH = uploadPATH
    req.routesDATA = JSON.parse(await readFile(routesPATH,'utf8'))
    req.noteDATA = JSON.parse(await readFile(notePATH,'utf8'))
    next();
});

/*-ROUTE-
 *EXPRESS中的路由管控
 *例如：请求的API接口地址是 '/user/xxx' 
 *直接进入到 './routes/user' 这个模块执行代码*/
app.use('/routes',routeRoutes);
app.use('/note',routeNote);
app.use((req:any, res:any, next:Function) => {
    res.status(404);
    res.send('Not Found!');
});

