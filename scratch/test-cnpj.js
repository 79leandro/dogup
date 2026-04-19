const fs = require('fs');

const { validateCNPJ, calculaDV } = require('./src/lib/utils/cnpj.js') || {};

// As the file is TS, let's compile it or just test the logic directly in node.
