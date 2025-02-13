import fs from 'fs';

export const readData = (filePath: string): any => {
    try {
        const rawData = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(rawData || '{}');
    } catch (error) {
        console.error('Error reading data:', error);
        return {};
    }
};

export const writeData = (filePath: string, data: any): void => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing data:', error);
        throw error;
    }
};
