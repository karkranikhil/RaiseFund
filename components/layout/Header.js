import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link';
import Wallet from '../Wallet'
const Header = () => {
  const Router = useRouter();
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), [])

  if (!mounted) return null
  return (
    <div>
      <div className="navbar bg-base-100">
  <div className="navbar-start">
    <div className="dropdown">
      <label tabIndex="0" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
      </label>
      <ul tabIndex="0" className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
      <li>
          <Link passHref href={'/'}>
            <span className={`${Router.pathname == "/" && 'btn'}`}>Campaigns</span>
          </Link>
        </li>
        <li>
          <Link passHref href={'/createcampaign'}>
            <span className={`${Router.pathname == "/createcampaign" && 'btn'}`}>Create Campaign</span>
          </Link>
        </li>
        <li>
          <Link passHref href={'/dashboard'}>
            <span className={`${Router.pathname == "/dashboard" && 'btn'}`}>Dashboard</span>
          </Link>
        </li>
      </ul>
      
    </div>
    <a className="btn btn-ghost normal-case text-xl">RaiseFund</a>
  </div>
  <div className="navbar-center hidden lg:flex">
    <div className="menu menu-horizontal p-0">
          

          <Link passHref href={'/'} className="link cursor-pointer">
            <a className={`mx-4 ${Router.pathname == "/" && 'border-primary border-b-4'}`}>Campaigns</a>
          </Link>
          <Link passHref href={'/createcampaign'}>
            <a className={`mx-4 ${Router.pathname == "/createcampaign" && 'border-primary border-b-4'}`}>Create Campaign</a>
          </Link>
          <Link passHref href={'/dashboard'}>
            <a className={`mx-4 ${Router.pathname == "/dashboard" && 'border-primary border-b-4'}`}>Dashboard</a>
          </Link>
    </div>
  </div>
  <div className="navbar-end">
    <ul className="menu menu-horizontal px-3">
      <li>
        <Wallet/>
      </li>
      <li tabIndex="0">
        <a>
          Theme
          <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
        </a>
        <ul className="p-2 bg-base-100">
          <li onClick={() => setTheme('light')}><a>Light</a></li>
          <li onClick={() => setTheme('aqua')}><a>Aqua 2</a></li>
          <li onClick={() => setTheme('night')}><a>Night</a></li>
          <li onClick={() => setTheme('coffee')}><a>Coffee</a></li>
        </ul>
      </li>
    </ul>
  </div>
</div>
      
    </div>
  )
}

export default Header
