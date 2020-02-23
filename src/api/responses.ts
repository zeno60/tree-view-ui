export interface FactoryResponse {
    id: number;
    name: string;
    min: number;
    max: number;
    values: number[];
}

export interface TreeResponse {
    id: number;
    name: string;
    factories: FactoryResponse[];
}

export interface FactoryResponse {
    treeId: number;
    factory: FactoryResponse;
}

export interface DeleteFactoryResponse {
    treeId: number;
    factoryId: number;
}