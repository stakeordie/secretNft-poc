<template>
  <div id="app">
    <h1>Instantiate your contract here</h1>
    <p>Paste your init msg here</p>
    <textarea v-model="initMsg" name="" id="" cols="50" rows="30">
      some random text 
    </textarea>
    <button @click="instantiate">Instantiate</button>
  </div>
</template>

<script>
import { instantiate } from "@stakeordie/griptape.js";

export default {
  name: "Whitelist",
  data() {
    return {
      initMsg: "",
      codeId: 31204,
    };
  },
  methods: {
    async instantiate() {
      console.log("Instantiating contract ...");
      const label = (Math.random() * Date.now()).toString();
      var data = this.initMsg;
      var dataArray = data.split("\r\n");

      for (var i = 0; i < dataArray.length; i++) {
        dataArray[i] = JSON.parse(dataArray[i]);
        console.log(dataArray[i]);
      }
      const init = dataArray[0];
      const res = await instantiate(this.codeId, init, label);
      console.log("Contract instantiated");
      console.log(res);
    },
  },
};
</script>
