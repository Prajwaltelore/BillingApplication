const bodyParser = require('body-parser');
const express = require('express');
const multer = require('multer');
const mysql = require('mysql');
const cors = require('cors');
const fs = require('fs')
const app = express();
const path = require('path');
const Port = 4000;
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'))
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})
const upload = multer({
    storage
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'quotation'
})

app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ', err);
        return;
    }
    console.log('Connected to MySQL database');
});

app.post('/api/details', upload.array('image'), (request, response) => {
    const { customer_name, customer_address, kindAttention, quotationNo, quotationDate, enquiryRef, payment, delivery, taxes, transport, products } = request.body;

    console.log(request.body);
    // const files = request.files;
    console.log(request.files);
    // const files = request.files || [];
    let productsData;
    try {
        productsData = typeof products === 'string' ? JSON.parse(products) : products;
        if (!Array.isArray(productsData)) {
            throw new Error('Products data is not an array');
        }
    } catch (err) {
        console.error('Failed to parse products data:', err);
        return response.status(400).send('Invalid products data format');
    }

    console.log('Parsed products data', productsData);

    request.files.forEach((file, index) => {
        if (productsData[index]) {
            productsData[index].image = file.filename;
        }
    });

    const query = 'INSERT INTO details(customer_name,customer_address,kindAttention,quotationNo,quotationDate,enquiryRef,payment,delivery,taxes,transport,products) VALUES(?,?,?,?,?,?,?,?,?,?,?)';
    const values = [customer_name, customer_address, kindAttention, quotationNo, quotationDate, enquiryRef, payment, delivery, taxes, transport, JSON.stringify(productsData)];
    connection.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting record into database: ', err);
            return response.send('Failed to save record');
        }
        const quotationId = result.insertId;

        if (!quotationId) {
            console.error('Quotation ID is null');
            return response.status(500).send('Failed to retrieve quotation ID');
        }
        response.send({ message: "Data saved successfully", quotationId });
    });
});

app.put('/api/details/:id', upload.array('image'), (request, response) => {
    const { customer_name, customer_address, kindAttention, quotationNo, quotationDate, enquiryRef, payment, delivery, taxes, transport, products } = request.body;
    const { id } = request.params;
    console.log(request.body);
    console.log(request.files);
    let productsData;
    try {
        productsData = typeof products === 'string' ? JSON.parse(products) : products;
        if (!Array.isArray(productsData)) {
            throw new Error('Products data is not an array');
        }
    } catch (err) {
        console.error('Failed to parse products data:', err);
        return response.status(400).send('Invalid products data format');
    }
    console.log('Parsed products data', productsData);

    request.files.forEach((file, index) => {
        if (productsData[index]) {
            
            const oldImage = productsData[index].image;
            if (oldImage && file.filename !== oldImage) {
                const oldImagePath = path.join(__dirname, 'uploads', oldImage);
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error('Failed to delete old image:', err);
                });
            }
            productsData[index].image = file.filename;
        }
    });

    productsData.forEach((product, index) => {
        if (!request.files[index] && !product.image) {
            product.image = null;
        }
    });

    console.log('Updated products data',productsData);
    const query = `UPDATE details SET customer_name = ?,customer_address = ?,kindAttention = ?,quotationNo = ?,quotationDate = ?,enquiryRef = ?,payment = ?,delivery =?,taxes = ?,transport = ?,products =? WHERE id = ?`
    connection.query(query, [customer_name, customer_address, kindAttention, quotationNo, quotationDate, enquiryRef, payment, delivery, taxes, transport, JSON.stringify(productsData), id], (err, result) => {
        if (err) {
            console.error('Error updating records into database: ', err);
            return response.send('Failed to save record');
        }
        response.send({ message: 'Record updated successfully' });
    });
});

app.get('/api/details', (request, response) => {
    const detailsQuery = `SELECT * FROM details`;

    connection.query(detailsQuery, (err, result) => {
        if (err) {
            console.error('Error fetching records from the database: ', err);
            return response.status(500).send('Failed to fetch records');
        }

        response.send(result);
});
});
app.get('/api/details/:id', (request, response) => {
    const {id} = request.params;
    const query = `SELECT * FROM details WHERE id = ?`;
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error fetching record from database: ', err);
            return response.send('Failed to fetch record');
        }

        // const recordWithImage = result.map(record => ({
        //     ...record,
        //     imageUrl : `http://localhost:4000/api/records/uploads/${record.filename}`
        // }));
        response.send(result);
    });
})
app.get('/api/details/filters/:column/:value', (request, response) => {
    const { column, value } = request.params; 
    console.log(request.params);
    // console.log(request.query);
  
    if (!column || !value) {
        return response.send('Invalid query parameters');
    }
    
    const query = `SELECT * FROM details WHERE ?? = ?`;

    connection.query(query, [column,value], (err, result) => {
        if (err) {
            console.error('Error fetching record from database: ', err);
            return response.send('Failed to fetch record');
        }

        // const recordWithImage = result.map(record => ({
        //     ...record,
        //     imageUrl : `http://localhost:4000/api/records/uploads/${record.filename}`
        // }));
        response.send(result);
    });
})
app.put('/api/terms/:id', (request,response) => {
   const {payment,delivery,taxes,transport} = request.body;
   console.log(request.body);
   const {id} = request.params;
   console.log(id);

   const query = `UPDATE details SET payment = ?,delivery =?,taxes = ?,transport = ? WHERE id = ?`;
   connection.query(query, [payment, delivery, taxes, transport, id], (err, result) => {
    if (err) {
        console.error('Error updating records into database: ', err);
        return response.send('Failed to save record');
    }
    response.send({ message: 'Record updated successfully' });
});
});
// app.get('/api/details/:id', (request, response) => {
//     const { id } = request.params;
//     const query = 'SELECT * FROM details WHERE id = ?';

//     connection.query(query, [id], (err, result) => {
//         if (err) {
//             console.error('Error fetching record from database: ', err);
//             return response.send('Failed to fetch record');
//         }

//         // const recordWithImage = result.map(record => ({
//         //     ...record,
//         //     imageUrl : `http://localhost:4000/api/records/uploads/${record.filename}`
//         // }));
//         response.send(result);
//     });
// })
app.delete('/api/details/:id', (req, res) => {
    const { id } = req.params;

    const selectQuery = "SELECT products FROM details WHERE id = ?";
    connection.query(selectQuery, [id], (err, result) => {
        if (err) {
            console.error('Error fetching record from database: ', err);
            return res.status(500).send('Failed to fetch record for deletion');
        }

        if (result.length === 0) {
            return res.status(404).send('Record not found');
        }

        const productsData = JSON.parse(result[0].products);

        productsData.forEach((product) => {
            if (product.image) {
                const imagePath = path.join(__dirname, 'uploads', product.image);
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error('Failed to delete image:', err);
                    } else {
                        console.log('Image deleted:', imagePath);
                    }
                });
            }
        });
        const deleteQuery = `DELETE FROM details WHERE id = ?`;
        connection.query(deleteQuery, [id], (err, result) => {
            if (err) return res.status(500).send(err);
            res.json({ id });
        });
    });
})
app.listen(Port, () => {
    console.log('Server is running at port ' + Port);
})