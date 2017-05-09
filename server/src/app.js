import express from 'express';
import path from 'path';
import action from './action/action';
import router from './router/router';

let app=express();
router(app,express,action); //路由
app.use(express.static(path.join(__dirname, '../../web'))); //将web的页面设为静态资源可直接访问
app.use(express.static(path.join(__dirname, './public')));

const server=app.listen(4000,function(){
    let host=server.address().address;
    let port=server.address().port;
    console.log('NodeServer has started at ' + host + port);
})