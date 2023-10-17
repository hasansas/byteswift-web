const ReadFile = {

  parseCsv(csv) {
    const splitRow = new RegExp("[\n]", "g");
    const splitCol = new RegExp("[,;\n]", "g");
    const lineBreak = new RegExp(/(\r\n|\n|\r)/gm);

    var rows = csv.split(splitRow);
    var parseCsv = [];
    var parseHeader = rows[0].replace(lineBreak, "").split(splitCol);

    parseHeader = parseHeader.map(function (v) {
      return v.toLowerCase();
    });

    rows.map(function (line, indexRow) {
      if (indexRow < 1) return;

      var row = line.replace(lineBreak, "");
      var currentline = row.split(splitCol);
      var obj = {};

      parseHeader.map(function (header, indexHeader) {
        obj[header] = currentline[indexHeader];
      });
      parseCsv.push(obj);
    });

    parseCsv.pop();

    const response = {
      parse_header: parseHeader,
      parse_csv: parseCsv,
    };

    return response;
  },
  csvToJSON(csv) {
    const self = this;
    return new Promise(async function (resolve) {
      const parseCsv = {
        parse_header: [],
        parse_csv: [],
        loadCsv: {
          success: false,
          message: "Can not load file !",
        },
      };

      if (window.FileReader) {
        const reader = new FileReader();
        reader.readAsText(csv);

        reader.onload = async function (event) {
          const data = event.target.result;
          const csvJson = await self.parseCsv(data);

          parseCsv.parse_header = csvJson.parse_header;
          parseCsv.parse_csv = csvJson.parse_csv;
          parseCsv.loadCsv.success = true;
          parseCsv.loadCsv.message = "CSV loaded successfully!";
          return resolve(parseCsv);
        };

        reader.onerror = function (evt) {
          if (evt.target.error.name == "NotReadableError") {
            parseCsv.loadCsv.message = "Can not read file !";
            return resolve(parseCsv);
          }
        };
      } else {
        parseCsv.loadCsv.message =
          "FileReader are not supported in this browser.";
        return resolve(parseCsv);
      }
    });
  },
}

export default ReadFile;
