import {
  createContract,
  snip20Def,
  extendContract,
} from "@stakeordie/griptape.js";

const def = {
  messages: {
    createViewingKey({ padding }) {
      const entropy = padding;
      return { handleMsg: { create_viewing_key: { padding, entropy } } };
    },
  },
};

const sefi = createContract({
  id: "sefi-contract",
  at: "secret12q2c5s5we5zn9pq43l0rlsygtql6646my0sqfm",
  definition: extendContract(snip20Def, def),
});

export default sefi;
