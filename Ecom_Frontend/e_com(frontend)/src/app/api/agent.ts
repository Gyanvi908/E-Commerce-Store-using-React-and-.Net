// import axios, { AxiosError, AxiosResponse } from "axios";
// import { toast } from "react-toastify";
// import { router } from "../router/Routes";
// import { PaginatedResponse } from "../models/pagination";

// const sleep = () => new Promise(resolve => setTimeout(resolve, 500));
// axios.defaults.baseURL = 'https://localhost:7124/api/';
// axios.defaults.withCredentials = true;

// const responseBody = (response: AxiosResponse) => response?.data;



// axios.interceptors.response.use(async response => {
//     await sleep();
//     console.log(response)
//     const pagination = response.headers['pagination'];
//     if(pagination) {
//         response.data= new PaginatedResponse(response.data, JSON.parse(pagination));
//         console.log(response);
//         return response;
//     }
//     return response;
// }, (error: AxiosError) => {
//     const { data, status } = error.response as AxiosResponse;
//     switch (status) {
//         case 400:
//             if (data.errors) {
//                 const modelStateErrors: string[] = [];
//                 for (const key in data.errors) {
//                     if (data.errors[key]) {
//                         modelStateErrors.push(data.errors[key]);
//                     }
//                 }
//                 throw modelStateErrors.flat();
//             }
//             toast.error(data.title);
//             break;
//         case 401:
//             toast.error(data.title);
//             break;
//         case 500:
//             router.navigate('/server-error', { state: { error: data } });
//             break;
//         default:
//             break;
//     }
//     return Promise.reject(error); // Ensure the error continues to propagate
// });

// const requests = {
//     get: (url: string,params?: URLSearchParams) => axios.get(url, {params}).then(responseBody),
//     post: (url: string, body: object) => axios.post(url, body).then(responseBody),
//     put: (url: string, body: object) => axios.put(url, body).then(responseBody),
//     delete: (url: string) => axios.delete(url).then(responseBody),
// };

// const catalog = {
//     list: (params: URLSearchParams) => requests.get('products', params), // Adjusted endpoint URL
//     details: (id: number) => requests.get(`products/${id}`), // Adjusted endpoint URL
//     fetchFilters: () => requests.get('products/filters')
// };

// const testErrors = { // Renamed to camelCase for consistency
//     get400Error: () => requests.get('buggy/bad-request'),
//     get401Error: () => requests.get('buggy/unauthorized'), // Corrected spelling
//     get404Error: () => requests.get('buggy/not-found'),
//     get500Error: () => requests.get('buggy/server-error'),
//     getValidationError: () => requests.get('buggy/validation-error'),
// };

// const Basket = {
//     get: () => requests.get('Basket'), // Adjusted endpoint URL
//     addItem: (productId: number, quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
//     removeItem: (productId: number, quantity = 1) => requests.delete(`basket?productId=${productId}&quantity=${quantity}`),
// };

// const Account = {
//     login: (values: any) => requests.post('account/login', values),
//     register: (values: any) => requests.post('account/register', values),
//     currentUser: () => requests.get('account/currentUser'),
// }
// const agent = {
//     catalog,
//     testErrors, // Adjusted object name to camelCase
//     Basket,
//     Account
// };

// export default agent;


import  axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { PaginatedResponse } from "../models/pagination";
import { store } from "../store/configureStore";
import { router } from "../router/Routes";

const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

axios.defaults.baseURL = 'http://localhost:5127/api/';
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use(config => {
    const token = store.getState().account.user?.token;
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

axios.interceptors.response.use(async response => {
    await sleep();
    console.log(response);
    const pagination = response.headers['pagination'];
    if(pagination) {
        response.data = new PaginatedResponse(response.data, JSON.parse(pagination));
        return response;
    }
    return response
}, (error: AxiosError) => {
    const {data, status} = error.response as AxiosResponse;
    switch(status) {
        case 400:
            if(data.errors){
                const modelStateErrors: string[] = [];
                for(const key in data.errors) {
                    if(data.errors[key]){
                        modelStateErrors.push(data.errors[key])
                    }
                }
                throw modelStateErrors.flat();
            }
            toast.error(data.title);
            break;
        case 401:
            toast.error(data.title );
            break;
        case 404:
            toast.error(data.title);
            break;
        case 500:
            router.navigate('/server-error', {state: {error: data}});
            break;
        default:
            break;
            
    }
    return Promise.reject(error.response);
})

const requests = {
    get: (url: string, params?: URLSearchParams) => axios.get(url, {params}).then(responseBody),
    post: (url: string, body: object) => axios.post(url, body).then(responseBody),
    put: (url: string, body: object) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody), 
};

const Catalog = {
    list: (params: URLSearchParams) => requests.get('products', params),
    details: (id: number) => requests.get(`products/${id}`)
    ,fetchFilters: () => requests.get('products/filters')
};

const TestErrors = {
    get400Error: () => requests.get('buggy/bad-request'),
    get401Error: () => requests.get('buggy/unauthorized'),
    get404Error: () => requests.get('buggy/not-found'),
    get500Error: () => requests.get('buggy/server-error'),
    getValidationError: () => requests.get('buggy/validation-error'),
}

const Basket = {
    get: () => requests.get('basket'),
    addItem: (productId: number, quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItem: (productId: number, quantity = 1) => requests.delete(`basket?productId=${productId}&quantity=${quantity}`),
}
const Account = {
    login: (values: any) => requests.post('account/login', values),
    register: (values: any) => requests.post('account/register', values),
    currentUser: () => requests.get('account/currentUser'),
    fetchAddress: () =>  requests.get('account/savedAddress')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Orders = {
    list: () => requests.get('orders'),
    fetch: (id: number) => requests.get(`orders/${id}`),
    create: (values: any) => requests.post('orders', values)
}

const agent = {
    Catalog,
    TestErrors,
    Basket,
    Account,
    Orders
};
export default agent;
// function config(value: AxiosRequestConfig): AxiosRequestConfig | Promise<AxiosRequestConfig> {
//     // Your configuration logic here
//     throw new Error("Function not implemented.");
// }

