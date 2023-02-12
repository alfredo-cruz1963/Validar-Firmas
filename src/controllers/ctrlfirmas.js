const ctrlfirmas = {};
var mcedula = '';
var mnombre = '';
var mcodmpio = '';
var mcodcau = '';
var mnomcau = '';

const pool = require('../database');

// ********** despliega la pagina para comprobar la cedula *************
ctrlfirmas.add = (req, res) => {
  res.render('firmas/valida.hbs');
};

// ********** despliega la pagina para editar la cedula *************
ctrlfirmas.add1 = (req, res) => {
  res.render('firmas/inputcc.hbs');
};

// *********** valida si cedula ya fue verificada *****************
ctrlfirmas.valid = async (req, res) => {
  const micedula = req.body.cedula;
  mcedula = micedula;
  mnombre = "";

  const datos = await pool.query('SELECT * FROM fvalidas WHERE cedula = ?', micedula);

  if (datos.length > 0) {
    mcodmpio = datos[0].codmpio;
    mnombre = datos[0].nombres + ' ' + datos[0].apellidos;
    mcodcau = '01';
    mnomcau = 'YA FUE VERIFICADA';
    req.flash('message', 'La cedula numero: ' + micedula + ', YA fue digitada.');
    res.redirect('/firmas/view');
  } else {
    res.redirect('/firmas/muestra');
  };
};

// ****************** pagina para capturar la firma ya verificada ****************
ctrlfirmas.view = async (req, res) => {
  const causas = await pool.query('SELECT * FROM fcausales');
  res.render('firmas/novalidas.hbs', { causas: causas, cedula: mcedula, nombre: mnombre, codcau: mcodcau, mnomcau });
};

// ****************** Graba la cedula ya duplicada y ya verificada ********************
ctrlfirmas.savenv = async (req, res) => {
  const { cedula, nombre, causal, planilla, codmpio } = req.body;
  const newNull = {
    cedula,
    nombre,
    causal,
    planilla,
    codmpio
  };

  newNull.nombre = newNull.nombre.toUpperCase();
  newNull.planilla = newNull.planilla.padStart(6, '0');
  newNull.codmpio = mcodmpio;

  await pool.query('INSERT INTO fanuladas set ?', [newNull]);
  req.flash('success', 'La firma ya verificada, se guardo Correctamente');

  res.redirect('/firmas/add');
};

// ********** despliega la pagina para grabar las firmas validas *************
ctrlfirmas.muestra = async (req, res) => {
  var mcodmpio = '';
  var msexo = 0;

  const dbMeta = await pool.query('SELECT * FROM meta WHERE cedula = ?', mcedula);
  const cytes = await pool.query('SELECT * FROM dane');
  const puestos = await pool.query("SELECT codigo, CONCAT(codcom, ' ', nombpuesto) As nombpuesto FROM divipol WHERE codmpio = '52001'");

  console.log("envio cedula ", mcedula)
  if (dbMeta.length > 0) {
    msexo = dbMeta[0].sexo;
    mcodmpio = dbMeta[0].codmpio;
    mnombre = dbMeta[0].nombres + ' ' + dbMeta[0].apellidos;
    mcodcau = '';
    mnomcau = 'Seleccione una causal';
  }

  res.render('firmas/add.hbs', { cytes, puestos, dcto: mcedula, datos: dbMeta[0], genero: msexo });
};

ctrlfirmas.grabar = async (req, res) => {
  const { cedula, nombres, apellidos, dir, barrio, cel, codmpio, puesto, planilla, sexo, usuario, fecha } = req.body;
  const newFirma = {
    cedula,
    nombres,
    apellidos,
    dir,
    barrio,
    cel,
    codmpio: '52001',
    puesto,
    planilla,
    sexo,
    usuario: req.user.username,
    fecha: new Date()
  };

  console.log(newFirma)

  newFirma.nombres = newFirma.nombres.toUpperCase();
  newFirma.apellidos = newFirma.apellidos.toUpperCase();
  newFirma.dir = newFirma.dir.toUpperCase();
  newFirma.barrio = newFirma.barrio.toUpperCase();
  newFirma.planilla = newFirma.planilla.padStart(6, '0');

  await pool.query('INSERT INTO fvalidas set ?', [newFirma]);
  req.flash('success', 'La firma se guardo Correctamente');

  res.redirect('/firmas/add');
};

// ********** despliega la pagina para editar las firmas validas *************
ctrlfirmas.edit = async (req, res) => {
  const micedula = req.body.cedula;
  mcedula = micedula;
  var mnombmpio = '';
  var mnombpto = '';

  const datos = await pool.query('SELECT * FROM fvalidas WHERE cedula = ?', micedula);

  if (datos.length > 0) {
    var msexo = datos[0].sexo;
    if (msexo == '1') {
      var xsexo = true;
    } else {
      var xsexo = false;
    };

    mcodmpio = datos[0].codmpio;
    const cytes = await pool.query('SELECT * FROM dane WHERE codigo = ?', mcodmpio);
    mnombmpio = cytes[0].mpio;
    mcodpto = datos[0].puesto;
    const puestos = await pool.query('SELECT codigo, nombpuesto FROM divipol WHERE codigo = ?', mcodpto);
    mnombpto = puestos[0].nombpuesto;

    res.render('firmas/edit.hbs', { datos: datos[0], genero: xsexo, nombmpio: mnombmpio, nombpto: mnombpto });
  } else {
    req.flash('message', 'La cedula numero: ' + mcedula + ', No se a registrado.');
    res.redirect('/firmas/add1');
  }
};

// ********** actualiza la BD de firmas validas *************
ctrlfirmas.update = async (req, res) => {
  const micedula = req.body.cedula;
  const { cedula, nombres, apellidos, dir, barrio, cel, codmpio, puesto, sexo, planilla } = req.body;
  const newFirma = {
    cedula,
    nombres,
    apellidos,
    dir,
    barrio,
    cel,
    codmpio,
    puesto,
    sexo,
    planilla
  };

  newFirma.nombres = newFirma.nombres.toUpperCase();
  newFirma.apellidos = newFirma.apellidos.toUpperCase();
  newFirma.dir = newFirma.dir.toUpperCase();
  newFirma.barrio = newFirma.barrio.toUpperCase();
  newFirma.planilla = newFirma.planilla.padStart(6, '0');

  await pool.query('UPDATE fvalidas set ? WHERE cedula = ?', [newFirma, micedula]);
  req.flash('success', 'La Firma se Actualizado Correctamente');
  res.redirect('/home');
};

// ************** Delete *********************
ctrlfirmas.delete = async (req, res) => {
  const { cedula } = req.params;

  await pool.query('DELETE FROM fvalidas WHERE CEDULA = ?', [cedula]);
  req.flash('success', 'La Firma fue Borrada Correctamente');
  res.redirect('/home');
};

module.exports = ctrlfirmas;



