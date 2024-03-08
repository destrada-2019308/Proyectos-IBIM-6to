'use strict'

import Bill from './bill.model.js'
import Cart from '../shoppingCar/shoppingCar.model.js'
import User from '../user/user.model.js'
import Product from '../products/product.model.js'
import { generateJwt } from '../utils/jwt.js'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import PDFDocument from 'pdfkit'

export const test = (req, res) =>{
    return res.send({message: 'Test is running'})
}

//hacer el proceso de completarCompra
export const completarCompra = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        }

        const secretKey = process.env.SECRET_KEY;
        const token = req.headers.authorization;

        const decodedToken = jwt.verify(token, secretKey);
        const tokenUserId = decodedToken.uid;

        if (tokenUserId !== user._id.toString()) {
            return res.status(401).send({ message: "No estás autorizado para realizar esta acción." });
        }

        const userId = user._id;
        const carts = await Cart.find({ user: userId, status: 'CREATED' });
        //console.log(carts);
        const bills = [];
        let totalAPagar = 0;
        for (const cart of carts) {
            const product = await Product.findById(cart.product);
            if (!product) {
                return res.status(404).send({message: `Producto not found`})
            }
            //console.log(product);
            const totalProducto = cart.amount * product.price;
            //console.log(totalProducto);
            const bill = new Bill({
                date: new Date(),
                cart: cart._id,
                total: totalProducto 
            });
            await bill.save();
            // Restamos la cantidad del producto del stock
            product.stock -= cart.amount;
            await product.save();
            cart.status = 'COMPLETED';
            await cart.save();
            bills.push(bill);
            // Sumamos el total del producto al total a pagar
            totalAPagar += totalProducto; 
        }

        const pdfFolder = './invoices'
        if(!fs.existsSync(pdfFolder)){
            fs.mkdirSync(pdfFolder)
        }
        // Generación del PDF
        const pdfPath = path.resolve(pdfFolder, `invoice_${Date.now()}.pdf`);
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(pdfPath));

        doc.fontSize(25).text('Facturas', { align: 'center' }).moveDown();
        
        for (const bill of bills) {
            const cart = await Cart.findById(bill.cart).populate('product');
            const total = bill.total;

            doc.fontSize(16).text(`Fecha: ${bill.date.toLocaleDateString()}`).moveDown();
            doc.fontSize(16).text(`ID del carrito: ${cart._id}`).moveDown();
            doc.fontSize(16).text('Productos:');
            const product = await Product.findById(cart.product);
            doc.fontSize(14).text(`- ${product.name} (Cantidad: ${cart.amount}, Precio unitario: ${product.price})`);
            doc.fontSize(16).text(`Total del producto: ${total}`).moveDown(); // Mostramos el total del producto

            doc.moveDown();
            doc.addPage();
        }

        // Mostramos el total a pagar en el documento
        doc.fontSize(16).text(`Total a pagar: ${totalAPagar}`).moveDown();

        doc.end();

        return res.send(pdfPath)
    } catch (error) {
        return res.status(500).send({ message: `Error completed purchase: ${error.message} `});
    }
}