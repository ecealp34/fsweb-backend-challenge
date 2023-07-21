const router = require('express').Router()
const User = require('../users/users-model')
const bcrypt = require('bcryptjs');
const { HASH_ROUND } = require('../../config');
const { generateToken, validateEmail, checkRole } = require('./auth-middleware');
const { validatePayload } = require('../users/users-middleware');

router.post('/register', validatePayload, validateEmail, async (req,res,next) => {
    try {
        const payload = req.body;
        payload.password = bcrypt.hashSync(payload.password, Number(HASH_ROUND))
        const newUser = await User.create(payload)
        if(newUser) {
            res.status(201).json({message: `${payload.username} hoşgeldin...`})
        } else {
            next({status:400, message: "Kullanıcı kaydı oluşturulamadı..."})
        }
    } catch (error) {
        next(error)
    }
})

router.post('/login', validatePayload, async (req,res,next) => {
    try {
        const { email, password } = req.body;
        const registeredUser = await User.getByEmail(email);
        if(registeredUser && bcrypt.compareSync(password, registeredUser.password)) {
            const token = await generateToken(registeredUser);
            res.json({message: `${registeredUser.username} tekrar hoşgeldin...`, token})
        } else {
            next({status:401, message: "Geçersiz kimlik girişi..."})
        }
    } catch (error) {
        next(error)
    }
})

module.exports = router;






