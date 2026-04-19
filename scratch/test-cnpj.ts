import { validateCNPJ, formatCNPJInput, charParaValor } from '../src/lib/utils/cnpj';

const validCNPJs = [
    '12.345.678/0001-90',
    '33.683.111/0002-80',
    // Alphanumeric examples:
    '12ABC34501DE35',
    'ABCDEFGHIJKL80',
];

for (const c of validCNPJs) {
    console.log(`CNPJ: ${c} | Valid? ${validateCNPJ(c)}`);
}
