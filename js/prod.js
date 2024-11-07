function handleFileUpload(event,prod){ 
    const files = Array.from(event.target.files);
            if (files.length > 3) {
                alert('最多只能上传 3 张图片');
                return;
            }
    prod.imges = files;
    console.log('照片路徑',files);
    
}
async function getProducts() {
    try {
        const response = await fetch(`http://localhost:8081/TIA103G3_Servlet/prodget?action=getAllprod`, {
            method: 'GET',
            mode:'cors'
        })
        if (response.status === 200) {
            return await response.json();
        }
    } catch(error) { 
        console.log(error);
    }
};
async function getProduct(id) {
    try {
        const response = await fetch(`http://localhost:8081/TIA103G3_Servlet/prodget?action=getProd&identity=${id}`, {
            method: 'GET',
            mode:'cors'
        })
        if (response.status === 200) {
            return await response.json();
        }
    } catch(error) { 
        console.log(error);
    }
}

async function insertProd(prod) {

    let response;
    const formData = new FormData();
    formData.append('name', prod.name);
    formData.append('category', prod.category);
    formData.append('stock', prod.stock);
    formData.append('price', prod.price);
    prod.imges.forEach((imageObj, index) => {
        if (imageObj instanceof File) {
            formData.append(`image_${index + 1}`, imageObj);
        } else {
            console.error('Invalid file object:', imageObj);
        }
    });
    try {
        response = await fetch('http://localhost:8081/TIA103G3_Servlet/prodinsert', {
            method: 'post',
            body: formData
        });
        return response;
    } catch (error) {
        console.error('錯誤訊息: ', error);
        return error;
    }
    
}
async function updateProd(prod) { 
    try {
        const response = await fetch('http://localhost:8081/TIA103G3_Servlet/produpdate', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(prod)
        });
        return response;
    } catch(error) {
        console.error('錯誤訊息: ',error);
        return error;
    } 
}


async function getOrders() {
    try {
        const response = await fetch('http://localhost:8081/TIA103G3_Servlet/getorder?action=getOrders',{
            method: 'GET',
            mode:"cors"
        })
        if (response.status === 200) {

            return await response.json();
        }

    } catch (error) { 
        console.log(error);
    } 
} 
export　async function getOrderDetail(orderId) { 
    try {
        const response = await fetch(`http://localhost:8081/TIA103G3_Servlet/getorder?action=getDetail&identity=${orderId}`,{
            method: 'GET',
            mode:'cors'
        })
        if (response.status === 200) {
            return await response.json();
        }

    } catch (error) { 
        console.log(error);
    } 
}

