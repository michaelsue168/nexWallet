import { User_info } from "../main";
import APIServer from "../services/APIServer";


export const add = async (bankMetadata,fakexrpdata) => {
    try {
        const user = User_info.value.publicKey;
        const response = await APIServer.post('/bank/add', { user,bankMetadata,fakexrpdata });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export const get = async () => {
    try {
        const user = User_info.value.publicKey;
        const response = await APIServer.post('/bank/get', { user });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export const fixed = async (fixedMetadata) => {
    try {
        const response = await APIServer.post('/bank/fixed', { fixedMetadata });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
// Fixed
export const getF = async () => {
    try {
        const user = User_info.value.publicKey;
        const response = await APIServer.post('/bank/getfixed', { user });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// destination address
export const getTo = async (to) => {
    try {
        const response = await APIServer.post('/bank/getTo', { to });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}


export const getP = async () => {
    try {
        const user = User_info.value.publicKey;
        const response = await APIServer.post('/bank/pending', { user });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export const getL = async () => {
    try {
        const user = User_info.value.publicKey;
        const response = await APIServer.post('/bank/getlog', { user });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
