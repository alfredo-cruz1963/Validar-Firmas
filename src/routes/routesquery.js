const router = require('express').Router();

const { isLoggedIn } = require('../lib/auth');
const querysctrl = require('../controllers/ctrlquerys');

router.get('/add', isLoggedIn, querysctrl.add);
router.get('/add1', isLoggedIn, querysctrl.add1);
router.post('/list', isLoggedIn, querysctrl.list);
router.get('/rangofechas', isLoggedIn, querysctrl.rangofechas)
router.post('/listproduc', isLoggedIn, querysctrl.listproduc);
router.post('/listdate', isLoggedIn, querysctrl.listdate);
router.get('/grid', isLoggedIn, querysctrl.grid);
router.get('/edit/:cedula', isLoggedIn, querysctrl.edit);
router.post('/update', isLoggedIn, querysctrl.update);
router.get('/delete/:cedula', isLoggedIn,querysctrl.delete);
router.get('/print1', isLoggedIn, querysctrl.print1);
router.get('/print2', isLoggedIn, querysctrl.print2);


module.exports = router;