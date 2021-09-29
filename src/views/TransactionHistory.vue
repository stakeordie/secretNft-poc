<template>
  <div>
    <h1>Transaction History</h1>
    <dl>
      <dt>transactional history :</dt>
       <ul id="array-with-index">
        <li v-bind:key="item" v-for="(item, index) in txs">
          <dd>{{ index }} </dd>
          <span>id:</span>
          <dd>{{ item.token_id }} {{" token has been "}} {{item.action['transfer'] ? "tranfered"
                    : item.action['burn'] ? "burned"
                    : "minted"}}</dd>
          <br>
          <div v-if="item.action['transfer'] ? item.action['transfer'].from
                    : item.action['burn'] ? item.action['burn'].owner
                    : item.action['mint'].minter">
            <span>{{ item.action['transfer'] ? "from :"
                    : item.action['burn'] ? "owner :"
                    : "minter :"  }}</span>
            <dd>{{ item.action['transfer'] ? item.action['transfer'].from
                    : item.action['burn'] ? item.action['burn'].owner
                    : item.action['mint'].minter }}</dd>
          </div>
          <br>
          <div v-if="item.action['transfer'] ? item.action['transfer'].sender
                    : item.action['burn'] ? item.action['burn'].burner
                    : item.action['mint'].recipient">
            <span>{{ item.action['transfer'] ? "sender: "
                    : item.action['burn'] ? "burner :"
                    : "recipient :" }}</span>
            <dd>{{ item.action['transfer'] ? item.action['transfer'].sender
                    : item.action['burn'] ? item.action['burn'].burner
                    : item.action['mint'].recipient }}</dd>
          </div>
          <br>
          <div v-if="item.action['transfer']">
            <span>recipient :</span>
            <dd>{{ item.action['transfer'].recipient }}</dd>
          </div>
          <br>
          <div v-if="item.memo">
            <span>memo:</span>
            <dd> {{ item.memo }}</dd>
          </div>
          
          <br>
          <br>
        </li>
      </ul>
    </dl>
  </div>
</template>

<script>
import { sodt } from "../contracts/sodt.js";
import { onAccountAvailable } from "@stakeordie/griptape.js";

export default {
    name: "TransactionHistory",
    data() {
        return {
            txs: []
        }
    },
    async mounted() {
        onAccountAvailable(async () => {
            await this.getTransactionalHistory();
        });
    },
    methods: {
        async getTransactionalHistory() {
            const { transaction_history } = await sodt.getTransactionHistory();
            const {txs} = transaction_history;
            this.txs = txs;
        },
    }
}
</script>

<style>

</style>