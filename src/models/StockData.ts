export interface ApparelStockInfo {
    quantity: number;
    price: number;
}

export interface StockInfo {
    [code: string]: {
        [size: string]: ApparelStockInfo;
    };
}
