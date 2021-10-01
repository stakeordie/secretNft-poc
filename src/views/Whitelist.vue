<template>
    <div id="app">
        <h1>Whitelist for token</h1>
        <select @change="getWhitelist" name="" id="" v-model="tokenSelected">
            <option value="">Select a NFT from your collection</option> 
            <option v-bind:key="t" v-for="t in tokens" :v-model="t">
            {{ t }}
            </option>
        </select>
        <button @click="getWhitelist" :disabled="tokenSelected==''" >Update</button>
        <div class="whitelist">
            <table>
                <tr>
                  <th>Address</th>
                  <th>View owner expiration</th>
                  <th>View private metadata expiration</th>
                  <th>Transfer expiration</th>
                </tr>
                <tr v-for="list in whitelist.token_approvals" :key="list.address">
                  <td> {{list.address}} </td>
                  <td> {{list.view_owner_expiration}} </td>
                  <td> {{list.view_private_metadata_expiration}} </td>
                  <td> {{ list.transfer_expiration}} </td>
                </tr>
            </table>
        </div>
        <button @click="showForm=true" :disabled="tokenSelected==''" >Modify whitelist</button>
        <div v-show="showForm" class="form-whitelist">
            <div class="form-param">
                <label class="input" for="whAddress">Address for whitelist</label>
                <input class="input" type="text" id="whAddress" v-model="whAddress" />
            </div>
             <div class="form-param">
                <label for="">View Owner</label>
                <div class="form-radio">
                    <input type="radio" id="approved" value='approve_token' v-model="view_owner">
                    <label for="approved">Approved</label>
                    <input type="radio" id="all" value="all" v-model="view_owner">
                    <label for="all">All</label>
                    <input type="radio" id="revoked" value="revoke_token" v-model="view_owner">
                    <label for="revoked">Revoked</label> 
                    <input type="radio" id="none" value="none" v-model="view_owner">
                    <label for="none">None</label>
                </div>
            </div>
            <div class="form-param">
                <label for="">View Private Metadata</label>
                <div class="form-radio">
                    <input type="radio" id="approved" value='approve_token' v-model="view_metadata">
                    <label for="approved">Approved</label>
                    <input type="radio" id="all" value="all" v-model="view_metadata">
                    <label for="all">All</label>
                    <input type="radio" id="revoked" value='revoke_token' v-model="view_metadata">
                    <label for="revoked">Revoked</label>
                    <input type="radio" id="none" value="none" v-model="view_metadata">
                    <label for="none">None</label>
                </div>
            </div>
            <div class="form-param">
                <label for="">Transfer</label>
                <div class="form-radio">
                    <input type="radio" id="approved" value='approve_token' v-model="transfer">
                    <label for="approved">Approved</label>
                    <input type="radio" id="all" value='all' v-model="transfer">
                    <label for="all">All</label>
                    <input type="radio" id="revoked" value='revoke_token' v-model="transfer">
                    <label for="revoked">Revoked</label>
                    <input type="radio" id="none" value='none' v-model="transfer">
                    <label for="none">None</label>
                </div>
            </div>
             <div class="form-param">
                <label class="input" for="expiration">Expires:</label>
                <input class="input" id="expiration" type="date" v-model="expiration">
                <label class="input" for="expiration">milisegundos</label>
            </div>
             <div>
                
            </div>

            <button @click="setWhitelisted(), showForm=false">Ok</button>
        </div>
    </div>
</template>

<script>
import { sodt } from "../contracts/sodt.js";
import {
  getAddress,
  onAccountAvailable,
} from "@stakeordie/griptape.js";

export default {
  name: "Whitelist",
  data() {
    return {
      tokenSelected: "",
      tokens: [],
      whitelist: {
      },
      whAddress: "",
      view_owner:'revoke_token',
      view_metadata:'revoke_token',
      transfer: 'revoke_token',
      expiration: 0 ,
      showForm: false,
    };
  },
  async mounted() {
    onAccountAvailable(async () => {
      await this.getTokens();
    });
  },
  methods: {
    async getTokens() {
      const address = getAddress();
      const { token_list } = await sodt.getTokens(address);
      const { tokens } = token_list;
      this.tokens = tokens;
    },
    async setWhitelisted(){
      
      if(this.expiration == 0 || this.expiration ==  null){
        this.expiration = 'never';
      }else{
        this.expiration = {"at_time": Math.round((new Date(this.expiration)).getTime() / 1000)}
      }

      const whitelist = await sodt.setWhiteListedApproval(this.whAddress, this.tokenSelected, this.view_owner, this.view_metadata, this.transfer, this.expiration);
      
      let utf8decoder = new TextDecoder();
      console.log(utf8decoder.decode(whitelist.response.data));
      this.whAddress="";
      this.view_owner ='revoke_token';
      this.view_metadata ='revoke_token';
      this.transfer ='revoke_token';
      this.expiration = 0;
    },
    async getWhitelist(){
      const {token_approvals} = await sodt.getTokenApprovals(this.tokenSelected);
      this.whitelist = token_approvals;

      (this.whitelist.token_approvals).forEach(element => {
          if(element.view_owner_expiration == null){
            element.view_owner_expiration="Revoked";
          }else{
            if(element.view_owner_expiration != "never"){
                element.view_owner_expiration = (new Date(element.view_owner_expiration.at_time * 1000)).toLocaleString('es-ES');
            };
          }
          
          if(element.view_private_metadata_expiration == null){
            element.view_private_metadata_expiration="Revoked";
          }else{
            if(element.view_private_metadata_expiration != "never"){
                element.view_private_metadata_expiration = (new Date(element.view_private_metadata_expiration.at_time * 1000)).toLocaleString('es-ES');
            };
          }

          if(element.transfer_expiration == null){
            element.transfer_expiration="Revoked";
          }else{
            if(element.transfer_expiration != "never"){
                element.transfer_expiration = (new Date(element.transfer_expiration.at_time * 1000)).toLocaleString('es-ES');
            };
          }
      });
    }
    
  },
};
</script>

<style>
#app {
  width: 100%;
  height: 100%;
  display: block;
  padding: 3rem;
}
h1 {
  width: 100%;
  height: fit-content;
  text-align: center;
}
select,
input,
button {
  padding: 1rem;
  height: fit-content;
}
form {
  display: flex;
  justify-content: center;
}
.whitelist{
    padding: 2rem;
}
.form-whitelist{
  padding: 2rem;
}
.form-param{
  padding: 1rem;
  height: 3rem;
  font-weight: 600;
}
.input{
  padding: 1rem;
}
.form-radio{
  padding: 1rem;
  height: 8rem;
  font-weight: 100;
}
.vk,
dl {
  margin: 20px 30%;
}
dt {
  font-weight: 700;
  padding: 0.5rem 0;
}

table{
  width: 90%;
}

td{
  text-align: center;
}

</style>
