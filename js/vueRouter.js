import { emp_view } from './emp';
import { emp_control } from './emp';
import { prod_view } from './prod';
import { prod_upload } from './prod';
import { orders_view } from './prod';

import {VueRouter} from'https://unpkg.com/vue-router@4'

export const routes = [
    { path: '/emplist', component: emp_view },
    { path: '/control', component: emp_control },
    { path: '/prodlist', component: prod_view },
    { path: '/produpload', component: prod_upload },
    { path: '/orderlist', component: orders_view }
]
export const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
})