const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = class AuthController {

    static login(req, res) {
        res.render('auth/login');
    }

    static register(req, res) {
        res.render('auth/register');
    }

    static async addNewRegister(req,res){
        const {confirmpassword} = req.body;
        if (confirmpassword !== req.body.password){
            req.flash("message", "As senhas não conferem, digite novamente")
            res.render('auth/register');
            return
        } else {
            const checkIfExists = await User.findOne({where: {email: req.body.email}})
            if(checkIfExists){
                req.flash("message", "O email digitado já está em uso")
                res.render('auth/register');
                return
            }

            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(req.body.password, salt);

            const user = {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
            }

            try{
                const userRegistered = await User.create(user)
                req.flash("message", "Cadastro realizado com sucesso")
                req.session.userid = userRegistered.id
                req.session.save(() => {
                    res.redirect("/")
                })

            } catch (err){
                console.log(err)
            }
        }

    }

    static logout(req,res){
        req.session.destroy()
        res.redirect("/auth/login")
    }

    static async loginPost(req, res){
        const {email, password} = req.body;
        const user = await User.findOne(({where: {email: email}}))
        if (!user){
            req.flash("message", "Usuário não encontrado")
            res.redirect("/auth/login")
            return
        }

        const passwordMatch = bcrypt.compareSync(password, user.password);
        if(!passwordMatch){
            req.flash("message", "Senha ou e-mail inválidos")
            res.redirect("/auth/login")
            return
        }
        req.session.userid = user.id;
        req.flash("message", "Login efetuado com sucesso")
        req.session.save(() =>{
            res.redirect("/")
        })
    }
}