$(document).ready(function () {
  $('#table-planillas').DataTable({
    language: {
      "lengthMenu": "Mostrar _MENU_ registros",
      "zeroRecords": "No se encontraron resultados",
      "info": "Registros del _START_ al _END_ de  _TOTAL_",
      "infoEmpty": "Encontrados 0 ",
      "infoFiltered": "(de _MAX_ registros)",
      "sSearch": "Buscar:",
      "oPaginate": {
        "sFirst": "Primero",
        "sLast": "Último",
        "sNext": "Sig",
        "sPrevious": "Ant"
      },
      "sProcessing": "Procesando...",
    },
    //para usar los botones   
    responsive: "true",
    dom: 'Bfrtilp',
    buttons: [
      {
        extend: 'excelHtml5',
        text: '<i class="fas fa-file-excel"></i> ',
        titleAttr: 'Exportar a Excel',
        className: 'btn btn-success'
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="fas fa-file-pdf"></i> ',
        titleAttr: 'Exportar a PDF',
        className: 'btn btn-danger',
        title: 'Planillas',
        exportOptions: {
          columns: [0, 1, 2, 3, 4]
        }
      },
      {
        extend: 'print',
        text: '<i class="fa fa-print"></i> ',
        titleAttr: 'Imprimir',
        className: 'btn btn-info',
        title: 'Planillas',
        exportOptions: {
          columns: [0, 1, 2, 3, 4]
        }
      },
    ]
  });
});


$(document).ready(function () {
  $('#table-puestos').DataTable({
    language: {
      "lengthMenu": "Mostrar _MENU_ registros",
      "zeroRecords": "No se encontraron resultados",
      "info": "Registros del _START_ al _END_ de  _TOTAL_",
      "infoEmpty": "Encontrados 0 ",
      "infoFiltered": "(de _MAX_ registros)",
      "sSearch": "Buscar:",
      "oPaginate": {
        "sFirst": "Primero",
        "sLast": "Último",
        "sNext": "Sig",
        "sPrevious": "Ant"
      },
      "sProcessing": "Procesando...",
    },
    //para usar los botones   
    responsive: "true",
    order: [
      [1, "asc"]
    ],
    dom: 'Bfrtilp',
    buttons: [
      {
        extend: 'excelHtml5',
        text: '<i class="fas fa-file-excel"></i> ',
        titleAttr: 'Exportar a Excel',
        className: 'btn btn-success'
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="fas fa-file-pdf"></i> ',
        titleAttr: 'Exportar a PDF',
        className: 'btn btn-danger',
        title: 'Puestos de Votación',
        exportOptions: {
          columns: [0, 1, 2, 3, 4]
        }
      },
      {
        extend: 'print',
        text: '<i class="fa fa-print"></i> ',
        titleAttr: 'Imprimir',
        className: 'btn btn-info',
        title: 'Puestos de Votación',
        exportOptions: {
          columns: [0, 1, 2, 3, 4]
        }
      },
    ]
  });
});

$(document).ready(function () {
  $('#table-causas').DataTable({
    language: {
      "lengthMenu": "Mostrar _MENU_ registros",
      "zeroRecords": "No se encontraron resultados",
      "info": "Registros del _START_ al _END_ de  _TOTAL_",
      "infoEmpty": "Encontrados 0 ",
      "infoFiltered": "(de _MAX_ registros)",
      "sSearch": "Buscar:",
      "oPaginate": {
        "sFirst": "Primero",
        "sLast": "Último",
        "sNext": "Sig",
        "sPrevious": "Ant"
      },
      "sProcessing": "Procesando...",
    },
    //para usar los botones   
    responsive: "true",
    dom: 'Bfrtilp',
    buttons: [
      {
        extend: 'excelHtml5',
        text: '<i class="fas fa-file-excel"></i> ',
        titleAttr: 'Exportar a Excel',
        className: 'btn btn-success'
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="fas fa-file-pdf"></i> ',
        titleAttr: 'Exportar a PDF',
        className: 'btn btn-danger',
        title: 'Causas',
        exportOptions: {
          columns: [0, 1]
        }
      },
      {
        extend: 'print',
        text: '<i class="fa fa-print"></i> ',
        titleAttr: 'Imprimir',
        className: 'btn btn-info',
        title: 'Causas',
        exportOptions: {
          columns: [0, 1]
        }
      },
    ]
  });
});

$(document).ready(function () {
  $('#table-produccion').DataTable({
    language: {
      "lengthMenu": "Mostrar _MENU_ registros",
      "zeroRecords": "No se encontraron resultados",
      "info": "Registros del _START_ al _END_ de  _TOTAL_",
      "infoEmpty": "Encontrados 0 ",
      "infoFiltered": "(de _MAX_ registros)",
      "sSearch": "Buscar:",
      "oPaginate": {
        "sFirst": "Primero",
        "sLast": "Último",
        "sNext": "Sig",
        "sPrevious": "Ant"
      },
      "sProcessing": "Procesando...",
    },
    //para usar los botones   
    responsive: "true",
    order: [
      [2, "desc"]
    ],
    dom: 'Bfrtilp',
    buttons: [
      {
        extend: 'excelHtml5',
        text: '<i class="fas fa-file-excel"></i> ',
        titleAttr: 'Exportar a Excel',
        className: 'btn btn-success'
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="fas fa-file-pdf"></i> ',
        titleAttr: 'Exportar a PDF',
        className: 'btn btn-danger',
        title: 'Estadisticas de Producción',
        exportOptions: {
          columns: [0, 1, 2]
        }
      },
      {
        extend: 'print',
        text: '<i class="fa fa-print"></i> ',
        titleAttr: 'Imprimir',
        className: 'btn btn-info',
        title: 'Estadisticas de Producción',
        exportOptions: {
          columns: [0, 1, 2]
        }
      },
    ]
  });
});
