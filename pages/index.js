import { useState } from 'react';
import Head from 'next/head'
import Image from 'next/image';
import { ethers } from 'ethers';
import CampaignFactory from '../artifacts/contracts/Campaign.sol/CampaignFactory.json'
import Card from '../components/Card/Card';
import { CATEGORY } from '../constants/constant';
// const AllData = [{"title":"Testing","image":"QmWGsZjiqtaMNWi9rV9H8SQj9vG3QKuycYfrrdci25cvqW","owner":"0xeE28Dc69d38Ef9943691388ED3C09b31EFb3F1CD","timeStamp":1654394046,"amount":"1.0","address":"0xf9504DffFBac17811156228174F68a3898dAec8A","raisingFor":"Charity","description":"QmWCzde5C7VCPCfyR6ZKGpq2hxxSJ6RpEPLBP9BdpCJsjb"},{"title":"kjhjkh","image":"QmWGsZjiqtaMNWi9rV9H8SQj9vG3QKuycYfrrdci25cvqW","owner":"0xeE28Dc69d38Ef9943691388ED3C09b31EFb3F1CD","timeStamp":1654395546,"amount":"1.0","address":"0x248552bd0B0352904dDe089f24F599f6c63039F5","raisingFor":"Charity","description":"QmQNyGFx88BcQrixH8C1XVettf4XPqVo2jj893nAMkRwVy"}]
export default function Home({AllData=[], MedicalData=[], EducationData=[], EnvironmentData=[],FamilyData=[], OtherData=[]}) {
  const [filter, setFilter] = useState(AllData);
  const changeHandler = (e) =>{
    e.target.value === "Education" ?
    setFilter(EducationData):e.target.value === "Environment" ?
    setFilter(EnvironmentData):e.target.value === "Family" ?
    setFilter(FamilyData):e.target.value === "Medical" ?
    setFilter(MedicalData):e.target.value === "Other" ?
    setFilter(OtherData):setFilter(AllData)
  }
  return (
    <div className='p-8'>
      <div className="form-control w-full max-w-xs py-8">
        <label className="label">
          <span className="label-text">Campaign category</span>
        </label>
        <select className="select select-primary" onChange={changeHandler} >
          {CATEGORY.map(item=><option key={item.label} value={item.value}>{item.label}</option>)} 
        </select>
      </div>
      {filter && filter.length ? <div className='grid gap-4 justify-items-center grid-cols-1 md:grid-cols-3 lg:grid-cols-4'>
        {filter.map(item=>{
          return (<Card key={item.title} data={item}/>)
        })}
       </div>:<p>No Campaign for this category available</p>}
    </div>
    
  )
}
export async function getStaticProps() {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_RPC_URL
  );

  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_ADDRESS,
    CampaignFactory.abi,
    provider
  );
  const getAllCampaigns = contract.filters.campaignCreated();
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
  });
  console.log(JSON.stringify(AllData))

 

  const getResponse = async (category='') =>{
    const getCampaigns = contract.filters.campaignCreated(null,null,null,null,null,null,category, null, null);
    const Campaigns = await contract.queryFilter(getCampaigns);
    return Campaigns.map((e) => {
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
    });
  }


  // const getEducationCampaigns = contract.filters.campaignCreated(null,null,null,null,null,null,'Education');
  // const EducationCampaigns = await contract.queryFilter(getEducationCampaigns);
  // const EducationData = EducationCampaigns.map((e) => {
  //   return getFormattedResponse(e)
  // });

  // const getEnvironmentCampaigns = contract.filters.campaignCreated(null,null,null,null,null,null,'Environment');
  // const EnvironmentCampaigns = await contract.queryFilter(getEnvironmentCampaigns);
  // const EnvironmentData = EnvironmentCampaigns.map((e) => {
  //   return getFormattedResponse(e)
  // });

  // const getFamilyCampaigns = contract.filters.campaignCreated(null,null,null,null,null,null,'Family');
  // const FamilyCampaigns = await contract.queryFilter(getFamilyCampaigns);
  // const FamilyData = FamilyCampaigns.map((e) => {
  //   return getFormattedResponse(e)
  // });

  
  const EnvironmentData = await getResponse("Environment")
  const EducationData = await getResponse("Education")
  const FamilyData = await getResponse("Family")
  const MedicalData = await getResponse("Medical")
  const OtherData = await getResponse("Other")
  return {
    props: {
      AllData,
      EnvironmentData,
      EducationData,
      FamilyData,
      MedicalData,
      OtherData
    }
  }
}