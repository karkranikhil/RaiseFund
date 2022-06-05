import { ethers } from 'ethers';
import CampaignFactory from '../artifacts/contracts/Campaign.sol/CampaignFactory.json'
import { useEffect, useState } from 'react';

import Card from '../components/Card/Card';

export default function Dashboard() {
  const [campaignsData, setCampaignsData] = useState([]);

  useEffect(() => {
    const Request = async () => {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const Web3provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = Web3provider.getSigner();
      const Address = await signer.getAddress();

      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL
      );
  
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_ADDRESS,
        CampaignFactory.abi,
        provider
      );
  
      const getAllCampaigns = contract.filters.campaignCreated(null, null, Address);
      const AllCampaigns = await contract.queryFilter(getAllCampaigns);
     
      const AllData = AllCampaigns.map((e) => {
      return {
        title: e.args.title,
        image: e.args.cpImgUrl,
        owner: e.args.owner,
        timeStamp: parseInt(e.args.timestamp),
        amount: ethers.utils.formatEther(e.args.cpRequiredAmount),
        address: e.args.campaignAddress,
        raisingFor:e.args.raisingFor,
        description:e.args.cpDescriptionUrl
      }
      })  
      console.log(AllData)
      setCampaignsData(AllData)
    }
    Request();
  }, [])

  return (
    <div className='p-8'>
    <h1 className="text-6xl font-normal leading-normal mt-0 mb-4">
         Your Campaigns
    </h1>
    {campaignsData && campaignsData.length ? <div className='grid gap-4 justify-items-center grid-cols-1 md:grid-cols-3 lg:grid-cols-4'>
      {campaignsData.map(item=>{
        return (<Card key={item.title} data={item}/>)
      })}
     </div>:<p>No Campaign available</p>}
  </div>
  )
}