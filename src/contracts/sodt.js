import {
  createContract,
  snip721Def,
  extendContract,
} from "@stakeordie/griptape.js";

const def = {
  messages: {
    addMinters({ padding }, minters) {
      return {
        handleMsg: {
          add_minters: { minters, padding },
        },
      };
    },
  },
  queries: {
    getMinters() {
      return {
        minters: {},
      };
    },
  },
};
export const sodt = createContract({
  id: "sodt",
  at: "secret16h4wr6u90sk5m3eahe3njh4n6wn8c4zhq22s34",
  definition: extendContract(snip721Def, def),
});
