import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link, useNavigate } from 'react-router-dom';

const HeaderMenu: React.FC = () => {
    const navigate = useNavigate();

    type SidebarChildItem = {
        id: string;
        name: string;
        to: string;
        navlink: string;
        refresh: boolean;
    };

    type SidebarMenuItem = {
        id: string;
        title: string;
        link: string;
        enabled: boolean;
        sidebarEnabled: boolean;
        megaMenu: boolean;
        refresh: boolean;
        items: SidebarChildItem[];
    };

    const sidebarData: SidebarMenuItem[] = [
        {
            id: "Allprojects",
            title: "Projects",
            link: "/app/Project",
            enabled: true,
            sidebarEnabled: false,
            megaMenu: false,
            refresh: false,
            items: [],
        },
        {
            id: "Activity",
            title: "Recent Activity",
            link: "/",
            enabled: true,
            sidebarEnabled: false,
            megaMenu: false,
            refresh: false,
            items: [],
        },
        {
            id: "ProjectConfiguration",
            title: "Project Configuration",
            link: "",
            enabled: false,
            sidebarEnabled: true,
            megaMenu: false,
            refresh: false,
            items: [
                {
                    id: "ManageTemplate",
                    name: "Manage Templates",
                    to: "/app/Configuration/Managetemplate",
                    navlink: "/app/Configuration/Managetemplate",
                    refresh: false,
                },
                {
                    id: "ManageTanks",
                    name: "Manage Tanks",
                    to: "/app/Configuration/Managetanks",
                    navlink: "/app/Configuration/Managetanks",
                    refresh: false,
                },
                {
                    id: "ManageGrading",
                    name: "Manage ABS Grading",
                    to: "/app/Configuration/Manageabsgrading",
                    navlink: "/app/Configuration/Manageabsgrading",
                    refresh: false,
                },
                {
                    id: "ManageDescription",
                    name: "Manage Description",
                    to: "/app/Configuration/Managedescriptions",
                    navlink: "/app/Configuration/Managedescriptions",
                    refresh: false,
                },
                {
                    id: "ManageExport",
                    name: "Manage Export",
                    to: "",
                    navlink: "",
                    refresh: false,
                },
            ],
        },
        {
            id: "ABSAdmin",
            title: "ABS Admin",
            link: "",
            enabled: false,
            sidebarEnabled: true,
            megaMenu: false,
            refresh: false,
            items: [
                {
                    id: "ClientProfiles",
                    name: "Client Profiles",
                    to: "",
                    navlink: "",
                    refresh: false,
                },
                {
                    id: "ManageABSUsers",
                    name: "Manage ABS Users",
                    to: "",
                    navlink: "",
                    refresh: false,
                },
                {
                    id: "ManagePermission",
                    name: "Manage Permission",
                    to: "",
                    navlink: "",
                    refresh: false,
                }
            ],
        },
    ]

    const menuList = sidebarData.filter((m) => m.enabled || m.sidebarEnabled);

    const handleNavClick = (e: React.MouseEvent, navlink: string) => {
        e.preventDefault();
        if (navlink && navlink !== "#") {
            navigate(navlink);
        }
    };

    return (
        <>
            <div className='top-secondary-menu'>
                <Navbar expand="lg" className='bg-transparent shadow-none' >
                    <Container fluid>
                        <Navbar.Brand href="#" className="d-lg-none">DCAP</Navbar.Brand>
                        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} />
                        <Navbar.Offcanvas
                            id={`offcanvasNavbar-expand-lg`}
                            aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
                            placement="end"
                        >
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`}>
                                    DCAP
                                </Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <div className='secondary-menu d-flex justify-content-start'>
                                    <div className="secondary-menu-nav">
                                        <ul>
                                            {menuList.map((menu: SidebarMenuItem) => {
                                                const hasChildren = menu.items?.length > 0;

                                                return (
                                                    <li
                                                        key={menu.id}
                                                        className={hasChildren ? "nav-item has-child" : "nav-item"}
                                                    >
                                                        {menu.link ? (
                                                            <Link to={menu.link} className="nav-link">
                                                                {menu.title}
                                                            </Link>
                                                        ) : (
                                                            <Nav.Link href={menu.link || "#"}>
                                                                {menu.title}
                                                            </Nav.Link>
                                                        )}

                                                        {/* Dropdown */}
                                                        {hasChildren && (
                                                            <div className="child-dropdown">
                                                                <ul className="child-items">
                                                                    {menu.items.map((child) => (
                                                                        <li key={child.id}>
                                                                            {child.navlink && child.navlink !== "#" ? (
                                                                                <Link
                                                                                    to={child.navlink}
                                                                                    className="child-nav-link"
                                                                                    onClick={(e) => handleNavClick(e, child.navlink)}
                                                                                >
                                                                                    {child.name}
                                                                                </Link>
                                                                            ) : (
                                                                                <Nav.Link
                                                                                    href={child.to || child.navlink || "#"}
                                                                                    className="child-nav-link"
                                                                                >
                                                                                    {child.name}
                                                                                </Nav.Link>
                                                                            )}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </Offcanvas.Body>
                        </Navbar.Offcanvas>
                    </Container>
                </Navbar>
            </div>
        </>
    );
};

export default HeaderMenu;