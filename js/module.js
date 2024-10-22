export async function sideBar() {
    try {
        const response = await fetch('../component/SiderBar.html')
        if (response.ok) {
            const data = await response.text();
            document.getElementById("wrapper").innerHTML = data;
        }
    } catch (error) {
        console.log(error);
    }
}
