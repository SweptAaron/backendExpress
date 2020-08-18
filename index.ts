import Server from './clases/server';
import mongoose from 'mongoose';

import bodyparser from 'body-parser'
import fileUpload from 'express-fileupload'

import userRoutes from './Rutas/Usuario';
import postRoutes from './Rutas/Post';

import cors from 'cors';



const server = new Server();

//BodyParser
server.app.use(bodyparser.urlencoded({ extended: true }));
server.app.use(bodyparser.json());

//FileUpload
server.app.use( fileUpload() );

//allow cross config
server.app.use( cors({ origin: true, credentials: true }) );

server.app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'x-token, content-type');
    next();
    });

//rutas de mi aplicacion
server.app.use( '/user', userRoutes )
server.app.use( '/posts', postRoutes )
//Login

//conectar BD
mongoose.connect('mongodb+srv://SweptAaron:CyD160412@cluster0-ok4he.mongodb.net/fotosgram?retryWrites=true&w=majority',
        {   useNewUrlParser: true,
            useCreateIndex: true,
        }, ( err ) =>{
            if(err)throw err;

            console.log("base de datos ONLINE");
            
        } )


//levantar expres
server.start( () => {
    console.log(`servidor corriendo el puerto ${ server.port}`);
} );




// var corsOptions = { origin: true,
// methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
// allowedHeaders: ['Content-Type', 'Authorization', 'X-API-KEY', 'Origin', 'X-Requested-With', 'Accept', 'Access-Control-Allow-Request-Method', 'x-token'],
// preflightContinue: true,
// optionsSuccessStatus: 204 } 


// server.app.options('*',cors(corsOptions));
// server.app.use(cors(corsOptions));