export async function fetchRouteData() {
    try {
        const response = await fetch('http://localhost:8081/TIA103G3_Servlet/route', {
            method: "GET",
            mode: "cors"
        });
        if (response.status === 200) {
            const routeData = await response.json();
            console.log("Route Data:", routeData);
            return routeData.map(route => ({
                id: route.id,
                name: route.name,
                depiction: route.depiction,
                days: route.days,
                price: route.price
            }));
        }
    } catch (error) {
        console.error("Error fetching route data:", error);
    }
}

export async function fetchScheduleData() {
    try {
        const response = await fetch('http://localhost:8081/TIA103G3_Servlet/schedule', {
            method: "GET",
            mode: "cors"
        });
        if (response.status === 200) {
            const scheduleData = await response.json();
            return scheduleData;
        }
    } catch (error) {
        console.error("Error fetching schedule data:", error);
    }
}

export async function fetchOrderData() {
    try {
        const response = await fetch('http://localhost:8081/journey/travel_order', {
            method: "GET",
            mode: "cors"
        });
        if (response.status === 200) {
            const orderData = await response.json();
            return orderData;
        }
    } catch (error) {
        console.error("Error fetching order data:", error);
    }
}
