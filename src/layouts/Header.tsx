import React from 'react';
import ABSLogo from '../assets/images/ABSLogoBlue.svg';
import Dropdown from 'react-bootstrap/esm/Dropdown';
import styled from 'styled-components'
import Navbar from 'react-bootstrap/esm/Navbar';
import { NavItem, NavLink } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { MsalContext, type IMsalContext } from '@azure/msal-react';

const Header: React.FC = () => {
    const msalContext = React.useContext(MsalContext);

    async function handleLogout(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, value?: IMsalContext | null): Promise<void> {
        e.preventDefault();
        if (!value || !(value as any).instance) return;
        const instance = (value as any).instance;
        try {
            if (typeof instance.logoutRedirect === 'function') {
                await instance.logoutRedirect();
            } else if (typeof instance.logoutPopup === 'function') {
                await instance.logoutPopup();
            } else {
                console.warn('MSAL instance has no logout method.');
            }
        } catch (err) {
            console.error('Logout failed', err);
        }
    }

    return (
        <>
            <StyledToBar light expand='lg' fixed='top' className='top-nav-bar'>

                <Navbar.Collapse id="responsive-navbar-nav">
                    <NavItem className='top-nav-item'>
                        <div className='w-100 row d-flex'>
                            <div className="abs-logo-container">
                                <div className="img-logo  ">
                                    <img src={ABSLogo} alt="DCAP Logo" height="50" className="login-logo" />
                                </div>
                            </div>
                        </div>
                    </NavItem>
                    <div className='d-flex ml-auto align-items-center'>
                        <NavItem className='top-nav-item ml-auto'>
                            <Dropdown align="end">
                                <Dropdown.Toggle id="dropdown-basic" variant='secondary' className='btn btn-transparent'>
                                    <div className='d-flex align-items-center '>
                                        <div className='action-icons' >
                                            <Icon.PersonCircle size={20} /></div>
                                        <div className='d-md-inline d-inline pl-2 pr-3'>OXPABS</div>

                                    </div>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item href="#/action-1">Change Password</Dropdown.Item>
                                    <Dropdown.Item href="#/action-2">My Profile</Dropdown.Item>
                                    <Dropdown.Item href="#/action-3">Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </NavItem>
                        <NavItem className='top-nav-item ml-auto'>

                            <a className='nav-link  '
                                aria-current='false'
                                onClick={(e) => handleLogout(e, msalContext)}
                            >
                                <div className='d-flex align-items-center '>
                                    <div className='action-icons' >

                                        <Icon.BoxArrowRight  size={20} /></div>
                                    <div className='d-md-inline d-inline pl-2'>Logout</div>

                                </div>
                            </a>

                        </NavItem>
                    </div>


                </Navbar.Collapse>

            </StyledToBar>

        </>
    );
};
export default Header;
const StyledToBar = styled(Navbar)`
  background-color: #002a4e;
  color: #fff;
  margin: 0px !important;
  .nav-item {
    & .nav-link {
      color: #fff !important;
    }
  }
  .abs-logo-container {
    
    background-size: contain;
    height: 64px;
    width: 150px;
    background-repeat: no-repeat;
    position: relative;
    background-position: 0 0;
  }`;