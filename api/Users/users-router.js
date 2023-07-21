const router = require('express').Router();
const User = require('./users-model');
const { validateId } = require('./users-middleware');


router.get('/', async (req,res,next) => {
    try {
        const users = await User.getAll()
        res.json(users)
    } catch (error) {
        next(error)
    }
})

router.get('/:id', validateId, async (req,res,next) => {
    try {
        const { id } = req.params;
        const user = await User.getById(id);
        res.json(user)
    } catch (error) {
        next(error)
    }
})


router.put('/:id', validateId, async (req,res,next) => {
    try {
        const { id } = req.params;
        const updatedUser = await User.update(id, req.body);
        if(updatedUser) {
            res.json({message: `${id} id'li kullanıcı güncellendi`})
        } else {
            res.status(400).json({message: `${id} id'li kullanıcı güncellenemedi`})
        }
    } catch (error) {
        next(error)
    }
})


router.delete('/:id', validateId, async (req,res,next) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.remove(id);
        if(deletedUser) {
            res.json({message: `${id} id'li kullanıcı silindi`})
        } else {
            res.status(400).json({message: `${id} id'li kullanıcı silinemedi`})
        }
    } catch (error) {
        next(error)
    }
})

module.exports = router;