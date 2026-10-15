const verifyAdmin = (req, res, next) => {
    if (req.user.tipo !== 1) {
        return res.status(403).json({ message: 'Acesso permitido somente para administradores' })
    }

    return next()
}

module.exports = verifyAdmin
