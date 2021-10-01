<template>
    <div class="nft-details" >
        <h2>Contract Information</h2>
        <h4>name:</h4>
        <span>{{contractInfo.name}}</span>
        <h4>symbol:</h4>
        <span>{{contractInfo.symbol}}</span>
        <br>
        <br>
        <br>
        <h2>Contract Configuration</h2>
        <h4>burn is enabled:</h4>
        <span>{{contractConfig.burn_is_enabled}}</span>
        <h4>minter may update metadata:</h4>
        <span>{{contractConfig.minter_may_update_metadata}}</span>
        <h4>owner may update metadata:</h4>
        <span>{{contractConfig.owner_may_update_metadata}}</span>
        <h4>owner is public:</h4>
        <span>{{contractConfig.owner_is_public}}</span>
        <h4>sealed metadata is enabled:</h4>
        <span>{{contractConfig.sealed_metadata_is_enabled}}</span>
        <h4>token supply is public:</h4>
        <span>{{contractConfig.token_supply_is_public}}</span>
        <h4>unwrapped metadata is private:</h4>
        <span>{{contractConfig.unwrapped_metadata_is_private}}</span>
    </div>
</template>

<script>

import { sodt } from "../contracts/sodt.js";
import { onAccountAvailable } from "@stakeordie/griptape.js";

export default {
    name: 'ContractInfo',
    data() {
        return {
            contractInfo: {},
            contractConfig: {},
        }
    },
    async mounted() {
        onAccountAvailable(async () => {
            this.getAllContractInfo();
        });
    },
    methods: {
        async getAllContractInfo() {
            const contractInfo = await sodt.contractInfo();
            const {contract_info} = contractInfo;
            const contractConfig= await sodt.contractConfig();
            const {contract_config} = contractConfig;
            this.contractInfo = contract_info;
            this.contractConfig = contract_config;
        },
    }
}
</script>

<style>

</style>