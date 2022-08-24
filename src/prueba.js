// import { plainAddPlaceholder } from "node-signpdf/dist/helpers";
// import fs from "node:fs";
// import signer from "node-signpdf";

const {plainAddPlaceholder} = require('node-signpdf/dist/helpers')
const fs = require('node:fs')
const signer = require('node-signpdf')
var _nodeSignpdf = _interopRequireDefault(require("node-signpdf"));
const moment = require('moment')
const qrcode = require('qrcode')
const fetch = require('node-fetch')
var forge = require('node-forge');
// import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib')

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _PDFArrayCustom = _interopRequireDefault(require("./PDFArrayCustom.js"));



class Firma {

    static base64ToArrayBuffer(base64) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    static unit8ToBuffer(unit8) {
        let buf = Buffer.alloc(unit8.byteLength);
        const view = new Uint8Array(unit8);
    
        for (let i = 0; i < buf.length; ++i) {
          buf[i] = view[i];
        }
        return buf;
      }
    

     static createP12 (){

        
            // generate a keypair
            console.log('Generating 1024-bit key-pair...');
            var keys = forge.pki.rsa.generateKeyPair(1024);
            console.log('Key-pair created.');
          
            // create a certificate
            console.log('Creating self-signed certificate...');
            var cert = forge.pki.createCertificate();
            cert.publicKey = keys.publicKey;
            cert.serialNumber = '01';
            cert.validity.notBefore = new Date();
            cert.validity.notBefore.setFullYear(cert.validity.notBefore.getFullYear() -1);
            cert.validity.notAfter = new Date();
            
            cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 10);
            var attrs = [{
              name: 'commonName',
              value: 'roco'
            }, {
              name: 'countryName',
              value: 'US'
            }, {
              shortName: 'ST',
              value: 'Virginia'
            }, {
              name: 'localityName',
              value: 'Blacksburg'
            }, {
              name: 'organizationName',
              value: 'Firma Digital Websal'
            }, {
              shortName: 'OU',
              value: 'Firma Digital Websal'
            }];
            cert.setSubject(attrs);
            cert.setIssuer(attrs);
        
            cert.setExtensions([{
              name: 'basicConstraints',
              cA: true
            }, {
              name: 'keyUsage',
              keyCertSign: true,
              digitalSignature: true,
              nonRepudiation: true,
              keyEncipherment: true,
              dataEncipherment: true
            }, {
              name: 'subjectAltName',
              altNames: [{
                type: 6, // URI
                value: 'https://www.websal.com'
              }]
            }]);
          
            // self-sign certificate
            cert.sign(keys.privateKey);
            console.log('Certificate created.');
          
            // create PKCS12
            console.log('\nCreating PKCS#12...');
            var password = '';
            var newPkcs12Asn1 = forge.pkcs12.toPkcs12Asn1(
              keys.privateKey, [cert], password,
              {generateLocalKeyId: true, friendlyName: 'Websal'});
        
            var newPkcs12Der = forge.asn1.toDer(newPkcs12Asn1).getBytes();
            
           
        
            // console.log('ESTE',newPkcs12Der)
        
            var buffer = new Buffer(newPkcs12Der, 'binary');
              fs.writeFileSync('277841.p12', buffer);
        
        
        
            console.log('\nBase64-encoded new PKCS#12:');
            console.log(forge.util.encode64(newPkcs12Der));
          
            // create CA store (w/own certificate in this example)
            var caStore = forge.pki.createCaStore([cert]);
          
            console.log('\nLoading new PKCS#12 to confirm...');
             
