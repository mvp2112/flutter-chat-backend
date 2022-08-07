const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');


const crearUsuario = async (request, response = response) => {

    const { email, password } = request.body;

    try {

        const existeEmail = await Usuario.findOne({ email });
        if( existeEmail ) {
            return response.status(400).json({
                ok: false,
                msg: 'Check your email'
            });
        }

        const usuario = new Usuario( request.body );

        // Encreiptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();

        // Generar mi JWT
        const token = await generarJWT(usuario.id );


        response.json({
            ok: true,
            usuario,
            token
        });


    } catch (error) {
        console.log(error);
        response.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const login = async ( req, res = response ) => {

    const { email, password }  = req.body;

    try {

        const usuarioDB = await Usuario.findOne({ email });
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Email not registered'
            });
        }

        // Validar password
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Incorrect Password'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuarioDB.id );

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Contact to admin'
        })

    }

}


const renewToken = async ( req, res = response ) => {

    const uid = req.uid;

    // Generar un nuevo JWT, generarJWT
    const token = await generarJWT ( uid );

    // Obtener el usuario por el UID
    const usuario = await Usuario.findById( uid );


    res.json({
        ok: true,
        usuario,
        token
    })

}


module.exports = {
    crearUsuario,
    login,
    renewToken
}