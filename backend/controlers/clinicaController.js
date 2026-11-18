//requerer o model do usuario
const Clinica = require('../models/Clinica')
const User = require('../models/Users')

//requerer a conexão (usada para a transação) e a biblioteca bcrypt
const conn = require('../db/conn')
const bcrypt = require('bcrypt')

module.exports = class ClinicaController{
    /* static async register(req, res){
        const {cnpj, nome} = req.body

        //criar novo usuario
        try{
            await Clinica.create({
                cnpj: cnpj,
                nome: nome
            })
            res.status(200).json({message:'Clinica Cadastrada com sucesso'})
        }catch(error){
            res.status(500).json({message: error})
        }
    } */

    //Cadastra a clínica e o usuário master (administrador) juntos: se um falhar, nenhum é salvo.
    static async registerCompleto(req, res){
        const {cnpj, nome, usuario, email, senha} = req.body

        try{
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(senha, salt)

            //criar novo usuario
            await conn.transaction(async (transaction) => {
                await Clinica.create({cnpj, nome}, {transaction})
                await User.create({
                    usuario,
                    email,
                    senha: passwordHash,
                    tipo: 1,
                    clinica_cnpj: cnpj
                }, {transaction})
            })

            return res.status(201).json({message:'Clínica e usuário master cadastrados com sucesso'})
        }catch(error){
            if(error.name === 'SequelizeUniqueConstraintError'){
                return res.status(409).json({message:'Já existe uma clínica cadastrada com este CNPJ'})
            }
            return res.status(500).json({message: error.message})
        }
    }

    static async update(req, res){
        const {cnpj} = req.params //id do Clinica na url
        const {nome} = req.body

        //atualizar Clinica
        try{
            //procurar Clinica pelo id
            const Exists = await Clinica.findByPk(cnpj)
            if(!Exists){
                return res.status(404).json({message: "Clinica não encontrado"})
            }

            await Clinica.update(
                {
                    nome: nome
                },
                {
                    where: {cnpj: cnpj}
                }
            )
            res.status(200).json({message:'Clinica alterado com sucesso'})
        }catch(error){
            res.status(500).json({message: error})
        }
    }

    //metodo para listar todos os usuarios
    static async listAll(req, res){
        try{
            const clinicas = await Clinica.findAll()
            res.status(200).json({clinicas: clinicas})
        }
        catch(error){
            res.status(500).json({error: error})
        }
    }

    static async listarOne(req, res){
        const cnpj = req.params

        try{
            const Clinicas = await Clinica.findOne({where: cnpj})
            if(!Clinicas){
                Clinicas = "Clinica não cadastrada"
            }
        }
        catch(error){
            res.status(500).json({error: error})
        }
    }
}