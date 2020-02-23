import axios from 'axios';

export async function deleteFactory(factoryId: number): Promise<void> {
    try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/factory/${factoryId}`);
    } catch (error) {
        throw new Error('Unable to delete factory');
    }
}