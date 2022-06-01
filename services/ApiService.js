import axios from 'axios';
// php artisan serve --host 192.168.100.8 --port 8080
// php artisan serve --host 172.16.7.178 --port 8080
const IP = "192.168.100.8";
// const IP = "192.168.48.93";
// const IP = "192.168.76.94";
// const IP = "192.168.212.93";

// const IP = "172.16.7.224";
// const IP = "182.253.110.116";
const PORT = "8080";
export const CallApi = {
    base_url: "http://"+IP+":"+PORT+"/api/"
};

export const Axio = axios.create({
    baseURL: CallApi.base_url,
    headers: {
        "Content-Type" : "application/json", 
    }
});