            return buffer

    }

    static async firmar (pdfBytes){

      let p12Buffer = Firma.createP12()

      // let link = 'primera.pdf'

      // const existingPdfBytes = await fetch(`https://websalsign.s3.amazonaws.com/${link}`).then(res => res.arrayBuffer())

    // const existingPdfBytes = await fetch(`https://websalsign.s3.amazonaws.com/${link}`).then(res => res.arrayBuffer())
      

       let buff = Firma.unit8ToBuffer(pdfBytes)

       console.log('buffAmazon',buff)
    //    console.log('buffFirm',buffFirm)


    //    const buffer = Buffer.from(pdf, 'base64');

    //    console.log('MIBUFF', buffer)
// 
    //    console.log('buff',buff)

        
        let signedPdfBuffer = buff;
        signedPdfBuffer = plainAddPlaceholder({ 
            pdfBuffer: signedPdfBuffer, 
            reason: 'Firma Digital Websal',
            name:'Alvaro Leiva',
            location:'Santiago Chile', // poner la ip aca
            signatureLength: p12Buffer.length
            
        });
        
        
        signedPdfBuffer = _nodeSignpdf.default.sign(signedPdfBuffer, p12Buffer, {passphrase: ''});

  

        fs.writeFileSync('./creados/firmado19.pdf', signedPdfBuffer);
        
        // Firma.firmaFisica(signedPdfBuffer)


    }


     async firmaFisica(){

        let firmas = 1
    let link = 'liquidacion.pdf'
    let id = 3
    let rut = '196056920'
    let tipo = 'Liquidacion'
    let nombre = 'Alvaro Leiva'
    let so = 'pc'
    let ip = '2939103'
    let flujo = 'simultaneo'
    let nuevoFlujo = 'stopMail'
    let maxFirmas= 1
    let email = 'aleiva97@gmail.com'
    let empid = '77777777-7'
    let portal = '8208'
    let codper = '277841'

    // ------------------------------------PROCESO FIRMA EN PDF QR Y TEXTO--------------------------------------------------------------------------------------

    let qrPosition = {
    x:50 + firmas * 130 ,
    y:65 ,
    }

    let textoPosition = {
    x: 25 + firmas * 130,
    y: 60,
    }


    let logoPosition = { 
    x:50 + firmas * 130,
    y:10,
    }




    global.btoa = str => Buffer.from(str).toString('base64');
    global.atob = str => Buffer.from(str, 'base64').toString();

    const existingPdfBytes = await fetch(`https://websalsign.s3.amazonaws.com/${link}`).then(res => res.arrayBuffer())

    const fecha = moment().format('LLL');

    const logo = 'https://res.cloudinary.com/asdsa/image/upload/v1655758288/logo_tqkfqy.png'

    const firstDonorPdfBytes = await fetch(logo).then(res => res.arrayBuffer())

    const url = `http://localhost:3000/#/verpdf/${id}`
    const qr = await qrcode.toDataURL(url)

    // console.log(qr)
    // const veamos =  SignPDF.unit8ToBuffer(existingPdfBytes)
    //     const {signature, signedData} = extractSignature(veamos, 1);
    //     console.log('signature',signature)
    //     console.log('signedData',signedData)

    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    let img = await pdfDoc.embedPng(qr)
    let logoDecoded = await pdfDoc.embedPng(firstDonorPdfBytes)
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)



    const pages = pdfDoc.getPages()
    const lastPage = pages[pages.length-1]


    img.scale(0.5)
    logoDecoded.scale(0.5)

    lastPage.drawImage(img, {
    x: qrPosition.x ,
    y:  qrPosition.y,
    width:60,
    height:60
    })

    // IP: ${ip.address()} 

    lastPage.drawText(`Firmado Digitalmente por ${nombre} el ${fecha} IP: ${ip} ` , {
    x: textoPosition.x,
    y: textoPosition.y,
    size: 8,
    font: helveticaFont,
    color: rgb(0, 0, 0),
    maxWidth:120,
    lineHeight:11

    })
    lastPage.drawImage(logoDecoded, {
    x:logoPosition.x,
    y:logoPosition.y,
    width:55,
    height:10
    })


    // ------------------------------------------------------------------------------------------


    // const signedPdf =signer.sign(
    //     pdfDoc,
    //     fs.readFileSync('test7.p12'),
    //   );


    const pdfBytes = await pdfDoc.save({
        useObjectStreams: false
      });


    Firma.firmar(pdfBytes)




    }

}

const conector = new Firma()

conector.firmaFisica()