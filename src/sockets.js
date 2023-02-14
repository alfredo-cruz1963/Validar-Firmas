const pool = require('./database');

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("nuevo socket connectado:", socket.id);

    // Send all messages to the client
    var emitDatos = async () => {
      var nombcom = [];
      var firmcom = [];
      var nombcrgto = [];
      var firmcrgto = [];

      //await pool.query(`SET sql_mode='STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';`);
      const validas = await pool.query('SELECT COUNT(*) total FROM fvalidas');
      const nulas   = await pool.query('SELECT COUNT(*) total FROM fanuladas');
      const planillas = await pool.query('SELECT COUNT(*) total FROM vtotplanillas');
      const comuna = await pool.query('SELECT comuna, total FROM vtotcomunas');
      const crgmtos = await pool.query('SELECT corregimiento, total FROM vtotcorreg');
      const sexos = await pool.query('SELECT mujeres, hombres FROM vfirmasexo');

      const valida = validas[0].total;
      const anuladas = nulas[0].total;
      const totplan = planillas[0].total;  
      const genero = [sexos[0].mujeres, sexos[0].hombres];
    
      for (var i in comuna) {
        nombcom.push(comuna[i].comuna);
        firmcom.push(comuna[i].total);
      }
    
      for (var i in crgmtos) {
        nombcrgto.push(crgmtos[i].corregimiento);
        firmcrgto.push(crgmtos[i].total);
      }
      
      var datos = [valida, anuladas, totplan, nombcom, firmcom, nombcrgto, firmcrgto, genero];
      socket.emit("server:muestraDatos", datos);
    };
    emitDatos();

    socket.on("client:addFirma",  (actualiza) => {
      console.log("Actualizando...");

      var emitInfo = async () => {
        var nombcom1 = [];
        var firmcom1 = [];
        var nombcrgto1 = [];
        var firmcrgto1 = [];
  
        //await pool.query(`SET sql_mode='STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';`);
        const validas1 = await pool.query('SELECT COUNT(*) total FROM fvalidas');
        const planillas1 = await pool.query('SELECT COUNT(*) total FROM vtotplanillas');
        const comuna1 = await pool.query('SELECT comuna, total FROM vtotcomunas');
        const crgmtos1 = await pool.query('SELECT corregimiento, total FROM vtotcorreg');
        const sexos1 = await pool.query('SELECT mujeres, hombres FROM vfirmasexo');
  
        const valida1 = validas1[0].total+1;
        const totplan1 = planillas1[0].total;  
        const genero1 = [sexos1[0].mujeres, sexos1[0].hombres];
  
        for (var i in comuna1) {
          nombcom1.push(comuna1[i].comuna);
          firmcom1.push(comuna1[i].total);
        }
      
        for (var i in crgmtos1) {
          nombcrgto1.push(crgmtos1[i].corregimiento);
          firmcrgto1.push(crgmtos1[i].total);
        }
        
        var info = [valida1, totplan1, nombcom1, firmcom1, nombcrgto1, firmcrgto1, genero1];
        io.emit("server:updateDatos", info);
      };
      emitInfo();
    });

    socket.on("client:noValidas", async (anula) => {
      console.log("Actualizando... ");
      const anuladas = await pool.query('SELECT * FROM vtotnulas');
      const nulas = anuladas[0].total+1;
      
      io.emit("server:anuladas", nulas);
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });
  });
}