export const prod_view = {
    template: `
        <div v-if="isAuthenticated">
            <h1>商品列表</h1>
            <form class="form">
                <label class="form-label">商品  ID:  <input type="text" class="form-input" v-model="search.idValue"></label>
                <label class="form-label">商品名稱 : <input type="text" class="form-input" v-model="search.nameValue"></label>
                <label class="form-label">庫存數量: <input type="text" class="form-input" v-model="search.stockValue"></label>
                <label class="form-label">條件:
                    <select class="form-select" v-model="search.stockRange">
                    <option>請選擇</option>
                    <option value="">小於</option>
                    <option value="">大於</option>
                    </select>
                </label>

                <label class="form-label">商品類別: 
                    <select class="form-select form-select--wide">
                    <option>請選擇</option>
                    <option>小於</option>
                    <option>大於</option>
                    </select>
                </label>

                <button type="button" class="form-btn" @click="querySearch">查詢</button>
                <button type="reset" class="form-btn">清除條件</button>
                
            </form>
            <table>
                <thead>
                    <tr>
                        <th>編號</th>
                        <th>名稱</th>
                        <th>類別</th>
                        <th>庫存</th>
                        <th>價格</th>
                        <th>修改/刪除</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in paginatedProd" :key="index">
                        <td>{{ item.id }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.category }}</td>
                        <td>{{ item.stock }}</td>
                        <td>{{ item.price }}</td>
                        <td>
                            
                                <button class="form-btn btn-sl" @click="openWindow(item)">修改</button>
                            
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="dataTables_paginate paging_simple_numbers">
                <nav aria-label="Page navigation">
                    <ul class="pagination justify-content-center">
                        <li class="page-item" :class="{disabled: currentPage === 1 }">
                            <button class="page-link" @click="prevPage" :disabled="currentPage === 1">Previous</button>
                        </li>
                        <li v-for="page in totalPages" :key="page" class="page-item" :class="{active: page === currentPage }">
                            <button class="page-link" @click="goToPage(page)">{{ page }}</button>
                        </li>
                        <li class="page-item" :class="{disabled: currentPage === totalPages }">
                            <button class="page-link" @click="nextPage" :disabled="currentPage === totalPages">Next</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div >
    `,
    data() {
        return {
            prod: [],
            currentPage: 1,
            pageSize: 10,
            isAuthenticated: true,

            search: {
                idQuery: "id",
                idValue: "",
                nameQuery: "name",
                nameValue: "",
                stockQuery: "stock",
                stockValue: "",
                stockRange:"",
                categoryQuery: "category",
                categoryValue:"",
                query: [],
                value: []
            }
            
            
        };
    },
    computed: {
        // 计算分页数据
        paginatedProd() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.prod.slice(start, end);
        },
        // 计算总页数
        totalPages() {
            return Math.ceil(this.prod.length / this.pageSize);
        }
    },
    methods: {
        // 跳转到下一页
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        // 跳转到上一页
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        // 跳转到特定页
        goToPage(page) {
            this.currentPage = page;
        },
        openWindow(prod) {
            const params = `id=${prod.id} `;
            window.open(
                `../component/prod_PopWindow.html?${params} `,
                '商品更新',
                'width=600,height=600,left=200,top=100'
            );
            console.log(prod);
        },
        async querySearch() {
            this.search.query = [];
            this.search.value = [];

            if (this.search.idValue !== "") {
                this.search.query.push(this.search.idQuery);
                this.search.value.push(this.search.idValue);
            }
            if (this.search.nameValue !== "") {
                this.search.query.push(this.search.nameQuery);
                this.search.value.push(this.search.nameValue);
            }
            if (this.search.stockValue !== "") {
                this.search.query.push(this.search.stockQuery);
                this.search.value.push(this.search.stockValue);
            }
            if (this.search.categoryValue !== "") {
                this.search.query.push(this.search.categoryQuery);
                this.search.value.push(this.search.categoryValue);
            }
            try {
                const response = await fetch('http://localhost:8081/TIA103G3_Servlet/prodQuery', {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ query: this.search.query, value: this.search.value })
                });
                if (response.status === 200) {
                    this.prod = await response.json();
                    console.log(this.prod);
                    
                }
            } catch (error) {
                console.log(error);
                            
            }
    
        }
    },
    async mounted() {
        try {
            // const resp = await authCheck();
            // if (resp.status === 401) {
            //     window.location.replace('../index.html');
            //     return;
            // }
            // this.isAuthenticated = true;
            const products = await getProducts();
            console.log(products);
            this.prod = products;
        } catch (error) {
            console.error('Failed to get products:', error); // 捕获并处理错误
        }
    }
}

