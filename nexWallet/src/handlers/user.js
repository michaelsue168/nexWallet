import { User_info } from "../main";
import APIServer from "../services/APIServer";
import { ref } from "vue";

export const formData = ref({
    nickname: '',
    email: '',
    country: '',
    currency: '',
    server: 'Testnet',
    address: '',
    publicKey: '',
    xRPbalance:'',
    encryptedData: '',
    type:''
});
export const originalObject = ref({
    password: '',
    privateKey: '',
    seed: ''
});

export const formData2 = ref({
    address: '',
    publicKey: '',
    xRPbalance:'',
    encryptedData: '',
});
export const originalObject2 = ref({
    privateKey: '',
    seed: ''
});
// =====================================virtualAccount=======================================================
export const virtualAccount = ref({
    bankName: 'Main',
    bankCode: '9999',
    currency: '',
    address: '',
    type:''
});

export const sign_up = async (authMetadata,bankMetadata,fakexrpdata) => {
    try {
        const response = await APIServer.post('/user/signup', { authMetadata,bankMetadata,fakexrpdata });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export const login = async (pbk,pwd) => {
    try {
        const response = await APIServer.post('/user/login', { pbk,pwd });
        return response.data; 
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export const logout = async () => {
    try {
        await APIServer.get('/user/logout');
    } catch (error) {
        console.error('Error:', error);
        return null; 
    }
}



