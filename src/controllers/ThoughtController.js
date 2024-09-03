const Thought = require("../models/Thought");
const User = require("../models/User");

const { Op } = require("sequelize");

module.exports = class ThoughtController {

    static redirectToCreate(req, res) {
        res.render("thoughts/create");
    }

    static async showAllThoughts (req, res){
        let search = ""

        if (req.query.search){
            search = req.query.search
        }
        let order = "DESC"
        if (req.query.order === 'old'){
            order = "ASC"
        }

        const thoughtsData = await Thought.findAll({
            include: User,
            where: {
                title: {[Op.like]: `%${search}%`}
            }, order: [['createdAt', order]]
        })
        const thoughts = thoughtsData.map((thought) => thought.get({plain: true}))

        let thoughtsSize = thoughts.length
        if (thoughtsSize === 0){
            thoughtsSize = false
        }
        res.render("thoughts/index", {thoughts, search, thoughtsSize})
    }

    static async dashboard(req, res){
        const user = await User.findOne({where: {
            id: req.session.userid
        },
            include: Thought,
            plain: true
        })

        if (!user){
            res.redirect("/auth/login")
            return
        }
        const thoughts = user.Thoughts.map((thought) => thought.dataValues)
        res.render("thoughts/dashboard", {thoughts, emptyThoughts: thoughts.length === 0});
    }

    static async create(req,res){
        const thought = {
            title: req.body.title,
            UserId: req.session.userid
        }
        try {
            await Thought.create(thought)
            req.flash("message", "Pensamento criado")

            req.session.save(() => {
                res.redirect("/thoughts/dashboard")
            })
        }catch(err){
            console.log(err)
        }
    }

    static async delete(req,res){
        const id = req.body.id
        const UserId = req.session.userid


        try{
            await Thought.destroy({where: {id: id, UserId: UserId}})
            req.flash("message", "Pensamento deletado!")
            req.session.save(()=>{
                res.redirect("/thoughts/dashboard")
            })
        }catch (err){
            console.log(err)
        }
    }

    static async redirectToEdit(req, res){

        const id = req.params.id;

        const thought = await Thought.findOne({raw: true,where: {id: id}})
        res.render("thoughts/edit", {thought})
    }

    static async edit(req, res){

        const thought = {
            id: req.body.id,
            title: req.body.title,
            UserId: req.session.userid
        }

        try{
            await Thought.update(thought, {where: {id: thought.id, UserId: thought.UserId}})
            req.flash("message", "Pensamento editado!")
            req.session.save(()=>{
                res.redirect("/thoughts/dashboard")
            })
        }catch(err){
            console.log(err)
        }
    }
}