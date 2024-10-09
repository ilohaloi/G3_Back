export async function getProducts() {
    try {
        const response = await fetch('http://localhost:8081/TIA103G3_Hibernate/prod', {
        method: "post",
        headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({action:"getAllprod",identity:"",data:"",base64key:""})
        })
        if (response.status === 200) {
            const prods = await response.json();
            return prods;
        }
    } catch(error) { 
        console.log(error);
    }
};
export async function addNewOrder(data,router) {
    try {
        const response = await fetch("http://localhost:8081/shoppingCart-server/AddNewOrder", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const result = await response.json();
        console.log('Response from server:', result);
        if (result.status === "success") { 
            
            router.replace('/OrderSuccess').then(() => {
                window.location.reload();
            });
            localStorage.setItem('cartTotal','');
            localStorage.setItem('cart', '');
            
        }
        else {
            console.error('Order submission failed:', result.message);
        }
    } catch (error) {
        console.error('Error submitting order:', error);
        throw error;  // 可以选择重新抛出错误，供调用方处理
    }
}
export function handleFileUpload(event,prod){ 
    const files = Array.from(event.target.files);
            if (files.length > 3) {
                alert('最多只能上传 3 张图片');
                return;
            }
    prod.imges = files;
    console.log("照片路徑",files);
    
}
export async function updateProd(prod, type) {

    let response;
    if (prod.imges || type=== "new") {
        const formData = new FormData();
        formData.append('name', prod.name);
        formData.append('category', prod.category);
        formData.append('stock', prod.stock);
        formData.append('price', prod.price);
        console.log("imge");
        
        prod.imges.forEach((imageObj, index) => {
            if (imageObj instanceof File) {
                formData.append(`image_${index + 1}`, imageObj);
            } else {
                console.error('Invalid file object:', imageObj);
            }
        });
        try {
            response = await fetch('http://localhost:8081/shoppingCart-server/AddNewProd', {
                method: 'POST',
                body: formData
            });
            return response;
        } catch (error) {
            console.error('錯誤訊息: ', error);
            return error;
        }
    } else {
        try {
            response = await fetch("http://localhost:8081/shoppingCart-server/UpdateProd", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(prod)
            });
            return response;
        } catch(error) {
            console.error('錯誤訊息: ',error);
            return error;
        } 
    }
}