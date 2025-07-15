import { encryptAES, decryptAES } from "./CryptoUtils"
const API_URL = import.meta.env.VITE_API_URL;

export async function fetchGatewayKey() {
  const res = await fetch(`${API_URL}/gateway/key`);
  if (!res.ok) throw new Error('Failed to fetch gateway key');
  return res.json();
}

export const getApiKey = async () => {

    // const token = sessionStorage.getItem('token');
    // const username = sessionStorage.getItem('username');
  
    const response = await fetch(`${API_URL}/payment/api/v1/get-key`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`,
        // 'userName': username,
        'sKeyId': sessionStorage.getItem('KEY_ID')
      },
    //   body: JSON.stringify({ encryptedPayload: encryptedData }),
    });
  
    const resposeJson = await response.json()
    // Wait for the text response
    const encryptedResponse = resposeJson.sResponse;
  
    // Decrypt the response
    const decryptedResponse = decryptAES(encryptedResponse);
    // Parse into BaseResponse format
    // const parsedResponse = JSON.parse(decryptedResponse);
    return decryptedResponse;
  };

  export const createOrder = async (name, email, amount, currency) => {

    const mappedDetails = {
        sName: name,
        sEmail: email,
        iAmount: amount,
        sCurrency: currency
      };
      const encryptedData = encryptAES(JSON.stringify(mappedDetails));

    const response = await fetch(`${API_URL}/payment/api/v1/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'sKeyId': sessionStorage.getItem('KEY_ID')
      },
      body: JSON.stringify({ encryptedPayload: encryptedData }),
    });
  
    const resposeJson = await response.json()
    // Wait for the text response
    const encryptedResponse = resposeJson.sResponse;
  
    // Decrypt the response
    const decryptedResponse = decryptAES(encryptedResponse);
    // Parse into BaseResponse format
    const parsedResponse = JSON.parse(decryptedResponse);
    return parsedResponse;
  };