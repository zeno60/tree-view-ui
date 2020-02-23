import axios from 'axios';
import { TreeResponse } from './responses';
import { TreeRequest } from './requests';

export async function addTree(request: TreeRequest): Promise<TreeResponse> {
    let tree: TreeResponse;
    try {
        const response = await axios.post<TreeResponse>(`${process.env.REACT_APP_API_URL}/tree`, request);
        tree = response.data;
    } catch (error) {
        if (error.response.status === 404) {
            throw new Error(error.response.data);
        } else {
            throw new Error('Unable to add tree');
        }
    }
    return tree;
}