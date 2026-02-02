import React from 'react';
import { BreadcrumbBar, Tab } from "customer_portal-ui-shared";
import ClientList from './Client/ClientList';
import UsersList from './Users/UsersList';
import PermissionList from './Permissions/PermissionList';
// import * as Icon from 'react-bootstrap-icons';
// import ManageDescTemplateList from './ManageDescTemplateList';
// import { Modal, Offcanvas } from 'react-bootstrap';


const AdminOverview: React.FC = () => {
    const [activeTab, setActiveTab] = React.useState<number>(0);

    const handleTabClick = (tabIndex: number) => {
        setActiveTab(tabIndex);
    };

    return (
        <>
            <div className="page-title">
                <BreadcrumbBar
                    pageName="Admin Settings"
                    parentPages={[
                        {
                            name: "ABS Admin",
                            link: ""
                        }
                    ]}>
                </BreadcrumbBar>
            </div>
            <div className="page-content p-4">

                <div className="row">
                    <div className="col-md-12">
                        <div className="nav-vertical">
                            <Tab
                                activeTab={activeTab}
                                onTabChange={handleTabClick}
                                tabData={[
                                    {
                                        content: (
                                            <>
                                                <ClientList />
                                            </>
                                        ),
                                        header: 'Clients'
                                    },
                                    {
                                        content: (
                                            <>
                                                <UsersList />
                                            </>
                                        ),
                                        header: 'Users'
                                    },
                                    {
                                        content: (
                                            <>
                                                <PermissionList />
                                            </>
                                        ),
                                        header: 'Permissions'
                                    }
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </>

    );
};

export default AdminOverview;