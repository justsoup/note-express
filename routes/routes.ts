const express = require('express'),
    route = express.Router();
const writeFile = require('fs/promises').writeFile
const jwt = require('jsonwebtoken')



route.get('/getRoutes', (req:any, res:any) => {
    let data = req.routesDATA
    res.send({
        success: true,
        msg: 'OK!',
        data
    });
});

route.post('/addRoutes', (req:any, res:any) => {
    const {parent,key,title} = req.body
    if(parent){
        const targetObj = req.routesDATA.find((item:any)=>item.key===parent)
        if(targetObj){
            targetObj.children.push({
                key,
                title
            })
            writeFile(req.routesPATH, JSON.stringify(req.routesDATA)).then(()=>{
                res.send({
                    success: true,
                    msg: '保存成功',
                });
            }).catch((err)=>{
                res.send({
                    success: false,
                    msg: '保存失败',
                });
            })
        }else{
            res.send({
                success: false,
                msg: '父路由不存在',
            });
        }
    }else{
        req.routesDATA.push({
            title,
            key,
            children:[]
        })
        writeFile(req.routesPATH, JSON.stringify(req.routesDATA)).then(()=>{
            res.send({
                success: true,
                msg: '保存成功',
            });
        }).catch((err)=>{
            res.send({
                success: false,
                msg: '保存失败',
            });
        })
    }
});




route.post('/login', (req:any, res:any) => {
    const {account,password} = req.body
    console.log(account,password)
    if(account === 'who' && password === 'cec7f2c2a3b40235bf9320df9ea0a073'){
        const token = jwt.sign({
            account,password}, 'express', { expiresIn: 60 * 60 })
        writeFile(req.tokenPATH,JSON.stringify(token)).then(()=>{
            console.log('token已存入')
            res.send({
                success: true,
                msg: '登录成功',
                data:token
            });
        }).catch((err)=>{
            console.log(err)
            res.send({
                success: false,
                msg: 'token异常',
            });
        })
    }else{
        res.send({
            success: false,
            msg: '账号或密码错误',
        });
    }
});

module.exports = route
