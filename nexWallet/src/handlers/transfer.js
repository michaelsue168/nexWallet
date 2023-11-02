import { User_info } from "../main";
import APIServer from "../services/APIServer";

export const onsendXRP = async (TransferMETAData) => {
    try {
        const response = await APIServer.post('/transfer/send', { TransferMETAData });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export const onChange = async (changeMetadata) => {
    try {
        const response = await APIServer.post('/transfer/change', { changeMetadata });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}



