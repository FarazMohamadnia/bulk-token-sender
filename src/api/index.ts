import { API_URL } from "../config/deploy";

const url = API_URL;
// const url = API_URL_LOCAL;

export const API = {
    getToken: `${url}auth/jwt/create/`,
    getOrders: `${url}finance/all-sell-orders/`,
    verifyOrder: `${url}finance/close-sell-order/`,
};