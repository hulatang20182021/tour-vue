import Vue from 'vue';
import Router from 'vue-router';
import Layout from '@/layouts/Layout.vue';

// 引入页面组件
import Reqs from '@/views/ReqAnalysis.vue';
import Sdesigns from '@/views/SDesign.vue';
import Cdesigns from "@/views/CDesign.vue";
import Waretest from "@/views/WareTest.vue";
import Code from "@/views/CodeDesign.vue";

Vue.use(Router);

const routes = [
    {
        path: '/',
        component: Layout,
        redirect: '/reqs',
        children: [
            {
                path: 'reqs',
                component: Reqs,
                name: 'reqAnalysis',
            },
            {
                path: 'sdesigns',
                component: Sdesigns,
                name: 'sdesigns'
            },
            {
                path: 'cdesigns',
                component: Cdesigns,
                name: 'cdesigns'
            },
            {
                path: 'codedesigns',
                component: Code,
                name: 'codedesigns'
            },
            {
                path: 'waretest',
                component: Waretest,
                name: 'waretest'
            }
            // 其他子路由
        ]
    },
    // 其他路由
];

const router = new Router({
    mode: 'history',
    routes
});

export default router;

