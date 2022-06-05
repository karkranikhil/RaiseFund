const hre = require("hardhat")
async function main(){
  const CampaignFactory = await hre.ethers.getContractFactory("CampaignFactory")
  const campaignFactory = await CampaignFactory.deploy()
  await campaignFactory.deployed();
  console.log("factory deployed to", campaignFactory.address)
}
main().then(()=>process.exit(0)).catch(error=>{
  console.error(error)
  process.exit(1)
})