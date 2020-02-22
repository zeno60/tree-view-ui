export interface FactoryRequest {
    name: string;
    min: number;
    max: number;
    number: number;
}

export interface TreeRequest {
    name: string;
    factories: FactoryRequest[];
}