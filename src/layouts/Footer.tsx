import React from 'react';
 

const Footer: React.FC = () => {
    return (
        <div className=' '>
           <div className="copyright-footer">
            <p className="text-center mb-0  ">
                <span className="copyright _500 tx-12">© 2026. American Bureau of Shipping. All rights reserved.</span>
                <span className="float-right" id="releaseBuildTime">Ver_1</span>
                <span className="float-right">&nbsp;</span>
                <span className="float-right tx-16" id="releaseVersion">2.1</span>
            </p>
        </div>
        </div>
    );
};
export default Footer;