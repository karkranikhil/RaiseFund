import { useEffect, useState } from "react";
import Image from "next/image";
import {ethers} from 'ethers';
import {TailSpin} from 'react-loader-spinner'
import CampaignFactory from '../artifacts/contracts/Campaign.sol/CampaignFactory.json'
import Campaign from '../artifacts/contracts/Campaign.sol/Campaign.json'


const AllData = {"title":"Testing","image":"QmWGsZjiqtaMNWi9rV9H8SQj9vG3QKuycYfrrdci25cvqW","owner":"0xeE28Dc69d38Ef9943691388ED3C09b31EFb3F1CD","timeStamp":1654394046,"amount":"1.0","address":"0xf9504DffFBac17811156228174F68a3898dAec8A","raisingFor":"Charity","description":"QmWCzde5C7VCPCfyR6ZKGpq2hxxSJ6RpEPLBP9BdpCJsjb"}
export default function Detail({data, donationsData=[]}) {
  // const [data, setData] = useState(AllData)
  const [mydonations, setMydonations] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState();
  const [change, setChange] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const Request = async () => {
      let descriptionData;
      setLoading(true); 
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const Web3provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = Web3provider.getSigner();
      const Address = await signer.getAddress();

      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL
      );
    
      const contract = new ethers.Contract(
        data.address,
        Campaign.abi,
        provider
      );

      fetch('https://ipfs.infura.io/ipfs/' + data.descriptionUrl)
            .then(res => res.text()).then(result => descriptionData = result);

      const MyDonationsList = contract.filters.donated(Address);
      const MyAllDonations = await contract.queryFilter(MyDonationsList);
      const donationResult = MyAllDonations.map((e) => {
        return {
          donar: e.args.donar,
          amount: ethers.utils.formatEther(e.args.amount),
          timestamp : parseInt(e.args.timestamp)
        }
      })
      setMydonations(donationResult);

      setDescription(descriptionData);
      setLoading(false); 
    }

    Request();
  }, [change])


  const donateFunds = async () => {
    try {
      setLoading(true); 
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const contract = new ethers.Contract(data.address, Campaign.abi, signer);
      
      const transaction = await contract.donate({value: ethers.utils.parseEther(amount)});
      await transaction.wait();

      setChange(true);
      setAmount('');
      location.reload()
      setLoading(false); 
      
  } catch (error) {
      console.log(error);
      setLoading(false); 
  }

  }

  return (
    <div>
      {loading ?
      <div className='spinner'>
        <TailSpin color="#cdcdcd" height={100} />
      </div>:<div className="flex flex-wrap p-8">
       <div className="w-full mb-4 px-4">
        <h1 className="text-6xl font-normal leading-normal mt-0 mb-4">
            {data.title}
        </h1>
       </div>
      <div className="w-full lg:w-1/2 mb-4 px-4">
     
      <div className="w-full text-center flex">
        <div className="stats flex-1 bg-secondary text-secondary-content m-2">
          <div className="stat">
            <div className="stat-title">Campaign Target Amount</div>
            <div className="stat-value">{data.requiredAmount} Matic</div>
          </div>
        </div>
        <div className="stats flex-1 bg-secondary text-secondary-content m-2">
          <div className="stat">
            <div className="stat-title">Received Amount</div>
            <div className="stat-value">{data.receivedAmount} Matic</div>
          </div>
        </div>
    </div>
      <Image 
          layout='responsive'
          height={30}
          width={50}
          alt={data.title}
          src={"https://ipfs.infura.io/ipfs/" + data.image} 
        />
          <p className="mt-8">{description}</p>
      </div>
      <div className="w-full lg:w-1/2 mb-4 px-4">
        <form className="flex items-center" onSubmit={donateFunds}>
          <div className="flex-1 form-control w-full mb-6">
            <label className="label">
              <span className="label-text">Donation Amount</span>
            </label>
            <input type="number" value={amount} step="any" onChange={(e) => setAmount(e.target.value)} name="donation" required className="input input-bordered input-primary w-full" />
          </div>
          <div className="flex-1 form-control w-full mb-6 mx-3">
             <button className="btn btn-primary mt-8" type="submit">Donate</button>
          </div>
        </form>
        
        
        <h2 className="text-xl font-normal leading-normal mx-4 mt-4">
          Recent Donation
        </h2>
        <div className="overflow-x-auto mx-4 mt-4">
          <table className="table table-primary w-full">
            <thead>
              <tr>
                <th className="bg-primary text-primary-content"></th>
                <th className="bg-primary text-primary-content">Donar</th>
                <th className="bg-primary text-primary-content">Amount</th>
                <th className="bg-primary text-primary-content">Date/Time</th>
              </tr>
            </thead>
            <tbody>
              {donationsData.map((e,index) => <tr key={e.timestamp}>
                <th className="bg-accent text-accent-content">{index+1}</th>
                <td className="bg-accent text-accent-content">{e.donar.slice(0,6)}...{e.donar.slice(39)}</td>
                <td className="bg-accent text-accent-content">{data.amount} Matic</td>
                <td className="bg-accent text-accent-content">{new Date(e.timestamp * 1000).toLocaleString('en-US')}</td>
              </tr>)}
            </tbody>
          </table>
        </div>
        <h2 className="text-xl font-normal leading-normal mx-4 mt-4">
            My Past Donation
        </h2>
        <div className="overflow-x-auto mx-4 mt-4">
          <table className="table table-primary w-full">
            <thead>
              <tr>
                <th className="bg-primary text-primary-content"></th>
                <th className="bg-primary text-primary-content">Donar</th>
                <th className="bg-primary text-primary-content">Amount</th>
                <th className="bg-primary text-primary-content">Date/Time</th>
              </tr>
            </thead>
            <tbody>
              {mydonations.map((e,index)=>(<tr key={e.timestamp}>
                <th className="bg-accent text-accent-content">{index+1}</th>
                <td className="bg-accent text-accent-content">{e.donar.slice(0,6)}...{e.donar.slice(39)}</td>
                <td className="bg-accent text-accent-content">{e.amount} Matic</td>
                <td className="bg-accent text-accent-content">{new Date(e.timestamp * 1000).toLocaleString('en-US')}</td>
              </tr>))}
            </tbody>
          </table>
        </div>
      </div>
    </div>}
    </div>
    
  );
}


export async function getStaticPaths() {
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

  return {
    paths: AllCampaigns.map((e) => ({
        params: {
          address: e.args.campaignAddress.toString(),
        }
    })),
    fallback: "blocking"
  }
}

export async function getStaticProps(context) {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_RPC_URL
  );

  const contract = new ethers.Contract(
    context.params.address,
    Campaign.abi,
    provider
  );
 
  const title = await contract.title();
  const requiredAmount = await contract.requiredAmount();
  const image = await contract.image();
  const descriptionUrl = await contract.description();
  const owner = await contract.owner();
  const receivedAmount = await contract.receivedAmount();

  const Donations = contract.filters.donated();
  const AllDonations = await contract.queryFilter(Donations);


  const data = {
      address: context.params.address,
      title, 
      requiredAmount: ethers.utils.formatEther(requiredAmount), 
      image, 
      receivedAmount: ethers.utils.formatEther(receivedAmount), 
      descriptionUrl, 
      owner,
  }
  console.log(JSON.stringify(data))

  const donationsData =  AllDonations.map((e) => {
    return {
      donar: e.args.donar,
      amount: ethers.utils.formatEther(e.args.amount),
      timestamp : parseInt(e.args.timestamp)
  }});
  console.log(donationsData)
  return {
    props: {
      data,
      donationsData
    }
  }


}

