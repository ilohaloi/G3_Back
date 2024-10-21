export async function authCheck() {
    try {
        return fetch('http://localhost:8081/TIA103G3_Servlet/blank', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ action: "auth", identity: sessionStorage.getItem('emp'), token: sessionStorage.getItem('token') })
        })
        
        
    } catch (error) {
        console.log(error);
    }
}
