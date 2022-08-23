import SignPDF from "./SignPDF.js";
import fs from "node:fs";
import path from "node:path";

async function main() {
  const pdfBuffer = new SignPDF(
    path.resolve('./test_assets/firmado1.pdf'),
    path.resolve('./test_assets/test11.p12')
  );

  const signedDocs = await pdfBuffer.signPDF();
  const randomNumber = Math.floor(Math.random() * 5000);
  const pdfName = `./exports/exported_file_${randomNumber}.pdf`;

  fs.writeFileSync(pdfName, signedDocs);
  console.log(`New Signed PDF created called: ${pdfName}`);
}

main();
