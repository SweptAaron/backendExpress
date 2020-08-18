"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./clases/server"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const Usuario_1 = __importDefault(require("./Rutas/Usuario"));
const Post_1 = __importDefault(require("./Rutas/Post"));
const cors_1 = __importDefault(require("cors"));
const usuario_model_1 = require("./models/usuario.model");
const token_1 = __importDefault(require("./clases/token"));
const server = new server_1.default();
//BodyParser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//FileUpload
server.app.use(express_fileupload_1.default());
//allow cross config
//server.app.use( cors({ origin: true, credentials: true }) );
//rutas de mi aplicacion
//server.app.use( '/user', userRoutes )
var corsOptions = { origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-KEY', 'Origin', 'X-Requested-With', 'Accept', 'Access-Control-Allow-Request-Method', 'x-token'],
    preflightContinue: false,
    optionsSuccessStatus: 204 };
Usuario_1.default.post('/login', cors_1.default(corsOptions), (req, resp) => {
    const body = req.body;
    usuario_model_1.Usuario.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            throw err;
        }
        ;
        if (!userDB) {
            return resp.json({
                ok: false,
                mensaje: 'Usuario/Contraseña son incorrectos'
            });
        }
        if (userDB.compararPassword(body.password)) {
            const tokenUser = token_1.default.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            });
            resp.json({
                ok: true,
                token: tokenUser
            });
        }
        else {
            return resp.json({
                ok: false,
                mensaje: 'Usuario/Contraseña son incorrectos****'
            });
        }
    });
});
server.app.use('/posts', Post_1.default);
//Login
//conectar BD
mongoose_1.default.connect('mongodb+srv://SweptAaron:CyD160412@cluster0-ok4he.mongodb.net/fotosgram?retryWrites=true&w=majority', { useNewUrlParser: true,
    useCreateIndex: true,
}, (err) => {
    if (err)
        throw err;
    console.log("base de datos ONLINE");
});
//levantar expres
server.start(() => {
    console.log(`servidor corriendo el puerto ${server.port}`);
});
// var corsOptions = { origin: true,
// methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
// allowedHeaders: ['Content-Type', 'Authorization', 'X-API-KEY', 'Origin', 'X-Requested-With', 'Accept', 'Access-Control-Allow-Request-Method', 'x-token'],
// preflightContinue: true,
// optionsSuccessStatus: 204 } 
// server.app.options('*',cors(corsOptions));
// server.app.use(cors(corsOptions));
