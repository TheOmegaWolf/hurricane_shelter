import React from 'react';
import FooterStyle from './Styles/Footer.module.css'
import CommonStyle from './Styles/Common.module.css'
const Footer = () => {
    return ( <div className={`${FooterStyle.footer} ${CommonStyle.dflex} ${CommonStyle.alignBoth}`}>Stay Informed. Stay Safe.</div> );
}
 
export default Footer;