// import { plainAddPlaceholder } from "node-signpdf/dist/helpers";
// import fs from "node:fs";
// import signer from "node-signpdf";

const {plainAddPlaceholder} = require('node-signpdf/dist/helpers')
const fs = require('node:fs')
const signer = require('node-signpdf')
var _nodeSignpdf = _interopRequireDefault(require("node-signpdf"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const p12Buffer = fs.readFileSync(
    './test_assets/test9.p12',
);

const secondP12Buffer = fs.readFileSync(
    './test_assets/test10.p12',
);


let pdfBuffer = fs.readFileSync('./test_assets/alvaro.pdf');

pdfBuffer = plainAddPlaceholder({
    pdfBuffer, 
    reason: 'first',
    signatureLength: p12Buffer.length
});

pdfBuffer = _nodeSignpdf.default.sign(pdfBuffer, p12Buffer);
fs.writeFileSync('./creados/firmado1.pdf', pdfBuffer);



let signedPdfBuffer = fs.readFileSync('./creados/firmado1.pdf');
signedPdfBuffer = plainAddPlaceholder({ 
    pdfBuffer: signedPdfBuffer, 
    reason: 'second',
    signatureLength: secondP12Buffer.length
    
});


signedPdfBuffer = _nodeSignpdf.default.sign(signedPdfBuffer, secondP12Buffer, {passphrase: ''});
fs.writeFileSync('./creados/firmado3.pdf', signedPdfBuffer);