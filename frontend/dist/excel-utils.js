// Excel utilities for import/export using xlsx, loaded at runtime
(function() {
  function loadXLSX(cb) {
    if (window.XLSX) return cb(window.XLSX);
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    script.onload = function() { cb(window.XLSX); };
    document.body.appendChild(script);
  }

  window.exportToExcel = function(data, filename = 'data-entries.xlsx') {
    loadXLSX(function(XLSX) {
      var ws = XLSX.utils.json_to_sheet(data);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      XLSX.writeFile(wb, filename);
    });
  };

  window.importFromExcel = function(file, cb) {
    loadXLSX(function(XLSX) {
      var reader = new FileReader();
      reader.onload = function(e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: 'array' });
        var sheetName = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[sheetName];
        var json = XLSX.utils.sheet_to_json(worksheet);
        cb(json);
      };
      reader.readAsArrayBuffer(file);
    });
  };
})(); 