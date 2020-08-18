import { FileUpload } from '../interfaces/file-upload';

import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';


export default class FileSystem{

    constructor(){

    };

    guardarImagenTemporal( file: FileUpload, userID: string ){

        return new Promise( (resolve, reject) =>{
            //crear carpetas
            const path = this.crearCarpetaUsuario( userID );
    
            //nombre de archivo
            const nombreArchivo = this.generarNombre( file.name );
    
            //Mover el archivo de temp a nuetra carpeta
            file.mv( `${ path }/${nombreArchivo}`, (err: any) =>{
    
                if( err ){
                    //no se pudo mover
                    reject(err);
                } else {
                    //todo salio bien
                    resolve(); 
                }
    
            });

        })

    }

    private generarNombre( nombreOriginal: string ){
        //error.png
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length - 1];

        const idUnico = uniqid();

        return `${ idUnico }.${extension}`;
    } 

    private crearCarpetaUsuario( userID: string ){

        const pathUser = path.resolve( __dirname, '../uploads', userID );
        const pathTemp = pathUser + '/temp'; 
        // console.log(pathUser);
        // console.log(pathTemp);   

        const existe = fs.existsSync( pathUser );
        
        if( !existe ){
            fs.mkdirSync( pathUser, {recursive: true} );
            fs.mkdirSync( pathTemp );
        }

        return pathTemp;
        
    }

    imagenesdeTempHaciaPost( userID:string ){
        const pathTemp = path.resolve( __dirname, '../uploads', userID, 'temp' );
        const pathPost = path.resolve( __dirname, '../uploads', userID, 'posts' );

        if( !fs.existsSync (pathTemp) ){
            return [];
        }

        if( !fs.existsSync (pathPost) ){
            fs.mkdirSync( pathPost );
        }

        const imagenesTemp = this.obteberImagenesenTemp( userID );

        imagenesTemp.forEach( imagen =>{
            fs.renameSync( `${ pathTemp }/${ imagen }`, `${ pathPost }/${ imagen }` )
        });

        return imagenesTemp;
    }

     private obteberImagenesenTemp( userID:string){
        const pathTemp = path.resolve( __dirname, '../uploads', userID, 'temp' );

        return fs.readdirSync( pathTemp ) || [];
    }

    getFotoUrl(userId: string, img: string){

        //path POSTs
        const pathFoto = path.resolve( __dirname, '../uploads', userId, 'posts', img); 

        //si la imagen existe
        const existe = fs.existsSync( pathFoto );
          if ( !existe ){
              return  path.resolve( __dirname, '../assets/400x250.jpg' );
          }


        return pathFoto;
    }

}