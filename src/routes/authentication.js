const router = require('express').Router();
const pool = require('../database');
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');
const helpers = require('../lib/helpers');
const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { waterfall } = require("async");
const { validationResult } = require('express-validator/check');

// SIGNUP
router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/home',
  failureRedirect: '/signup',
  failureFlash: true
}));

// SINGIN
router.get('/signin', (req, res) => {
  res.render('auth/signin');
});

router.post('/signin', (req, res, next) => {
  req.check('username', 'Username is Required').notEmpty();
  req.check('password', 'Password is Required').notEmpty();
  const errors = req.validationErrors();
  if (errors.length > 0) {
    req.flash('message', errors[0].msg);
    res.redirect('/signin');
  }
 
  passport.authenticate('local.signin', {
    successRedirect: '/home',
    failureRedirect: '/signin',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});

router.get('/home', isLoggedIn, async (req, res) => {

  res.render('dashboard.hbs');
});

// CHANGE PASSWORD
router.get('/change',  isLoggedIn, (req, res) => {
  //passNew = await helpers.encryptPassword(newpass);
  res.render('auth/change.hbs');
});

router.post('/change/:id',  async (req, res) => {
  const { id } = req.params;
  const { oldpass, newpass, repepass } = req.body;
  const newClave = {
    password: ''
  };
  
  if(newpass !== repepass){
    req.flash('message', 'Los Password no son iguales.');
    res.redirect('/change');
  }

  newClave.password = await helpers.encryptPassword(newpass);
   await pool.query('UPDATE users set ? WHERE id = ?', [newClave, id]);
  req.flash('success', 'Se Cambio el Password Correctamente');
  res.redirect('/home');   
});

// CHANGE PERFIL
router.get('/perfil',  isLoggedIn, (req, res) => {
  res.render('auth/perfil.hbs');
});

router.post('/perfil/:id',  async (req, res) => {
  const { id } = req.params;
  const { fullname, username, cel, email } = req.body;
  const newUser = {
    fullname,
    username,
    cel,
    email
  };
  
  newUser.fullname = newUser.fullname.toUpperCase();
  await pool.query('UPDATE users set ? WHERE id = ?', [newUser, id]);
  req.flash('success', 'Se Actualizo los datos Correctamente');
  res.redirect('/home');   
});


// FORGOT
router.get('/forgot', (req, res) => {
  res.render('auth/forgot.hbs');
});

router.post('/forgot', async function(req, res, next) {
  const email = req.body.email;
  memail = email;
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        mtoken = token;
        done(err, token);
      });
    },
    async function(token, done) {
      const rows = await pool.query('SELECT * FROM users WHERE email = ?', [email]); 
      var filas = rows.length;

      if (filas != 1) {
        console.log('No existe una cuenta con esa direcci??n de correo electr??nico.');
        req.flash('message', 'No existe una cuenta con esa direcci??n de correo electr??nico.');
        return res.redirect('/forgot');
      }    
 
      const newToken = {
        token: token,
        expira:  Date.now() + 3600000
      };
      pool.query('UPDATE users set ? WHERE email = ?', [newToken, memail]);
    },
    async function(token, done) { 
      var smtpTransport =  nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'alfredogutierrezcruz63@gmail.com',
          pass: '17cruz632411'
        }
      });
      //console.log(smtpTransport);
      const mailOptions = {
        to: memail,
        from: 'alfredogutierrezcruz63@gmail.com',
        subject: 'Restablecimiento de la contrase??a',
        text: 'Est?? recibiendo esto porque usted (u otra persona) ha solicitado restablecer la contrase??a de su cuenta.\n\n' + 'Haga clic en el siguiente enlace o p??guelo en su navegador para completar el proceso:\n\n' +
          'http://' + req.headers.host + '/reset/' + mtoken + '\n\n' +
          'Si no solicit?? esto, ignore este correo electr??nico y su contrase??a permanecer?? sin cambios.\n'
      };
    
      //console.log(mailOptions); 
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('message', 'Se ha enviado un correo electr??nico a ' + memail + ' con m??s instrucciones');
        console.log('send');
        res.redirect('/forgot');
        done(err, 'done');
      });
    }
  ], function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
});


router.get('/reset/:token', async (req, res) => {
  const { token } = req.params;
  const rows = await pool.query('SELECT * FROM users WHERE token = ?', [token]); 
  idusr = rows[0].id;

  if (token.length > 0) {
    if (Date.now() > rows[0].expira) {
      req.flash('message', 'El token de restablecimiento de contrase??a no es v??lido o ha expirado.');
      return res.redirect('/forgot');
    }
  }

  res.render('auth/reset.hbs', {id: idusr});
});


router.post('/reset/:id', function(req, res) {
  const { id } = req.params;
  const { password, repepass } = req.body;
  async.waterfall([
    async function(done) {
      const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
      memail = rows[0].email;
      
      if (Date.now() > rows[0].expira) {
        req.flash('message', 'El token de restablecimiento de contrase??a no es v??lido o ha expirado.');
        return res.redirect('back');
      }
      
      if(password !== repepass){
        req.flash('message', 'Los Password no son iguales.');
        res.redirect('/reset/:id');
      }

      if (rows.length > 0) {
        const newToken = {
          password: req.body.password,
          token: null,
          expira: null
        };

        newToken.password = await helpers.encryptPassword(req.body.password);
        await pool.query('UPDATE users set ? WHERE id = ?', [newToken, id]);
      }  
    },
    async function(done) {
      var smtpTransport =  nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'alfredogutierrezcruz63@gmail.com',
          pass: '17cruz632411'
        }
      });
      //console.log(smtpTransport);
      var mailOptions = {
        to: memail,
        from: 'alfredogutierrezcruz63@gmail.com',
        subject: 'Su password fue cambiado',
        text: 'Hola,\n\n' +
          'Esta es una confirmaci??n de que la contrase??a de su cuenta. ' + memail + ' acaba de ser cambiada.\n'
      };
      //console.log(mailOptions);
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', '??xito! Tu contrase??a ha sido cambiada.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
});

module.exports = router;





// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
/* const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: 'test@example.com',
  from: 'test@example.com',
  subject: 'Sending with Twilio SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg); */