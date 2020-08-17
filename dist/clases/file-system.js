"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() {
    }
    ;
    guardarImagenTemporal(file, userID) {
        return new Promise((resolve, reject) => {
            //crear carpetas
            const path = this.crearCarpetaUsuario(userID);
            //nombre de archivo
            const nombreArchivo = this.generarNombre(file.name);
            //Mover el archivo de temp a nuetra carpeta
            file.mv(`${path}/${nombreArchivo}`, (err) => {
                if (err) {
                    //no se pudo mover
                    reject(err);
                }
                else {
                    //todo salio bien
                    resolve();
                }
            });
        });
    }
    generarNombre(nombreOriginal) {
        //error.png
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length - 1];
        const idUnico = uniqid_1.default();
        return `${idUnico}.${extension}`;
    }
    crearCarpetaUsuario(userID) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads', userID);
        const pathTemp = pathUser + '/temp';
        // console.log(pathUser);
        // console.log(pathTemp);   
        const existe = fs_1.default.existsSync(pathUser);
        if (!existe) {
            fs_1.default.mkdirSync(pathUser, { recursive: true });
            fs_1.default.mkdirSync(pathTemp);
        }
        return pathTemp;
    }
    imagenesdeTempHaciaPost(userID) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads', userID, 'temp');
        const pathPost = path_1.default.resolve(__dirname, '../uploads', userID, 'posts');
        if (!fs_1.default.existsSync(pathTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathPost)) {
            fs_1.default.mkdirSync(pathPost);
        }
        const imagenesTemp = this.obteberImagenesenTemp(userID);
        imagenesTemp.forEach(imagen => {
            fs_1.default.renameSync(`${pathTemp}/${imagen}`, `${pathPost}/${imagen}`);
        });
        return imagenesTemp;
    }
    obteberImagenesenTemp(userID) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads', userID, 'temp');
        return fs_1.default.readdirSync(pathTemp) || [];
    }
    getFotoUrl(userId, img) {
        //path POSTs
        const pathFoto = path_1.default.resolve(__dirname, '../uploads', userId, 'posts', img);
        //si la imagen existe
        const existe = fs_1.default.existsSync(pathFoto);
        if (!existe) {
            return path_1.default.resolve(__dirname, '../assets/400x250.jpg');
        }
        return pathFoto;
    }
}
exports.default = FileSystem;
