import {
  PDFDocument,
  PDFName,
  PDFNumber,
  PDFHexString,
  PDFString,
  rgb, StandardFonts, 
} from "pdf-lib";
import signer from "node-signpdf";
import fs from "node:fs";
import qrcode from "qrcode"
import moment from "moment";
import fetch from "node-fetch"
import path from "node:path";

import PDFArrayCustom from "./PDFArrayCustom1.js";
import { extractSignature } from "node-signpdf/dist/helpers/index.js";

export default class SignPDF {
  constructor(pdfFile, certFile) {
    this.pdfDoc = fs.readFileSync(pdfFile);
    this.certificate = fs.readFileSync(certFile);
  }

  /**
   * @return Promise<Buffer>
   */
  async signPDF() {
 
    let newPDF = await this.firmar()
    // let newPDF = this.pdfDoc

    // let newPDF = await this._addPlaceholder();
    //  newPDF = await this._addPlaceholder2();

    //  fs.writeFileSync('./creadosSignPdf/firmado4.pdf', newPDF);

    // newPDF = signer.sign(newPDF, this.certificate);
    //  newPDF = await this.firmar(newPDF)


     fs.writeFileSync('./creadosSignPdf/veamos.pdf', newPDF);
  
    // return newPDF;
  }

  /**
   * @see https://github.com/Hopding/pdf-lib/issues/112#issuecomment-569085380
   * @returns {Promise<Buffer>}
   */
  async _addPlaceholder() {
    const loadedPdf = await PDFDocument.load(this.pdfDoc);
    const ByteRange = PDFArrayCustom.withContext(loadedPdf.context);
    const DEFAULT_BYTE_RANGE_PLACEHOLDER = '**********';
    const SIGNATURE_LENGTH = 3322;
    const pages = loadedPdf.getPages();

    ByteRange.push(PDFNumber.of(pages.length-1));
    ByteRange.push(PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER));
    ByteRange.push(PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER));
    ByteRange.push(PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER));

    const signatureDict = loadedPdf.context.obj({
      Type: 'Sig',
      Filter: 'Adobe.PPKLite',
      SubFilter: 'adbe.pkcs7.detached',
      ByteRange,
      Contents: PDFHexString.of('A'.repeat(SIGNATURE_LENGTH)),
      // Reason: PDFString.of('We need your signature for reasons...'),
      M: PDFString.fromDate(new Date()),
    });

    const signatureDictRef = loadedPdf.context.register(signatureDict);

    const widgetDict = loadedPdf.context.obj({
      Type: 'Annot',
      Subtype: 'Widget',
      FT: 'Sig',
      // Rect: [275, 130, 152, 0], // Signature rect size
      Rect: [145, 130, 20, 0], // Signature rect size
      V: signatureDictRef,
      T: PDFString.of('Websal signature'),
      F: 4,
      P: pages[pages.length-1].ref,
    },
    );

    const widgetDictRef = loadedPdf.context.register(widgetDict);

    // Add signature widget to the first page
    pages[pages.length-1].node.set(PDFName.of('Annots'), loadedPdf.context.obj([widgetDictRef]));

    loadedPdf.catalog.set(
      PDFName.of('AcroForm'),
      loadedPdf.context.obj({
        SigFlags: 3,
        Fields: [widgetDictRef],
      })
    );

    // Allows signatures on newer PDFs
    // @see https://github.com/Hopding/pdf-lib/issues/541
    const pdfBytes = await loadedPdf.save({ useObjectStreams: false });


    
    return SignPDF.unit8ToBuffer(pdfBytes);

  }


  async _addPlaceholder2() {
    const loadedPdf = await PDFDocument.load(this.pdfDoc);
    const ByteRange = PDFArrayCustom.withContext(loadedPdf.context);
    const DEFAULT_BYTE_RANGE_PLACEHOLDER = '**********';
    const SIGNATURE_LENGTH = 3322;
    const pages = loadedPdf.getPages();

    ByteRange.push(PDFNumber.of(pages.length-1));
    ByteRange.push(PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER));
    ByteRange.push(PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER));
    ByteRange.push(PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER));

    const signatureDict = loadedPdf.context.obj({
      Type: 'Sig',
      Filter: 'Adobe.PPKLite',
      SubFilter: 'adbe.pkcs7.detached',
      ByteRange,
      Contents: PDFHexString.of('A'.repeat(SIGNATURE_LENGTH)),
      // Reason: PDFString.of('We need your signature for reasons...'),
      M: PDFString.fromDate(new Date()),
    });

    const signatureDictRef = loadedPdf.context.register(signatureDict);

    const widgetDict = loadedPdf.context.obj({
      Type: 'Annot',
      Subtype: 'Widget',
      FT: 'Sig',
      Rect: [275, 130, 152, 0], // Signature rect size
      // Rect: [145, 130, 20, 0], // Signature rect size
      V: signatureDictRef,
      T: PDFString.of('Websal signature'),
      F: 4,
      P: pages[pages.length-1].ref,
    },
    );

    const widgetDictRef = loadedPdf.context.register(widgetDict);

    // Add signature widget to the first page
    pages[pages.length-1].node.set(PDFName.of('Annots'), loadedPdf.context.obj([widgetDictRef]));

    loadedPdf.catalog.set(
      PDFName.of('AcroForm'),
      loadedPdf.context.obj({
        SigFlags: 3,
        Fields: [widgetDictRef],
      })
    );

    // Allows signatures on newer PDFs
    // @see https://github.com/Hopding/pdf-lib/issues/541
    const pdfBytes = await loadedPdf.save({ useObjectStreams: false });


    
    return SignPDF.unit8ToBuffer(pdfBytes);

  }


  async firmar (){

        
    let firmas = 0
    let link = 'to-amazon.pdf'
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

    // const pdfDataUri = await pdfDoc.saveAsBase64();

    // const fileContents = new Buffer(pdfDataUri, 'base64')
    // fs.writeFile('prueba.pdf', fileContents, (err) => {
    // if (err) return console.error(err)
    // console.log('file saved to ')
    // })
    
    const pdfBytes = await pdfDoc.save({ useObjectStreams: false });


    
    return SignPDF.unit8ToBuffer(pdfBytes);
    // return pdfDoc



}
  

  /**
   * @param {Uint8Array} unit8
   */
  static unit8ToBuffer(unit8) {
    let buf = Buffer.alloc(unit8.byteLength);
    const view = new Uint8Array(unit8);

    for (let i = 0; i < buf.length; ++i) {
      buf[i] = view[i];
    }
    return buf;
  }
}
