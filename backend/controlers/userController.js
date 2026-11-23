//requerer o model do usuario
const User = require('../models/Users')

const createUserToken = require('../helpers/create-user-token')

//requerer biblioteca bcrypt
const bcrypt = require('bcrypt')
const {Op} = require('sequelize')

module.exports = class UserController{
    /* static async register(req, res){
        const {usuario, email, senha, tipo, clinica_cnpj} = req.body

        //criptografar senha
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(senha, salt)

        //criar novo usuario
        try{
            await User.create({
                usuario: usuario,
                email: email,
                senha: passwordHash,
                tipo: tipo,
                clinica_cnpj: clinica_cnpj
            })
            res.status(200).json({message:'Usuario Cadastrado com sucesso'})
        }catch(error){
            res.status(500).json({message: error})
        }
    } */

    static async registerForClinic(req, res){
        const {usuario, email, senha, tipo} = req.body

        try{
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(senha, salt)

            await User.create({
                usuario,
                email,
                senha: passwordHash,
                tipo: Number(tipo),
                clinica_cnpj: req.user.clinica_cnpj
            })
            return res.status(201).json({message:'Usuario Cadastrado com sucesso'})
        }catch(error){
            return res.status(500).json({message: error.message})
        }
    }

    static async login(req, res){
        //requerer pelo body os parametros
        const {email, senha} = req.body

        //verificar se o usuario existe
        const user = await User.findOne({where:{email:email}})

        if(!user){
            res.status(422).json({
                message:"Não há usuário cadastrado com esse e-mail"
            })
            return
        }

        //verificar password
        const checkPassword = await bcrypt.compare(senha, user.senha)

        //retornar mensagem para senha incorreta
        if(!checkPassword){
            res.status(422).json({
                message: "Senha Invalida"
            })
            return
        }

        //geramos o token para o usuario
        await createUserToken(user, req, res)
    }

    static async update(req, res){
        const {idusuario} = req.params //id do usuario na url
        const {usuario, email, senha} = req.body

        if(Number(idusuario) !== Number(req.user.idusuario)){
            return res.status(403).json({message:'Acesso negado'})
        }

        //atualizar usuario
        try{
            //procurar usuario pelo id
            const userExists = await User.findByPk(idusuario)
            if(!userExists){
                return res.status(404).json({message: "usuário não encontrado"})
            }

            const emailExiste = await User.findOne({where:{email:email.trim(), idusuario:{[Op.ne]:idusuario}}})
            if(emailExiste){
                return res.status(409).json({message:'E-mail já cadastrado'})
            }

            const updatedFields = { usuario:usuario.trim(), email:email.trim() }

            //só se a senha vier
            if(senha){
                //criptografar senha
                const salt = await bcrypt.genSalt(12)
                updatedFields.senha = await bcrypt.hash(senha, salt)
            }

            await User.update(
                updatedFields,
                {
                    where: {idusuario: idusuario}
                }
            )
            const updatedUser = await User.findByPk(idusuario)
            await createUserToken(updatedUser, req, res)
        }catch(error){
            res.status(500).json({message: error})
        }
    }

    //administrador edita outro usuário da clínica
    static async adminUpdate(req, res){
        const {idusuario} = req.params //id do usuario na url
        const {usuario, email, senha, tipo} = req.body

        if(Number(req.user.tipo) !== 1){
            return res.status(403).json({message:'Acesso negado'})
        }
        if(Number(idusuario) === Number(req.user.idusuario)){
            return res.status(403).json({message:'Edite sua conta pelo perfil'})
        }
        if(![0, 1].includes(Number(tipo))){
            return res.status(422).json({message:'Tipo de usuário inválido'})
        }

        try{
            //procurar usuario pelo id
            const userExists = await User.findOne({where:{idusuario, clinica_cnpj:req.user.clinica_cnpj}})
            if(!userExists){
                return res.status(404).json({message:'Usuário não cadastrado'})
            }

            //impedir que a clínica fique sem administrador
            if(Number(userExists.tipo) === 1 && Number(tipo) === 0){
                const totalAdmins = await User.count({where:{clinica_cnpj:req.user.clinica_cnpj, tipo:1}})
                if(totalAdmins <= 1){
                    return res.status(403).json({message:'Não é possível alterar o último administrador'})
                }
            }

            const emailExiste = await User.findOne({where:{email:email.trim(), idusuario:{[Op.ne]:idusuario}}})
            if(emailExiste){
                return res.status(409).json({message:'E-mail já cadastrado'})
            }

            const updatedFields = { usuario:usuario.trim(), email:email.trim(), tipo:Number(tipo) }

            //só se a senha vier
            if(senha){
                //criptografar senha
                const salt = await bcrypt.genSalt(12)
                updatedFields.senha = await bcrypt.hash(senha, salt)
            }

            await User.update(updatedFields, {where:{idusuario, clinica_cnpj:req.user.clinica_cnpj}})
            return res.status(200).json({message:'Usuário atualizado com sucesso'})
        }catch(error){
            return res.status(500).json({message:error.message})
        }
    }

    static async delete(req, res){
        const {idusuario} = req.params //id do usuario na url

        if(Number(req.user.tipo) !== 1){
            return res.status(403).json({message:'Acesso negado'})
        }
        if(Number(idusuario) === Number(req.user.idusuario)){
            return res.status(403).json({message:'Você não pode excluir sua própria conta'})
        }

        try{
            const userExists = await User.findOne({where:{idusuario, clinica_cnpj:req.user.clinica_cnpj}})
            if(!userExists){
                return res.status(404).json({message:'Usuário não cadastrado'})
            }

            //impedir excluir o último administrador
            if(Number(userExists.tipo) === 1){
                const totalAdmins = await User.count({where:{clinica_cnpj:req.user.clinica_cnpj, tipo:1}})
                if(totalAdmins <= 1){
                    return res.status(403).json({message:'Não é possível excluir o último administrador'})
                }
            }

            await User.destroy({where:{idusuario, clinica_cnpj:req.user.clinica_cnpj}})
            res.status(200).json({message:'Usuario deletado com sucesso'})
        }
        catch(error){
            if(error.name === 'SequelizeForeignKeyConstraintError'){
                return res.status(409).json({message:'Usuário possui registros relacionados'})
            }
            res.status(500).json({message: error})
        }
    }

    //metodo para listar todos os usuarios
    static async listAll(req, res){
        if(Number(req.user.tipo) !== 1){
            return res.status(403).json({message:'Acesso negado'})
        }

        try{
            const users = await User.findAll({where:{clinica_cnpj:req.user.clinica_cnpj}, attributes:['idusuario','usuario','email','tipo']})
            res.status(200).json({users:users})
        }
        catch(error){
            res.status(500).json({error: error})
        }
    }

    static async listarByCNPJ(req, res){
        const clinica_cnpj = req.user.clinica_cnpj

        if(Number(req.user.tipo) !== 1){
            return res.status(403).json({message:'Acesso negado'})
        }

        try{
            const users = await User.findAll({where: {clinica_cnpj}, attributes:['idusuario','usuario','email','tipo'], order:[['usuario','ASC']]})
            return res.status(200).json({users})
        }
        catch(error){
            return res.status(500).json({message: error.message})
        }
    }

    static async listarOne(req, res){
        const { idusuario } = req.params

        if(Number(idusuario) !== Number(req.user.idusuario) && Number(req.user.tipo) !== 1){
            return res.status(403).json({message:'Acesso negado'})
        }

        try{
            const user = await User.findOne({
                where: {idusuario, clinica_cnpj:req.user.clinica_cnpj},
                attributes: ['idusuario', 'usuario', 'email', 'tipo', 'clinica_cnpj']
            })
            if(!user) return res.status(404).json({message: 'Usuário não cadastrado'})
            return res.status(200).json({user})
        }
        catch(error){
            return res.status(500).json({message: error.message})
        }
    }
}