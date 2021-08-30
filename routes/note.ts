import express from 'express'
import { writeFile,unlink,readdir } from 'fs/promises'
import { nanoid } from "nanoid";
import multer from 'multer'
const route = express.Router()

// 设置文件保存规则
const storage = multer.diskStorage({
    destination:(req:any, file:any,cb:Function) => {
        cb(null,'public/image/')
    },
    filename:(req:any, file:any,cb:Function) => {
        let fileType  = file.originalname.slice(file.originalname.lastIndexOf('.'));
        cb(null, nanoid() + fileType);
    }
})
// 设置过滤规则
const imageFilter = (req:any, file:any,cb:Function) => {
    const acceptableMime = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
    if(acceptableMime.indexOf(file.mimetype) !== -1){
        cb(null, true)
    }else{
        cb(null, false)
    }
}

const upload = multer({storage:storage,fileFilter:imageFilter})
route.post('/upload',upload.single('file'),(req:any, res:any) => {
    const file = req.file
    if(file){
        res.send({
            success: true,
            msg: '上传成功',
            data:file
        });
    }else{
        res.send({
            success: false,
            msg: '只能上传图片类型',
        });
    }
})

route.post('/unlink',(req:any, res:any) => {
    const {filename} = req.body
    let flag = true
    if(filename){
        readdir(req.uploadPATH).then((files)=>{
            for(const file of files){
                if(file === filename){
                    unlink( req.uploadPATH + '/' + file )
                    flag = !flag
                    res.send({
                        success: true,
                        msg: '删除成功',
                    });
                    return
                }
            }
            if(flag){
                res.send({
                    success: false,
                    msg: '删除失败',
                });
            }
        })
    }else{
        res.send({
            success: false,
            msg: '缺少参数filename',
        });
    }
})


route.get('/getNote', (req:any, res:any) => {
    const {route} = req.query
    if(route){
        const routeArr:Array<object> = req.noteDATA[0][route]
        if(!routeArr){
            res.send({
                success: false,
                msg: 'route错误',
            });
        }else{
            res.send({
                success: true,
                msg: '获取成功',
                data:routeArr
            });
        }
    }else{
        res.send({
            success: false,
            msg: 'route错误'
        });
    }
});

route.post('/addNote', (req:any, res:any) => {
    // 存在route,找到route对应的数组
    // 数组push新的项
    // 写入文件
    const {route,index,title,content,important} = req.body
    console.log(req.body)
    if(route){
        const routeArr:Array<object> = req.noteDATA[0][route]
        if(!routeArr){
            res.send({
                success: false,
                msg: 'route错误',
            });
            return
        }
        if(index>=0 && index < routeArr.length){
            routeArr.splice(index,0,{
                id:nanoid(),
                title:title,
                content:content,
                important:important
            })
        }else{
            routeArr.push({
                id:nanoid(),
                title:title,
                content:content,
                important:important
            })
        }
        writeFile(req.notePATH, JSON.stringify(req.noteDATA)).then(()=>{
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
            msg: '缺少route',
        });
    }
});

route.post('/addRoute', (req:any, res:any) => {
    const {route} = req.body
    if(!(route in req.noteDATA[0])){
        req.noteDATA[0][route] = []
        writeFile(req.notePATH, JSON.stringify(req.noteDATA)).then(()=>{
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
            msg: 'route已存在',
        });
    }
});


route.post('/updateNote',(req:any, res:any) => {
    const {id,route,title,content,important} = req.body
    let noSearch:Boolean = true
    if(id && route){
        const routeArr:Array<object> = req.noteDATA[0][route]
        if(!routeArr){
            res.send({
                success: false,
                msg: 'route错误',
            });
            return
        }
        routeArr.forEach((item:any,index:number)=>{
            if(item.id === id){
                routeArr[index] = {...item,title,content,important}
                noSearch = false
                writeFile(req.notePATH, JSON.stringify(req.noteDATA)).then(()=>{
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
                return
            }
        })
        if(noSearch){
            res.send({
                success: false,
                msg: '找不到对应的id',
            });
        }
        
    }else{
        res.send({
            success: false,
            msg: '缺少id或route',
        });
    }
})


route.post('/delNote',(req:any, res:any) => {
    const {id,route} = req.body
    if(id && route){
        let routeArr:Array<object> = req.noteDATA[0][route]
        if(!routeArr){
            res.send({
                success: false,
                msg: 'route错误',
            });
            return
        }
        req.noteDATA[0][route] = routeArr.filter((item:any)=>item.id!==id)
        writeFile(req.notePATH, JSON.stringify(req.noteDATA)).then(()=>{
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
            msg: '缺少id或route',
        });
    }
})


export default route