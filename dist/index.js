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
const server = new server_1.default();
//BodyParser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//FileUpload
server.app.use(express_fileupload_1.default());
//allow cross config
//server.app.use( cors({ origin: true, credentials: true }) );
var whitelist = ['http://localhost:8100'];
var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: "*",
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            preflightContinue: true,
            optionsSuccessStatus: 204 }; // reflect (enable) the requested origin in the CORS response
    }
    else {
        corsOptions = { origin: "*",
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            preflightContinue: true,
            optionsSuccessStatus: 204 };
    } // disable CORS for this request
    callback(null, corsOptions); // callback expects two parameters: error and options
};
server.app.use(cors_1.default(corsOptionsDelegate));
server.app.options('*', cors_1.default(corsOptionsDelegate));
server.app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
console.log();
//rutas de mi aplicacion
server.app.use('/user', Usuario_1.default);
server.app.use('/posts', Post_1.default);
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
