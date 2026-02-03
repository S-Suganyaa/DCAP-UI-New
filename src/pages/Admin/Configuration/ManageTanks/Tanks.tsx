import React from 'react';
import { BreadcrumbBar, Button, Tab, } from "customer_portal-ui-shared";
import ManageTankList from './ManageTankList';
import ProjectTankList from './ProjectTanksList';


const Tanks: React.FC = () => {
    const [open, setOpen] = React.useState<boolean>();
    const [activeTab, setActiveTab] = React.useState<number>(0);

    const handleTabClick = (tabIndex: number) => {
        setActiveTab(tabIndex);
    };

    return (
        <>
            <div className="page-title">
                <BreadcrumbBar
                    pageName="Manage Tank"
                    parentPages={[
                        {
                            name: "Project Configuration",
                            link: ""
                        }
                    ]}>
                    {/*<Button onClick={() => (setOpen(true))}> Add New Tank</Button>*/}
                </BreadcrumbBar>
            </div>
            <div className="page-content p-4">
                <div className="row">
                    <div className="col-md-12">
                        <Tab
                            activeTab={activeTab}
                            onTabChange={handleTabClick}
                            tabData={[
                                {
                                    content: (
                                        <>
                                            <ProjectTankList />

                                        </>
                                    ),
                                    header: 'Project Tanks'
                                },
                                {
                                    content: (
                                        <>
                                            <ManageTankList />
                                        </>
                                    ),
                                    header: 'Master Tanks'
                                }
                            ]}
                        />
                    </div>
                </div>

            </div>
        </>
    );
};

export default Tanks;