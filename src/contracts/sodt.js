import { createContract, snip721Def } from "@stakeordie/griptape.js";

export const sodt = createContract({
  id: "sodt",
  at: "secret16h4wr6u90sk5m3eahe3njh4n6wn8c4zhq22s34",
  definition: snip721Def,
});