export const prod_upload = {
    template: `
        <div class="card card-dark">
            <div v-if="uploading" class="overlay dark">
                <i class="fas fa-2x fa-sync-alt fa-spin"></i>
            </div>
            <div class="card-header">
                <h3 class="card-title">新增商品</h3>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label for="name">商品名稱</label>
                    <input type="text" class="form-control" id="name" v-model="prod.name" placeholder="請輸入商品名稱" required>
                </div>
            
                <div class="form-group">
                    <label for="category" class="form-label">分類</label>
                    <select id="category" v-model="prod.category" class="custom-select form-control-border" required>
                        <option value="" disabled>選擇分類</option>
                        <option value="electronics">分類一</option>
                        <option value="clothing">分類二</option>
                        <option value="home">分類三</option>
                    </select>
                </div>
            
                <div class="form-group">
                    <label for="stock" class="form-label">數量</label>
                    <input type="number" id="stock" v-model="prod.stock" class="form-control" min="1" required />
                </div>
            
                <div class="form-group">
                    <label for="price" class="form-label">價格</label>
                    <input type="number" id="price" v-model="prod.price" class="form-control" min="1" required />
                </div>
            
                <div class="form-group">
                    <label for="imges" class="form-label">上傳圖片（最多三張，圖片大小不得超過10MB）</label>
                    <input type="file" name="imges" id="imges" @change="handleFileUpload" class="input-group-text" multiple accept="image/*" />
                </div>
                <div class="">
                    <label for="">商品描述:</label>
                    <div id="editor"></div>
                </div>
            </div>
            <div class="card-footer">
                <div class="d-flex justify-content-between align-items-center">
                    <button type="submit" class="btn btn-success" @click="submitForm">確認</button>                       
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            prod: {
                name: "",
                category: "",
                stock: 0,
                price: 0,
                imges: []
            },
            uploading: false,
            editor: null,
            
        }
    },
    methods: {
        handleFileUpload(event) {
            const files = Array.from(event.target.files);
            if (files.length > 3) {
                alert('最多只能上传 3 张图片');
                return;
            }
            this.prod.imges = files;
            console.log(this.prod.imges);
            
        },
        async submitForm(event) {
            event.preventDefault();
            console.log(123);
        
            this.uploading = true;
            try {
                const resp = await insertProd(this.prod);
                if (resp.status === 200) {
                    alert('新增成功');
                    this.uploading = false;
                }
                else if (resp.status === 400) {
                    alert(err.error);
                    this.uploading = false;
                }
            } catch (error) {
                console.error('提交出错:', error);
            }
        }
    },
    mounted() {
        this.editor = new FroalaEditor('#editor', {
            events: {
                'image.inserted': ($img, response) => {
                    console.log('插入的图片元素:', $img[0]);
                    var blobImageUrl = $img.attr('src');
                    this.imgs.push(blobImageUrl);
                    console.log('当前的 blob URL:', blobImageUrl);
                }
            }
        });
    },
}
export const orders_view = {
    template: `
        
                <h1>訂單列表</h1>
                <form class="form">
                    <label class="form-label">訂單ID:  <input type="text" class="form-input" v-model="search.orIdValue"></label>
                    <label class="form-label">會員ID : <input type="text" class="form-input" v-model="search.membIdValue"></label>
                    
                    <label class="form-label">訂單狀態:
                        <select class="form-select form-select--wide" v-model="search.statusValue">
                        <option value="" disbale>請選擇</option>
                        <option value="未付款">未付款</option>
                        <option >已付款</option>
                        <option>待出貨</option>
                        <option>以出貨</option>
                        </select>
                    </label>


                    <button type="button" class="form-btn" @click="quertSerach">查詢</button>
                    <button type="reset" class="form-btn" @click="clearQuereyValue">清除條件</button>
                </form>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>訂單編號</th>
                            <th>會員編號</th>
                            <th>狀態</th>
                            <th>訂單成立時間</th>
                            <th>付款方式</th>
                            <th>總價</th>
                            <th>明細</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in paginatedOrder" :key="index">
                            <td>{{ item.orId }}</td>
                            <td>{{ item.membId }}</td>
                            <td>{{ item.status }}</td>
                            <td>{{ item.time }}</td>
                            <td>{{ item.payment }}</td>
                            <td>{{ item.amount }}</td>
                            <td>
                                <div class="btn-group">
                                <button class="btn btn-block bg-gradient-info" @click="openWindow(item)">查看</button>
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
       
    `,
    data() {
        return {
            order: [],
            currentPage: 1,
            pageSize: 10,


            search: {
                orIdQuery: "orId",
                orIdValue: "",
                membIdQuery: "membId",
                membIdValue: "",
                statusQuery: "status",
                statusValue:"",
                timeQuery: "time",
                timeValue:"",
                query: [],
                value: []
            }
        };
    },
    computed: {
        paginatedOrder() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.order.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.order.length / this.pageSize);
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
        openWindow(order) {
            const params = `orid=${order.orId}&membid=${order.membId} `;
            window.open(
                `../component/prod_OrderDetail.html?${params}`,
                '明細',
                'width=600,height=600,left=200,top=100'
            );
            console.log(prod);
        },
        async quertSerach() {
            this.search.query = [];
            this.search.value = [];
            if (this.search.orIdValue !== "") {
                this.search.query.push(this.search.orIdQuery);
                this.search.value.push(this.search.orIdValue);
            }
            if (this.search.membIdValue !== "") {
                this.search.query.push(this.search.membIdQuery);
                this.search.value.push(this.search.membIdValue);
            }
            if (this.search.statusValue !== "") {
                this.search.query.push(this.search.statusQuery);
                this.search.value.push(this.search.statusValue);
            }
            
            
            try {
                const response = await fetch('http://localhost:8081/TIA103G3_Servlet/orderQuery', {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ query: this.search.query, value: this.search.value })
                });
                if (response.status === 200) {
                    this.order = await response.json();
                    console.log(this.order);
                    
                }

            } catch (error) {
                
            }

        
        },
        async clearQuereyValue() {
            this.search.orIdValue = "";
            this.search.membIdValue = "";
            this.search.statusValue = "";
            this.order = await getOrders();
        }
    },
    async mounted() {
        this.order = await getOrders();
        console.log(this.order);
        
    },
    // watch: {
    //     search: {
    //         handler(newValue, oldValue) {
    //             if (oldValue.orIdValue === "")
    //                 console.log(123);

    //         },
    //     deep: true
    //     }
    // },
};