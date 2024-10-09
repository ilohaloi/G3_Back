export async function getMemberShip() {
    try {
        const response = await fetch('http://localhost:8081/TIA103G3_Hibernate/testGetMemb', {
        method: "post",
        mode:"cors"
        })
        if (response.status === 200) {
            const prods = await response.json();
            return prods;
        }
    } catch(error) { 
        console.log(error);
    }
};