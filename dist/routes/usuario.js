var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/auth');

var app = express();

var Usuario = require('../models/usuario');

// ==========================================
// Crear un nuevo usuario
// ==========================================
//app.post('/', mdAutenticacion.verificaToken, (req, res) => {
app.post('/', (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        isActive: true
    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            message: `Usuario ${usuarioGuardado.nombre} creado exitosamente`,
            usuariotoken: req.usuario
        });


    });

});

// ==========================================
// Obtener usuarios
// ==========================================
app.get('/', mdAutenticacion.verificaToken, (req, res) => {

    /* var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
    }); */

    Usuario.find({})
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando lista de reproduccion',
                        errors: err
                    });
                }
                Usuario.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: conteo
                    });
                })
            });

});

// ==========================================
// Actualizar lista de usuario
// ==========================================
app.put('/:id' , mdAutenticacion.verificaToken,  (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (error, usuario) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar lista de reproduccion',
                errors: error
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: `El usuario con id ${id} no existe`,
                errors: error
            })
        }
        



        usuario.nombre = body.nombre ? body.nombre : usuario.nombre;
        usuario.email = body.email ? body.email : usuario.email;
        usuario.password = body.password ? body.password : usuario.password;
        //usuario.isActive = body.isActive ? body.isActive : usuario.isActive;
        usuario.isActive = body.isActive



        usuario.save((error, usuarioGuardado) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al Actualizar usuario',
                    errors: error
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: 'Usuario modificado exitosamente',
                usuario: usuarioGuardado
            })
        })
    })
})

// ============================================
//   Borrar un usuario por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            lista: usuarioBorrado,
            mensaje: `Usuario ${usuarioBorrado.nombre} borrado`
        });

    });

});

module.exports = app;