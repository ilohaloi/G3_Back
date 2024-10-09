export async function getRoute() {
    try {
        const response = await fetch('http://localhost:8081/TIA103G3_Hibernate/prod', {
            method: "get",
            mode: "cros"
        })
        if (response.status === 200) {
            const route = await response.json();
            return route;
        }
    } catch(error) { 
        console.log(error);
    }
};
export async function getSchedule() {
    try {
        const response = await fetch('http://localhost:8081/TIA103G3_Hibernate/prod', {
            method: "get",
            mode: "cros"
        })
        if (response.status === 200) {
            const schedule = await response.json();
            return schedule;
        }
    } catch(error) { 
        console.log(error);
    }
};
export async function getOrder() {
    try {
        const response = await fetch('http://localhost:8081/TIA103G3_Hibernate/prod', {
            method: "get",
            mode: "cros"
        })
        if (response.status === 200) {
            const order = await response.json();
            return order;
        }
    } catch(error) { 
        console.log(error);
    }
};