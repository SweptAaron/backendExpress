"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_model_1 = require("../models/usuario.model");
const token_1 = __importDefault(require("../clases/token"));
const loginRoute = express_1.Router();
const cors_1 = __importDefault(require("cors"));
var corsOptions = { origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-KEY', 'Origin', 'X-Requested-With', 'Accept', 'Access-Control-Allow-Request-Method', 'x-token'],
    preflightContinue: false,
    optionsSuccessStatus: 204 };
loginRoute.post('/', cors_1.default(corsOptions), (req, resp) => {
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
exports.default = loginRoute;
