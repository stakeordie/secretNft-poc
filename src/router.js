import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '',
            name: 'App',
            component: () => import ('./App.vue'),
            redirect: { name: 'TransferAsset' }
        },
        {
            path: '/min-nft',
            name: 'MintNft',
            component: () => import ('./views/MintNft.vue')
        },
        {
            path: '/transfer-asset',
            name: 'TransferAsset',
            component: () => import ('./views/TransferAsset.vue')
        },
        {
            path: '/transaction-history',
            name: 'TransactionHistory',
            component: () => import ('./views/TransactionHistory')
        }
    ]
});

export default router;