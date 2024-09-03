const express = require('express');
const ThoughtController = require('../controllers/ThoughtController');
const router = express.Router();

const checkAuth = require('../helpers/auth').checkAuth;

router.get("/add", checkAuth, ThoughtController.redirectToCreate)
router.post("/add", checkAuth, ThoughtController.create)
router.get("/edit/:id", checkAuth, ThoughtController.redirectToEdit)
router.post("/edit", checkAuth, ThoughtController.edit)
router.get("/dashboard",checkAuth, ThoughtController.dashboard)
router.post("/delete", checkAuth, ThoughtController.delete)
router.get('/', ThoughtController.showAllThoughts)

module.exports = router;