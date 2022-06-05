
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
const Card = ({data}) => {
  const [description, setDescription] = useState('')
  useEffect(()=>{
    fetch('https://ipfs.infura.io/ipfs/' + data.description)
    .then(res => res.text()).then(data => setDescription(data));
  },[])
  return (
    
    <div className="card w-full bg-primary text-primary-content shadow-xl">
       <Image 
          layout='responsive'
          height={50}
          width={100}
          alt={data.title}
          src={"https://ipfs.infura.io/ipfs/" + data.image} 
        />
      <div className="card-body">
        <div className="card-actions justify-start">
          <div className="badge badge-outline">{data.raisingFor}</div> 
        </div>
        <h2 className="card-title">
        {data.title}
        </h2>
      
        <p className='text-ellipsis--2'>{description}</p>
        <p><span className='font-bold'>Amount: </span> {data.amount} Matic</p>
        <p><span className='font-bold'>Owner: </span> {data.owner.slice(0,12)}...{data.owner.slice(39)}</p>
        <p><span className='font-bold'>Date and Time: </span> {new Date(data.timeStamp * 1000).toLocaleString('en-US')}</p>
        
        <div className="card-actions justify-end mt-8">
          <Link href={'/' + data.address}>
             <button className="btn btn-block btn-secondary">View</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Card
