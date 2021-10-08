<template>
  <div class="nft-details">
    <h2>Contract Information</h2>
    <h4>Title:</h4>
    <span>{{ contractInfo.title }}</span>
    <h4>Description:</h4>
    <span>{{ contractInfo.description }}</span>
    <h4>Traits</h4>
    <span>{{ contractInfo.traits }}</span>
    <h4>Mint_limit</h4>
    <span>{{ contractInfo.mint_limit }}</span>
    <br />
    <h4>source code:</h4>
    <span>{{ contractInfo.sourcecode }}</span>
    <br />
    <br />
    <h2>Contract Configuration</h2>
    <h4>burn is enabled:</h4>
    <span>{{ contractConfig.burn_is_enabled }}</span>
    <h4>minter may update metadata:</h4>
    <span>{{ contractConfig.minter_may_update_metadata }}</span>
    <h4>owner may update metadata:</h4>
    <span>{{ contractConfig.owner_may_update_metadata }}</span>
    <h4>owner is public:</h4>
    <span>{{ contractConfig.owner_is_public }}</span>
    <h4>sealed metadata is enabled:</h4>
    <span>{{ contractConfig.sealed_metadata_is_enabled }}</span>
    <h4>token supply is public:</h4>
    <span>{{ contractConfig.token_supply_is_public }}</span>
    <h4>unwrapped metadata is private:</h4>
    <span>{{ contractConfig.unwrapped_metadata_is_private }}</span>
  </div>
</template>

<script>
import { sodt } from "../contracts/sodt.js";
import { onAccountAvailable } from "@stakeordie/griptape.js";
import P5 from "p5";

export default {
  name: "ContractInfo",
  data() {
    return {
      contractInfo: {},
      contractConfig: {},
      functionFromCode: null,
    };
  },
  async mounted() {
    onAccountAvailable(async () => {
      await this.getAllContractInfo();
      const fn = this.getFunction();
      new P5((_) => fn(_, 1001));
      console.log(fn);
    });
  },
  methods: {
    async getAllContractInfo() {
      const contractInfo = await sodt.contractInfo();
      const { contract_info } = contractInfo;
      console.log(contract_info);
      const contractConfig = await sodt.contractConfig();
      const { contract_config } = contractConfig;
      this.contractInfo = contract_info;
      this.contractConfig = contract_config;

      // this.usingEval();
    },
    getFunction() {
      const code = "(" + this.contractInfo.sourcecode + ")";
      this.functionFromCode = eval(code);
      return this.functionFromCode;
    },
  },
};
</script>

<style></style>
