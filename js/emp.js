export function encryptionAes(value, base64key) { 
    const keyWords = CryptoJS.enc.Base64.parse(base64key);
    const encrypted = CryptoJS.AES.encrypt(value, keyWords, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

export function encryptionRsa(value) { 
    const base64key = sessionStorage.getItem('key');
    let publicKey = `-----BEGIN PUBLIC KEY-----\n${base64key.match(/.{1,64}/g).join('\n')}\n-----END PUBLIC KEY-----`;
    let encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    return encrypt.encrypt(value).toString();  
}

export async function getAesKey() { 
    
    const response =  await fetch("http://localhost:8081/TIA103G3_Servlet/createtempaeskey", {
        method: "post",
        mode: "cors"
    })
    .catch(error => {
        console.log("Error" ,error);
    });
    const info = await response.json();
    sessionStorage.setItem("key", info.key);
    
}
export async function getRsaKey(data) { 
    const response = await fetch('http://localhost:8081/TIA103G3_Servlet/decryptdata', {
        method: "post",
        headers: {
                "Content-Type": "application/json"
        },
        body: JSON.stringify({ action:"getEmpPubKey",data: data.account})
    })
    .catch(error => {
        console.error("获取数据时出错:", error);
    });
    const keyData = await response.json();
    sessionStorage.setItem("key", keyData.key);
}
export async function getEmployee() { 
    return  fetch('http://127.0.0.1:8081/TIA103G3_Servlet/getEmpData', {
        method: "get",
        mode: "cors"
    })
    .catch(error => {
        console.error('获取数据时出错:', error);
    });
    
}
export async function updateEmp(data) { 
    const response = await fetch('http://localhost:8081/TIA103G3_Servlet/decryptdata', {
        method: "post",
        headers: {
                "Content-Type": "application/json"
        },
        body: JSON.stringify({action:"empReg",data:data,base64key:sessionStorage.getItem('key')})
    })
    .catch(error => {
        console.error('获取数据时出错:', error);
    });
    return await response.json();
}
export async function login(data) { 
    
    const encrypdata = encryptionRsa(JSON.stringify(data));
    const response = await fetch('http://127.0.0.1:8081/TIA103G3_Servlet/decryptdata', {
        method: "post",
        headers: {
                "Content-Type": "application/json"
        },
        body: JSON.stringify({ action: "empLogin", identity: data.account, data: encrypdata})
    })
    .catch(error => {
        console.error('获取数据时出错:', error);
    });
    if (response.status === 200) {
        sessionStorage.removeItem('key');
        const session = await response.json();
        sessionStorage.setItem('token', session.token);
        sessionStorage.setItem('emp', data.account);
        window.location.replace('../page/home.html');
        
    }
    else  if(response.status === 203){ 
        return 203;
    }
} 



