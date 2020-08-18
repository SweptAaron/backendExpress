import { Router, Response, Request } from 'express'
import { verificaToken } from '../middlewares/autenticacion';
import { Post } from '../models/post.model';
import { FileUpload } from '../interfaces/file-upload';

import FileSystem from '../clases/file-system';


 

const postRoutes =  Router();
const filesytem = new FileSystem();

//Obtener POST paginados
postRoutes.get('/', async (req: any, res: Response) =>{

    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;     

    const post = await Post.find()
                            .sort({ _id: -1 })
                            .skip( skip )
                            .limit(10)
                            .populate('usuario', '-password')
                            .exec();

    res.json({
        ok:true,
        post
    })

});


//crear POST
postRoutes.post('/', [verificaToken], (req: any, res: Response) =>{
    
    const body = req.body;
    body.usuario = req.usuario._id;

    const imagenes = filesytem.imagenesdeTempHaciaPost( req.usuario._id );
    body.imgs = imagenes;


    Post.create( body ).then( async postDB =>{

        await postDB.populate('usuario', '-password').execPopulate();

        res.json({
            ok: true,
            body: postDB
        });
    }).catch( err =>{
        res.json( err )
    }); 
    

});


//Servicio para subir archivos
postRoutes.post( '/upload', [verificaToken], async(req: any, res: Response) =>{

    if(!req.files){
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo'
        });
    }

    const file: FileUpload = req.files.image;

    if( !file ){
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo - imagen'
        });
    }

    if(!file.mimetype.includes('image')){
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ninguna imagen'
        });
    }

     await filesytem.guardarImagenTemporal( file, req.usuario._id );

    res.json({
        ok: false,
        file: file.mimetype
    });

});

postRoutes.get('/imagen/:userid/:img', (req: any, res: Response) =>{

    const userId = req.params.userid;
    const img    = req.params.img;
    

    const pathPhoto = filesytem.getFotoUrl(userId, img);

    res.sendFile( pathPhoto );
});


export default postRoutes;

