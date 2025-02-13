import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { readData, writeData } from './utils/Utils';
import { SwaggerOptions } from './swagger/SwaggerOptions';
import fs from 'fs';

const app = express();
app.use(express.json());

const swaggerDocs = swaggerJsdoc(SwaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize empty JSON file if it doesn't exist
const apparelDataFilePath = path.join(dataDir, 'apparelData.json');
if (!fs.existsSync(apparelDataFilePath)) {
    fs.writeFileSync(apparelDataFilePath, '{}', 'utf8');
}
const port = 9000;

// As a vendor, using this API, User can update the Stock of single apparel
app.post('/vendor/update-stock', (req: Request, res: Response) => {
    const { apparelCode, size, quantity, price } = req.body;
    const data = readData(apparelDataFilePath);

    data[apparelCode] = data[apparelCode] || {}; // Create if it doesn't exist
    data[apparelCode][size] = { quantity, price };
    writeData(apparelDataFilePath, data);

    res.json({ message: 'Stock updated successfully' });
});


// As a vendor, using this API, User can update the Stock of multiple apparels i.e bulk update
app.post('/vendor/bulk-update-stock', (req: Request, res: Response) => {
    const updates: { apparelCode: string; size: string; quantity: number; price: number }[] = req.body;
    const data = readData(apparelDataFilePath);

    updates.forEach(update => {
        const { apparelCode, size, quantity, price } = update;
        data[apparelCode] = data[apparelCode] || {};
        data[apparelCode][size] = { quantity, price };
    });

    writeData(apparelDataFilePath, data)
    res.json({ message: 'Bulk stock updated successfully' });
});
// Using this API, user can validate the order can be fulfilled or not
app.post('/user/validate-order', (req: Request, res: Response) => {
    const order: { apparelCode: string; size: string; quantity: number }[] = req.body;
    const data = readData(apparelDataFilePath);

    const canFulfill = order.every(item => {
        const { apparelCode, size, quantity } = item;
        const itemData = data[apparelCode] && data[apparelCode][size];
        return itemData && itemData.quantity >= quantity;
    });

    res.json({ canFulfill });
});

// Api to check that minimum order is getting fullfilled or not
app.post('/user/minimum-amount', (req: Request, res: Response) => {
    const order: { apparelCode: string; size: string; quantity: number }[] = req.body;
    const data = readData(apparelDataFilePath);

    let totalCost = 0;
    let canFulfill = true;

    for (const item of order) {
        const { apparelCode, size, quantity } = item;
        const itemData = data[apparelCode] && data[apparelCode][size];

        if (itemData && itemData.quantity >= quantity) {
            totalCost += itemData.price * quantity;
        } else {
            canFulfill = false;
            break;  
        }
    }

    res.json({ canFulfill, totalCost });
});


app.listen(port, () => {
    console.log(`Apparel Backend Server is running on port ${port}`);
});