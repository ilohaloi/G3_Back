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
    const response = await fetch('http://localhost:8080/api/decryp', {
        method: "POST",
        headers: {
                'Content-Type': 'application/json'
        },
        body: JSON.stringify({action:"empReg",data:data,key:sessionStorage.getItem('key')})
        
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
                        <h3 class="card-title">員工列表</h3>
                    </div>
                    <div class="card-body">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>編號</th>
                                    <th>姓名</th>
                                    <th>帳號</th>
                                    <th>查看</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(emp, index) in emp" :key="index">
                                    <td>{{ emp.id }}</td>
                                    <td>{{ emp.name }}</td>
                                    <td>{{ emp.account }}</td>
                                    <td>
                                        <div class="btn-group">
                                        <button class="btn btn-outline-primary" @click="openWindow(item)">修改</button>    
                                        </div>
                                    </td>
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
            emp: [], // 存储从服务器获取的数据
            currentPage: 1, // 当前页码
            pageSize: 10 // 每页显示的条目数
        };
    },
    computed: {
        paginatedEmp() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.Emp.slice(start, end);
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
        //TODO 預留 : 更新查詢或修改密碼 
        // openWindow(prod) {
        //     // 打开一个新窗口，设置宽度、高度、位置等
        //     const params = `id=${prod.id}&name=${encodeURIComponent(prod.name)}&category=${encodeURIComponent(prod.category)}&price=${prod.price}&stock=${prod.stock}`;
        //     window.open(
        //         `./prod_popwindow.html?${params}`, // 要打开的 URL
        //         'popupWindow', // 窗口名称
        //         'width=600,height=600,left=200,top=100' // 窗口配置（宽度、高度、位置等）
        //     );
        //     console.log(prod);
        // }
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

export const emp_control = {
    template: `
        <div class="card card-dark">
            <div v-if="inProcess" class="overlay dark">
                <i class="fas fa-2x fa-sync-alt fa-spin"></i>
            </div>
            <div class="card-header">
            <h3 class="card-title">創建帳號</h3>
            </div>
            <form @submit.prevent="submitForm">
                <div class="form-group">
                    <label for="name" style="margin-top :10px ">姓名</label>
                    <input type="text" class="form-control" id="name" v-model="emp.name" required>
                </div>
            
                <div class="form-group">
                    <label for="account" class="form-label">帳號</label>
                    <input type="text" id="stock" v-model="emp.account" class="form-control" max=24 required />
                </div>
            
                <div class="form-group">
                    <label for="password" class="form-label">密碼</label>
                    <input type="password" id="password" v-model="emp.password" class="form-control"required />
                </div>
            
                <div class="card-footer">
                    <div class="d-flex justify-content-between align-items-center">
                        <!-- 左侧按钮 -->
                        <button type="submit" class="btn btn-success">確認</button>
                        <!-- 右侧消息 -->
                        <h3 :style="{ color: message.color }">{{ message.str }}</h3>
                    </div>
                </div>
            </form>
        </div>
    `,
    data() {
        return {
            emp: {
                id: 0,
                name: "",
                account: "",
                password: "",
                publicKey: "123456"
            },
            message: {
                str: "",
                color: "red"
            },
            inProcess: false
        }
    },
    methods: {
        async submitForm(event) {
            event.preventDefault();
            this.emp.name.trim();
            this.emp.account.trim();
            this.emp.password.trim();
            this.inProcess = true;
            if (!sessionStorage.getItem('key')) {
                await getAesKey();
            }
            const aesKey = sessionStorage.getItem('key');
            const data = encryptionAes(JSON.stringify(this.emp), aesKey);
            try {
                const info = await updateEmp(data)
                this.message.str = info.info;
                this.message.color = info.color;
                if (this.message.str.length != 0)
                    this.inProcess = false;
            } catch (error) {
                console.error('提交出错:', error);
            }
        }
    },
    async mounted() {
        await getAesKey();
    },

}