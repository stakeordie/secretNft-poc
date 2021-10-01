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
            component: () => import ('./views/TransactionHistory.vue')
        },
        {
            path: '/all-tokens',
            name: 'AllTokens',
            component: () => import ('./views/AllTokens.vue')
        },
        {
            path: '/nft-details/:tokenId',
            name: 'NftDetails',
            component: () => import ('./views/NftDetails.vue')
        },
        {
            path: '/aprove-revoke',
            name: 'Permissions',
            component: () => import ('./views/permissions.vue')
        },
        {
            path: '/handle-privacy',
            name: 'HandlePrivacy',
            component: () => import ('./views/HandlePrivacy.vue')
        },
        {
            path: '/contract-info',
            name: 'ContractInfo',
            component: () => import ('./views/ContractInfo.vue')
        },
        {
            path: '/whitelist',
            name: 'Whitelist',
            component: () => import ('./views/Whitelist')
        }
    ]
});

export default router;