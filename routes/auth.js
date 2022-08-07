/*
    path: api/login

*/
const { Router, request, response } = require('express');
const { check } = require('express-validator');

const { crearUsuario, login, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();


router.post('/new', [
    check('nombre','Name is required').not().isEmpty(),
    check('password', 'Paaword is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    validarCampos
], crearUsuario );

router.post('/', [
    check('password', 'Paaword is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
], login );

// validarJWT,
router.get('/renew', validarJWT, renewToken );


module.exports = router;