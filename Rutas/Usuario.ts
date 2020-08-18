import { Router, Response, Request } from "express";
import { Usuario } from '../models/usuario.model';
import bcrypt from 'bcrypt';
import Token from '../clases/token'
import { verificaToken } from '../middlewares/autenticacion';
import  cors  from 'cors'

const userRoutes = Router();

//login
userRoutes.post('/login',( req: Request, resp:Response ) =>{
    
    const body = req.body;

    Usuario.findOne ({ email: body.email }, ( err, userDB ) => {
        if( err ) {
            throw err
        };

        if( !userDB){
            return resp.json({
                ok: false,
                mensaje: 'Usuario/Contraseña son incorrectos'
            });
        }

        if ( userDB.compararPassword( body.password ) ){

            const tokenUser = Token.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            });

            resp.json({
                ok: true,
                token: tokenUser
            });
        }else{
            return resp.json({
                ok: false,
                mensaje: 'Usuario/Contraseña son incorrectos****'
            });
        }

    });


});

//crear usuario
userRoutes.post( '/create', (req: Request, res: Response) =>{

    
    const user = {
        nombre      : req.body.nombre,
        email       : req.body.email,
        password    : bcrypt.hashSync(req.body.password, 10),
        avatar      : req.body.avatar
    };

    Usuario.create( user ).then ( userDB =>{

        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });

        res.json({
            ok: true,
            token: tokenUser
        });

    }).catch( err =>{
        res.json({
            ok: false,
            err
        });
    });  
    
});


//actualizar usuario
userRoutes.post( '/update', verificaToken, (req: any, res: Response) =>{
    
    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar
    }


    Usuario.findByIdAndUpdate( req.usuario._id, user, { new: true }, ( err, userDB ) =>{
        
        if( err ) throw err;

        if( !userDB ) {
            return res.json({
                ok:false,
                mensaje: 'No existe un usuario con ese ID'
            });
        }

        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });

        res.json({
            ok: true,
            token: tokenUser
        });

    });
    
});


userRoutes.get('/',[ verificaToken ], (req: any, res: Response) =>{
    const usuario = req.usuario;

    res.json({
        ok: true,
        mensaje:'Token valido',
        usuario
    });
});


export default userRoutes;