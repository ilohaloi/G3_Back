export function Encryption(value, base64key) { 
    const keyWords = CryptoJS.enc.Base64.parse(base64key);
    const encrypted = CryptoJS.AES.encrypt(value, keyWords, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}