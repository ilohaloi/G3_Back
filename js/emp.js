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
    //"http://localhost:8081/TIA103G3_Servlet/createtempaeskey"
    const response = await fetch("http://localhost:8081/TIA103G3_Servlet/createtempaeskey", {
        method: "get",
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
    
    //http://localhost:8081/TIA103G3_Servlet/decryptdata
    const response = await fetch('http://localhost:8081/TIA103G3_Servlet/decryptdata', {
        method: "POST",
        headers: {
                'Content-Type': 'application/json'
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

export const emp_view = {
    template: `
        <div class="row">
            <div class="col-12">
                <div class="card card-dark">
                    <div class="card-header">
                        <div class="card-title btn-group ms-auto">
                            <button class="btn btn-block btn-success" @click="openWindow">員工帳號新增</button>
                        </div>
                    </div>
                    <div class="card-body">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>編號</th>
                                    <th>姓名</th>
                                    <th>帳號</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(emp, index) in paginatedEmp" :key="index">
                                    <td>{{ emp.id }}</td>
                                    <td>{{ emp.name }}</td>
                                    <td>{{ emp.account }}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                </tr>
                            </tfoot>
                        </table>
                        <div class="dataTables_paginate paging_simple_numbers">
                            <nav aria-label="Page navigation">
                                <ul class="pagination justify-content-center">
                                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                        <button class="page-link" @click="prevPage" :disabled="currentPage === 1">Previous</button>
                                    </li>
                                    <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
                                        <button class="page-link" @click="goToPage(page)">{{ page }}</button>
                                    </li>
                                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                        <button class="page-link" @click="nextPage" :disabled="currentPage === totalPages">Next</button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `,
    data() {
        return {
            emp: [], 
            currentPage: 1, 
            pageSize: 10
        };
    },
    computed: {
        paginatedEmp() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.emp.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.emp.length / this.pageSize);
        }
    },
    methods: {
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        goToPage(page) {
            this.currentPage = page;
        },
        openWindow() {
            window.open(
                `../component/emp_PopEmpInsert.html`,
                '員工新增',
                'width=600,height=600,left=200,top=100'
            );
            console.log(prod);
        }
    },
    async mounted() {
        try {
            const emp = await getEmployee();
            this.emp = await emp.json();
            console.log(this.emp);
        } catch (error) {
            console.error('Failed to get Emp:', error);
        }
    },
}
