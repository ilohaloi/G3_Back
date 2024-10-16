export function handleFileUpload(event,prod){ 
    const files = Array.from(event.target.files);
            if (files.length > 3) {
                alert('最多只能上传 3 张图片');
                return;
            }
    prod.imges = files;
    console.log('照片路徑',files);
    
}

export async function getProducts() {
    try {
        const response = await fetch('http://localhost:8081/TIA103G3_Servlet/prodget', {
        method: 'post',
        headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({action:'getAllprod',identity:'',data:'',base64key:''})
        })
        if (response.status === 200) {
            return await response.json();
        }
    } catch(error) { 
        console.log(error);
    }
};
export async function getProduct(id) {
    try {
        const response = await fetch('http://localhost:8081/TIA103G3_Servlet/prodget', {
        method: 'post',
        headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({action:'getProd',identity:id,data:'',base64key:''})
        })
        if (response.status === 200) {
            return await response.json();
        }
    } catch(error) { 
        console.log(error);
    }
}

export async function insertProd(prod) {

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
export async function updateProd(prod) { 
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


export async function getOrders() {
    try {
        const response = await fetch('http://localhost:8081/TIA103G3_Servlet/getorder',{
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({action:'getOrders'})
        })
        if (response.status === 200) {    
            return await response.json();
        }

    } catch (error) { 
        console.log(error);
    } 
} 
export async function getOrderDetail(orderId) { 
    try {
        const response = await fetch('http://localhost:8081/TIA103G3_Servlet/getorder',{
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({action:'getDetail',identity:orderId})
        })
        if (response.status === 200) {
            return await response.json();
        }

    } catch (error) { 
        console.log(error);
    } 
}