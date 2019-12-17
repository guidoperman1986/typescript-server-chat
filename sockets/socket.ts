import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';

export const usuariosConectados = new UsuariosLista()

export const conectarCliente = (cliente:Socket, io:SocketIO.Server)=>{
    const usuario = new Usuario(cliente.id);
    usuariosConectados.agregarUsuario(usuario);

    
}


export const desconectar = (cliente:Socket,io:SocketIO.Server)=>{
    cliente.on('disconnect',()=>{
        console.log("Cliente desconectado");
        usuariosConectados.borrarUsuario(cliente.id)
        
        io.emit('usuarios-activos',usuariosConectados.getLista());
    })
}

//escuchar mensajes
export const mensaje = (cliente:Socket, io:socketIO.Server)=>{
    cliente.on('mensaje', (payload:{de:string, cuerpo:string})=>{
        console.log("Mensaje recibido", payload.cuerpo);

        io.emit('mensaje-nuevo', payload)
    })
}

//login usuario
export const login = (cliente:Socket, io:socketIO.Server)=>{    
    cliente.on('configurar-usuario',(payload:{nombre:string}, callback:Function)=>{
        console.log('Nuevo usuario',payload.nombre);        

        usuariosConectados.actualizarNombre(cliente.id,payload.nombre);        

        io.emit('usuarios-activos',usuariosConectados.getLista());

        callback({
            ok:true,            
            usuarioActualizado: usuariosConectados.getLista()
        })
    })
}

export const obtenerUsuarios = (cliente:Socket, io:socketIO.Server)=>{
    cliente.on('obtener-usuarios',()=>{        

        io.to(cliente.id).emit('usuarios-activos',usuariosConectados.getLista());
        
    })
}

export const escribiendo = (cliente:Socket, io:socketIO.Server)=>{
    cliente.on('escribiendo',(/* callback:Function */)=>{
        console.log('escribiendo');

        //let partner:Usuario;
        //partner = usuariosConectados.getPartner(cliente.id);        

        io.to(cliente.id).emit('escuchando-escritura');

/*         callback({
            ok:true,            
            escribiendo: usuariosConectados.getPartner(cliente.id)
        }) */
    })
}
