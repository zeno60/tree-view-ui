import axios from 'axios';
import { FactoryResponse } from './responses';
import { FactoryRequest } from './requests';

export async function addFactory(treeId: number, request: FactoryRequest): Promise<FactoryResponse> {
    let factory: FactoryResponse;
    try {
        const response = await axios.post<FactoryResponse>(`${process.env.REACT_APP_API_URL}/tree/${treeId}/factory`, request);
        factory = response.data;
    } catch (error) {
        if (error.response.status === 404) {
            throw new Error(error.response.data);
        } else {
            throw new Error('Unable to add factory');
        }
    }
    return factory;
}