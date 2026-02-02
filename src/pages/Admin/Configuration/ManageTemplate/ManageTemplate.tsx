import React from 'react';
import { BreadcrumbBar, Button, Tab,  BUTTONS, Input, CheckboxInput, Label, AbsSelect, } from "customer_portal-ui-shared";
import * as Icon from 'react-bootstrap-icons';
import { Modal } from 'react-bootstrap';
import GeneralSection from './GeneralSection';
import TankSection from './TankSection';

const ManageTemplate: React.FC = () => {
    type FormData = {
        sequence_number: string;
        part_name: string;
        vessel_type: string;
    };
    const [formData, setFormData] = React.useState<FormData>({
        sequence_number: "",
        part_name: "",
        vessel_type: "",
    });
    const [checked, setChecked] = React.useState();
    const [deletepart, setDeletepartModel] = React.useState<boolean>();
    const [activeTab, setActiveTab] = React.useState<number>(0);

    const handleTabClick = (tabIndex: number) => {
        setActiveTab(tabIndex);
    };
    return (
        <>
            <div className="page-title">
                <BreadcrumbBar
                    pageName="Manage Template"
                    parentPages={[
                        {
                            name: "Project Configuration",
                            link: ""
                        }
                    ]}>
                </BreadcrumbBar>
            </div>
            <div className="page-content p-4">
                <div className="content-body">
                    <div className='section-header'>
                        <h5 className='form-title'>Part  Configuration</h5>
                        {/* <Button variant={BUTTONS.PRIMARY} onClick={() => { "" }}>Add New Section</Button> */}
                    </div>
                    <div className="row">
                        <div className="col-md-4 form-group">
                            <Label name="Vessel Type" bold />
                            <AbsSelect mult={false}
                                onChange={(selected: string[] | any) =>
                                    setFormData({ ...formData, vessel_type: (selected && selected[0]) || "" })
                                }
                                options={[
                                    { text: "Bulk Carrier", value: "1" },
                                    { text: "Gas Carrier", value: "2" },
                                    { text: "Chemical Carrier", value: "3" },
                                    { text: "Oil Carrier", value: "3" },
                                ]}
                                selected={[formData.vessel_type]}
                                placeholder="Select a Vessel Type"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card mb-3">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h5 className='form-title mb-0'>Manage Parts</h5>
                                    <Button variant={BUTTONS.PRIMARY} onClick={() => { "" }}>Add New Part</Button>
                                </div>
                                <div className="card-body">

                                    <div className="form-area">
                                        <table className='table table-bordered custom-table'>
                                            <thead>
                                                <tr>
                                                    <th>Sequence Number</th>
                                                    <th>Part Name</th>
                                                    <th>Active</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <Input
                                                            placeholder="Enter Sequence Name"
                                                            value={formData.sequence_number}
                                                            onChange={(e: any) => setFormData({ ...formData, sequence_number: e.target.value })}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Input
                                                            placeholder="Enter Part Name"
                                                            value={formData.part_name}
                                                            onChange={(e: any) => setFormData({ ...formData, part_name: e.target.value })}
                                                        />
                                                    </td>
                                                    <td>
                                                        <CheckboxInput label=" " checked={checked} onChange={setChecked} />
                                                    </td>
                                                    <td>
                                                        <div className='d-flex justify-content-start gap-3'>
                                                            <Button variant={BUTTONS.TABLEDOWNLOAD} startIcon={<Icon.Floppy />}></Button>
                                                            <Button variant={BUTTONS.TABLEDOWNLOAD} onClick={() => (setDeletepartModel(true))} startIcon={<Icon.X />}></Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        1
                                                    </td>
                                                    <td>
                                                        Part A
                                                    </td>
                                                    <td>
                                                        <CheckboxInput label=" " checked={checked} onChange={setChecked} />
                                                    </td>
                                                    <td>
                                                        <div className='d-flex justify-content-start gap-3'>
                                                            <Button variant={BUTTONS.TABLEDOWNLOAD} startIcon={<Icon.PencilFill />}></Button>
                                                            <Button variant={BUTTONS.TABLEDOWNLOAD} onClick={() => (setDeletepartModel(true))} startIcon={<Icon.TrashFill />}></Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="content-body">
                    <div className='section-header'>
                        <h5 className='form-title'>Manage Sections</h5>

                    </div>
                    <div className="row">

                        <div className="col-md-4 form-group">
                            <Label name="Select Part" bold />
                            <AbsSelect mult={false}
                                onChange={(selected: string[] | any) =>
                                    setFormData({ ...formData, part_name: (selected && selected[0]) || "" })
                                }
                                options={[
                                    { text: "Bulk Carrier", value: "1" },
                                    { text: "Gas Carrier", value: "2" },
                                    { text: "Chemical Carrier", value: "3" },
                                    { text: "Oil Carrier", value: "3" },
                                ]}
                                selected={[formData.part_name]}
                                placeholder="Select a Part"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                            <div className="card mb-3">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h5 className='form-title mb-0'> Part A</h5>
                                    {activeTab === 0 && (
                                        <Button variant={BUTTONS.PRIMARY} onClick={() => {}}>Add New Section</Button>
                                    )}
                                </div>
                                <div className="card-body">
                                    <Tab
                                        activeTab={activeTab}
                                        onTabChange={handleTabClick}
                                        tabData={[
                                            {
                                                content: (
                                                    <>
                                                        <GeneralSection />

                                                    </>
                                                ),
                                                header: 'General '
                                            },
                                            {
                                                content: (
                                                    <>
                                                        <TankSection />
                                                    </>
                                                ),
                                                header: 'Tank Section'
                                            }
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <Modal show={deletepart} size="lg" centered onHide={() => setDeletepartModel(false)} animation={false} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Delete Tank</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="d-flex justify-content-center align-items-center flex-column">
                                <div className="delete-icon-wrapper mb-4">
                                    <Icon.Trash size={24} />
                                </div>
                                <p className='_500 tx-14'>
                                    Are you sure you want to delete 'Part A' Grading?

                                </p>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className='gap-3'>
                    <Button variant={BUTTONS.SECONDARY} onClick={() => setDeletepartModel(false)}>
                        Cancel
                    </Button>
                    <Button variant={BUTTONS.PRIMARY} onClick={() => setDeletepartModel(false)}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ManageTemplate;