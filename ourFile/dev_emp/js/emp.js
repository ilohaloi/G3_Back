export function getEmployee() { 
    return fetch('http://localhost:8081/TIA103G3/', {
        method: 'get',
        mode: 'cors'
    })
    .then(response => response.json())
    .catch(error => {
        console.error('获取数据时出错:', error);
        throw error; // 重新抛出错误以便在外部处理
    });
}
export async function getAesKey() { 
    try {
        const response =  await fetch("http://localhost:8081/TIA103G3_Hibernate/createtempaeskey", {
            method: "get",
            mode: 'cors'
        });        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const info = await response.json();
        sessionStorage.setItem('key', info.key);
    } catch (error) {
        console.log("Error: ", error);
    }
}

export function updateEmp(data) { 
    return fetch('http://localhost:8081/TIA103G3_Hibernate/decryptdata', {
        method: 'post',
        headers: {
                "Content-Type": "application/json"
        },
        body: JSON.stringify({ identity:"empReg",data:data,base64key:sessionStorage.getItem('key')})
    })
    .catch(error => {
        console.error('获取数据时出错:', error);
        throw error; // 重新抛出错误以便在外部处理
    });
}
export function Encryption(value, base64key) { 
    const keyWords = CryptoJS.enc.Base64.parse(base64key);
    const encrypted = CryptoJS.AES.encrypt(value, keyWords, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}