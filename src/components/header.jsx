import React, { useState } from 'react'
import logo from '../assets/logo.png'
import plus from '../assets/plus.png'
import garage from '../assets/garage.png'
import simulation from '../assets/simulation.png'

const Header = () => {
    let [menu,setMenu]=useState(false)
  return (
    <div className='header'>
        <div className="menu" >
            <button onClick={()=>{setMenu(!menu)}} style={{rotate:menu ? "45deg" : "0deg",transition:"all .5s"}}>
                <img src={plus} alt="" />
            </button>
        </div>
        {menu && 
        <div className='slideMenu' >
            <button>
                    <img src={garage} alt="" />
            </button>
            <button>
                    <img src={simulation} alt="" />
            </button>
        </div>}

        <div className="logo">
            <img src={logo} alt="" />
        </div>
    </div>
  )
}

export default Header