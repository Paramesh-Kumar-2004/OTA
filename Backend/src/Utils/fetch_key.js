import axios from 'axios';

export const fetch_key = async () => {
    try {
        const response = await axios.get('http://localhost:4000/keys');
        console.log("Our Public Key Is :",response.data.publickey);
        return response.data.publickey;
    } catch (error) {
        console.error('Error fetching public key from Raspberry Pi:', error);
    }
};

// fetch_key()
 