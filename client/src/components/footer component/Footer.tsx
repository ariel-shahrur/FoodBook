import React from 'react'
import './footer.css'
import { footerItem } from '../../interface/typs'
function Footer(props: { footerItems: footerItem[] }) { 
  return (
    <div id='footerDiv'>
      {props.footerItems.map((curr) => {
        return <div key={curr.key} className='footerItemDiv'>
          <a href={curr.hrefStr} >{curr.displayStr}</a>
        </div>
      })}
    </div>
  )
}

export default Footer