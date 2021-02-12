const pdf = require("html-pdf");

const htmlStructure = ({ client, users, sale, body, salesCount }) => {
  const { name, address = "-", phone = "-", cuil } = client[0];
  const { firstName, lastName } = users[0];

  const { products, totalPrice, billType, isMarisa = true } = body;

  const totalIva = totalPrice * 0.21;

  const totalPriceIva = totalPrice;
  const totalIvaIncluded = totalPrice
    ? (totalPrice - totalPrice / 1.21).toFixed(2)
    : 0;

  let container = `
  <div style="border: 1px solid;
                 height: 65px;
                 width: 100px;
                 text-align: center;
                 position: relative;
                 top: 40px;
                 left: 60%;
                 border-radius: 3px;
                 box-shadow: blueviolet;
                 box-shadow: 1px 1px 1px 0px #888888;">
  <div style='
  max-width: 219px;
  font-size: 47px;
'>            <h3 style='    font-family: Arial, Helvetica, sans-serif;'>{0}</h3>
  </div> </div>`;
  const billTypeText =
    billType !== "3"
      ? container.replace(
          "{0}",
          billType === "1" ? "A" : billType === "2" ? "B" : ""
        )
      : "";
  let date = new Date();

  const logo = isMarisa
    ? "data:image/png;base64,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"
    : "";
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  return `
  <!DOCTYPE html>
  <html lang="en">
     <head>
        <meta charset="UTF-8" />
        <title>Factura</title>
        <style>
           /* @import url("fonts/BrixSansRegular.css");
           @import url("fonts/BrixSansBlack.css"); */
           * {
           margin: 0;
           padding: 0;
           box-sizing: border-box;
           font-family: Arial, Helvetica, sans-serif;
           }
           p,
           label,
           span,
           table {
           font-size: 9pt;
           }
           .h2 {
           font-size: 16pt;
           }
           .h3 {
           font-size: 12pt;
           display: block;
           background: #9092a6;
           color: #fff;
           text-align: center;
           padding: 3px;
           margin-bottom: 5px;
           }
           #page_pdf {
           width: 95%;
           margin: 15px auto 10px auto;
           }
           #factura_head,
           #factura_cliente,
           #factura_detalle {
           width: 100%;
           margin-bottom: 10px;
           }
           .logo_factura {
           width: 7%;
           }
           .info_empresa {
           width: 23%;
           text-align: center;
           }
           .info_factura {
           width: 25%;
           }
           .info_cliente {
           width: 100%;
           }
           .datos_cliente {
           width: 100%;
           }
           .datos_cliente tr td {
           width: 50%;
           }
           .datos_cliente {
           padding: 10px 10px 0 10px;
           }
           .datos_cliente label {
           width: 75px;
           display: inline-block;
           }
           .datos_cliente p {
           display: inline-block;
           }
           .textright {
           text-align: right;
           }
           .textleft {
           text-align: left;
           }
           .textcenter {
           text-align: center;
           }
           .round {
           border-radius: 10px;
           border: 1px solid #9092a6;
           overflow: hidden;
           padding-bottom: 15px;
           }
           .round p {
           padding: 0 15px;
           }
           #factura_detalle {
           border-collapse: collapse;
           }
           #factura_detalle thead th {
           background: #000;
           color: #fff;
           padding: 5px;
           }
           #detalle_productos tr:nth-child(even) {
           background: #ededed;
           }
           #detalle_totales {
           margin-top: 50px;
           }
           #detalle_totales span {
           }
           .nota {
           font-size: 8pt;
           }
           .label_gracias {
           font-family: verdana;
           font-weight: bold;
           font-style: italic;
           text-align: center;
           margin-top: 20px;
           }
           .anulada {
           position: absolute;
           left: 50%;
           top: 50%;
           transform: translateX(-50%) translateY(-50%);
           }
           #bus_info p {
           margin-bottom: 0.5rem;
           }
           #bill_info p {
           margin-bottom: 0.5rem;
           }
           #bill_info > p > strong {
           font-weight: 900;
           }
        </style>
     </head>
     <body>
        <div style="border: 1px solid; margin: 20px 18px 0;border-radius:3px">
           <div style="
              display: -webkit-flex;
              ">
              <div style="height: 150px;padding: 10px">
                 <img style="width: 150px";
                    src=${logo}   
                    />
              </div>
               ${billTypeText}
             
           </div>
           <div style="display: -webkit-flex; padding: 0px 0px 15px 15px;">
              <div id="bus_info" style="width: 50%;">
                 <p><strong style="font-weight: 900;">Domicilio:</strong> Cuyo 3532</p>
                 <p><strong style="font-weight: 900;">CP.:</strong> Cuyo 3532</p>
                 <p><strong style="font-weight: 900;">Tel.</strong> 2821-7200</p>
                 <p><strong style="font-weight: 900;">Domicilio</strong>: Cuyo 3532</p>
                 <p>Responsable Inscripto</p>
              </div>
              <div id="bill_info">
                 <h3 style="margin-bottom: 5px;">Factura</h3>
                 <p>
                 <h4>N°: ${salesCount}</h4>
                 </p>
                 <p><strong style="font-weight: 900;">Fecha:</strong> ${`${day}-0${month}-${year}`}</p>
                 <p><strong style="font-weight: 900;">Hora:</strong> ${
                   date.getHours() + ":" + date.getMinutes()
                 }</p>
                 <p><strong style="font-weight: 900;">Vendedor:</strong> ${
                   firstName + " " + lastName
                 }</p>
              </div>
           </div>
        </div>
        <div style="border: 1px solid; margin: 0px 18px -1px;border-radius:3px">
           <div style="
              display: -webkit-flex;
              ">
              <div style="display: -webkit-flex; padding: 15px 0px 15px 15px;width:100%">
                 <div id="bill_info" style="width:50%">
                    <p><strong style="font-weight: 900;">Cuil:</strong> ${cuil}</p>
                    <p><strong style="font-weight: 900;">Teléfono:</strong>${phone}</p>
                    <p><strong style="font-weight: 900;">Vendedor:</strong> Maximiliano orellana</p>
                 </div>
                 <div id="bill_info" style="width:50%">
                    <p><strong style="font-weight: 900;">Nombre:</strong> ${name}</p>
                    <p><strong style="font-weight: 900;">Dirección:</strong> ${address}</p>
                 </div>
              </div>
           </div>
        </div>
        <div style="margin: 19px;">
           <table id="factura_detalle">
              <thead>
                 <tr>
                    <th width="150px">Producto</th>
                    <th width="150px">Cantidad</th>
                    <th class="textright" width="150px">Precio Unitario.</th>
                    <th class="textright" width="150px">Precio Total</th>
                 </tr>
              </thead>
              <tbody id="detalle_productos">
                 ${products.map((product) => {
                   return ` 
                 <tr>
                    <td class="textcenter">
                       <div style="margin: 10px;font-size: 14px;">${
                         product.name
                       }</div>
                    </td>
                    <td class="textcenter">
                       <div style="margin: 10px;font-size: 14px;">${
                         product.quality
                       }</div>
                    </td>
                    <td class="textcenter">
                       <div style="margin: 10px;font-size: 14px;">${
                         product.price
                       }</div>
                    </td>
                    <td class="textcenter">
                       <div style="margin: 10px;font-size: 14px;">${
                         product.price * product.quality
                       }</div>
                    </td>
                 </tr>
                 `;
                 })}
              </tbody>
           </table>
        </div>
        <div style="margin: 19px;">
           <table id="factura_detalle">
              <tr>
                 <td colspan="3" class="textright">
                    <p><strong style="font-weight: 900;">Sub Total</strong></p>
                 </td>
                 <td class="textright">
                    <span style="font-size: 18px;">${totalPrice}</span>
                 </td>
              </tr>
              <tr>
                 <td colspan="3" class="textright"><strong style="font-weight: 900;"><span style="font-size: 14px;">
                    IVA</span></strong>
                 </td>
                 <td class="textright">
                    <span style="font-size: 18px;">${
                      billType === "1" ? totalIvaIncluded : "-"
                    }</span>
                 </td>
                 </td>
              </tr>
              <tr>
                 <td colspan="3" class="textright"><span style="font-size: 14px;">
                    Total</span>
                 </td>
                 <td class="textright">
                    <span style="font-size: 18px;">${totalPriceIva}</span>
                 </td>
              </tr>
           </table>
        </div>
     </body>
  </html>
    `;
};

const createPdf = async (body, client, users, _id, sale, res, salesCount) => {
  await pdf
    .create(htmlStructure({ client, users, sale, body, salesCount }), {})
    .toFile(`${__dirname}/tickets/sale${_id}.pdf`, (err) => {
      if (err) {
        return res.status(500).send({ message: "Error", error: error });
      }
      return res
        .status(200)
        .send({ success: true, message: "Venta Generada", data: sale });
    });
};

module.exports = createPdf;
