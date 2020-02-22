import axios from 'axios';
import { TreeResponse } from './responses';

export async function getAllTrees(): Promise<TreeResponse[]> {
    let trees: TreeResponse[] = [];
    try {
        const response = await axios.get<TreeResponse[]>(`${process.env.REACT_APP_BACKEND_URL}/tree`);
        trees = response.data;
    } catch (error) {
        if (error.response.status === 404) {
            throw new Error(error.response.data);
        } else {
            throw new Error('Unable to get trees');
        }
    }
    return trees;
}