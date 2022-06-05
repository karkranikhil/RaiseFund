import React, {useState} from 'react'
import { useRouter } from 'next/router'
import {TailSpin} from 'react-loader-spinner'
import { toast } from 'react-toastify';
import {ethers} from 'ethers';
import CampaignFactory from '../../artifacts/contracts/Campaign.sol/CampaignFactory.json'
import {create as IPFSHTTPClient} from 'ipfs-http-client';

const client = IPFSHTTPClient("https://ipfs.infura.io:5001/api/v0");

const Form = () => {
  const router = useRouter()
  /**files related */
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  /**files related */
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");

  /**files related */
  const [cpDescriptionUrl, setCpDescriptionUrl] = useState();
  const [cpImgUrl, setCpImgUrl] = useState();
  const [image, setImage] = useState(null);

  /**form related data*/
  const [formData, setFormData] = useState({
    campaignTitle: "",
    campaignDescription: "",
    campaignTargetAmount: "",
    category: "",
    raisingFor:""
  });

  const changeHandler=(e)=>{
    setFormData({...formData,[e.target.name]: e.target.value})
  }
  const imageHandler=(e)=>{
    setImage(e.target.files[0]);
  }
  const uploadFiles = async (e) => {
    const {campaignDescription}= formData
    e.preventDefault();
    setUploadLoading(true);
    if(campaignDescription) {
      try {
        const added = await client.add(campaignDescription);
        setCpDescriptionUrl(added.path)
      } catch (error) {
        toast.warn(`Error Uploading Story`);
      }
    }
    if(image) {
        try {
            const added = await client.add(image);
            setCpImgUrl(added.path)
        } catch (error) {
          toast.warn(`Error Uploading Image`);
        }
    }
    setUploadLoading(false);
    setUploaded(true);
    toast.success("Files Uploaded Sucessfully")
    //https://ipfs.infura.io/ipfs/QmNQYs9Wc5jGRnRLmdHA1LYEN9f65VYryGWsByZxTyvZAX
    //https://ipfs.infura.io/ipfs/QmZvGsMeZgXyseuMY52wj47bT8647GW5QKjMbX8RQGHqzT
}
  const createCampaign= async(e)=>{
    e.preventDefault();
    console.log(formData)
    console.log(image)
    // const {campaignTitle,campaignTargetAmount,category,raisingFor}= formData
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    if(!uploaded) {
        toast.warn("Please Upload the file")
    } else {
      setLoading(true); 
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_ADDRESS,
        CampaignFactory.abi,
        signer
      );
      console.log("formData.campaignTargetAmount", formData.campaignTargetAmount)
      const campaignAmount = ethers.utils.parseEther(formData.campaignTargetAmount)
      console.log("campaignAmount", campaignAmount)
      if(campaignAmount){
        const campaignData = await contract.createCampaign(
          formData.campaignTitle,
          campaignAmount,
          cpImgUrl,
          formData.category,
          cpDescriptionUrl,
          formData.raisingFor
        );
        
  
        await campaignData.wait();   
        setAddress(campaignData.to);
        toast.success("Campaign Created successfully!!")
        if(campaignData.to){
          router.push('/')
        }
      }
     
    }
  }
  console.log("address", address)
  const {campaignTitle,campaignDescription,campaignTargetAmount,category,raisingFor}= formData
  return (
    <div>
     {loading ?
      <div className='spinner'>
        <TailSpin color="#cdcdcd" height={100} />
      </div>:
      <form className="w-9/12 mx-auto p-8" onSubmit={createCampaign} autoComplete="off">
        <h1 className="text-6xl font-normal leading-normal mt-0 mb-4">
         Create Campaign
        </h1>
        <div className="flex flex-wrap overflow-hidden lg:-mx-4 xl:-mx-2">
          <div className="w-full overflow-hidden lg:my-4 lg:px-4 lg:w-1/2 xl:my-2 xl:px-2 xl:w-1/2">
            <div className="form-control w-full mb-6">
              <label className="label">
                <span className="label-text">Campaign Title</span>
              </label>
              <input type="text" name="campaignTitle" required value={campaignTitle} onChange={changeHandler} className="input input-bordered input-primary w-full" />
            </div>
            <div className="form-control w-full mb-6">
              <label className="label">
                <span className="label-text">Campaign Target Amount</span>
              </label>
              <input type="number" name="campaignTargetAmount" required value={campaignTargetAmount} onChange={changeHandler} className="input input-bordered input-primary w-full" />
            </div>
            <div className="form-control w-full mb-6">
              <label className="label">
                <span className="label-text">Choose your campaign category</span>
              </label>
              <select onChange={changeHandler} required value={category} name="category" className="select select-primary w-full">
                <option disabled defaultValue>Select</option>
                <option>Education</option>
                <option>Environment</option>
                <option>Family</option>
                <option>Medical</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-control w-full mb-6">
              <label className="label">
                <span className="label-text">Who are you raising for?</span>
              </label>
              <select onChange={changeHandler} required value={raisingFor}  name="raisingFor" className="select select-primary w-full">
                <option disabled defaultValue>Select</option>
                <option>Yourself</option>
                <option>Charity</option>
                <option>Someone else</option>
              </select>
            </div>
          </div>

        <div className="w-full overflow-hidden lg:my-4 lg:px-4 lg:w-1/2 xl:my-2 xl:px-2 xl:w-1/2">
          <div className="form-control w-full mb-6">
            <label className="label">
              <span className="label-text">Campaign Description</span>
            </label>
            <textarea onChange={changeHandler} required  value={campaignDescription}  name="campaignDescription" rows="5" className="textarea textarea-bordered textarea-primary w-full"></textarea>
          </div>

          
          <div className="form-control w-full mb-6">
            <div className="flex flex-col justify-center mb-6 rounded-lg">
              <div className="w-full flex flex-col">
                  <label className="label">
                    <span className="label-text">File Upload</span>
                  </label>
                 {uploaded == false ?<div className="flex items-center justify-center w-full">
                      <label className="cursor-pointer flex flex-col w-full border-2 border-primary border-dashed">
                          <div className="flex flex-row items-center justify-center pt-7">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                                  Attach a file</p>
                          </div>
                          <input required onChange={imageHandler} type="file" accept='image/*' className="opacity-0" />
                      </label>
                  </div>:
                  <div className="alert alert-success shadow-lg">
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span>File uploaded Sucessfully</span>
                    </div>
                  </div>}
              </div>

              <div className="flex justify-center mx-4 items-center mt-4">
              {uploadLoading == true ?  <button className="btn btn-secondary" ><TailSpin color='#cdcdcd' height={20} /></button> :
               <button className="btn btn-secondary" disabled={uploaded} onClick={uploadFiles}>Upload To IPFS</button>}
              </div>
            </div> 
          </div>
        </div>
        <div className="flex w-full justify-center mx-4 items-center mt-4">
          <button className="btn btn-primary" type="submit">Create Campaign</button>
        </div>
      </div>
      </form>}
    </div>
  )
}

export default Form
