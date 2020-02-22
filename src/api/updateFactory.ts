import axios from 'axios';
import { FactoryResponse } from './responses';
import { FactoryRequest } from './requests';

export async function updateFactory(factoryId: number, request: FactoryRequest): Promise<FactoryResponse> {
    let factory: FactoryResponse;
    try {
        const response = await axios.put<FactoryResponse>(`${process.env.REACT_APP_BACKEND_URL}/factory/${factoryId}`, request);
        factory = response.data;
    } catch (error) {
        if (error.response.status === 404) {
            throw new Error(error.response.data);
        } else {
            throw new Error('Unable to update factory');
        }
    }
    return factory;
}