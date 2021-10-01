<template>
  <div id="app">
    <nav>
      <button @click="$router.push({name: 'TransferAsset'})">Transfer Asset View</button>
      <button @click="$router.push({name: 'MintNft'})">Mint NFT View</button>
      <button @click="$router.push({name: 'TransactionHistory'})">Transaction History View</button>
      <button @click="$router.push({name: 'Permissions'})">NFT Permissions</button>
      <button @click="$router.push({name: 'AllTokens'})">See all tokens</button>
    </nav>
    <router-view/>
  </div>
</template>