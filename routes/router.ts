import { Router, Request, Response } from 'express';
import Server from '../classes/server';
import { usuariosConectados } from '../sockets/socket';

export const router = Router();

router.get('/mensajes',(req:Request,res:Response)=>{

    res.json({
        ok:true,
        mensaje:'todo ok'
    })
})

router.post('/mensajes',(req:Request,res:Response)=>{
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;

    const payload = {
        de,cuerpo
    }

    const server = Server.instance;
    server.io.emit('mensaje-nuevo',payload)

    res.json({
        ok:true,
        cuerpo,
        de      
    })
})

router.post('/mensajes/:id',(req:Request,res:Response)=>{
    const cuerpo = req.body.cuerpo
    const de = req.body.de
    const id = req.params.id

    const payload = {
        de,cuerpo
    }

    //Conectar el server con los sockets
    const server = Server.instance; //Este server tiene el sockets.io
    server.io.in(id).emit('mensaje-privado',payload);//in sirve para mandar las cosas a alguien en particular

    res.json({
        ok:true,
        cuerpo,
        de,
        id
    })
})

//Servicio para obtener todos los ids de los usuarios conectados
router.get('/usuarios', (req:Request,res:Response)=>{

    const server = Server.instance;
    server.io.clients((err:any,clientes:string[])=>{
        if (err){
            return res.json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            clientes
        })
    })


})

router.get('/usuarios/detalle',(req:Request,res:Response)=>{

    res.json({
        ok:true,
        clientes:usuariosConectados.getLista()
    })


})


