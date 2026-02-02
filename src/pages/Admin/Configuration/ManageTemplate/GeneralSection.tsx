import React from 'react';
import {  Button,   BUTTONS, Input,  } from "customer_portal-ui-shared";
import * as Icon from 'react-bootstrap-icons';
import { Modal } from 'react-bootstrap';

const GeneralSection: React.FC = () => {
    type FormData = {
        section_name: string;
        subheader_name: string;
        current_count: string;
        selectable_count: string;
    };
    const [formData, setFormData] = React.useState<FormData>({
        section_name: "",
        subheader_name: "",
        current_count: "",
        selectable_count: "",
    });
    const [deletesection, setDeletesectionModel] = React.useState<boolean>();


    return (
        <>
            <div className="form-area">
                <table className='table table-bordered custom-table'>
                    <thead>
                        <tr>
                            <th>Section Name</th>
                            <th>Subheading</th>
                            <th>Total Conditions</th>
                            <th>Current Count</th>
                            <th>Selectable Count</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <Input
                                    placeholder="Enter Section Name"
                                    value={formData.section_name}
                                    onChange={(e: any) => setFormData({ ...formData, section_name: e.target.value })}
                                />
                            </td>
                            <td>
                                <Input
                                    placeholder="Enter Subheader"
                                    value={formData.subheader_name}
                                    onChange={(e: any) => setFormData({ ...formData, subheader_name: e.target.value })}
                                />
                            </td>
                            <td>
                                0
                            </td>
                            <td>
                                <Input
                                    placeholder="Enter Current Count"
                                    value={formData.current_count}
                                    onChange={(e: any) => setFormData({ ...formData, current_count: e.target.value })}
                                />
                            </td>
                            <td>
                                <Input
                                    placeholder="Enter Selectable Count"
                                    value={formData.selectable_count}
                                    onChange={(e: any) => setFormData({ ...formData, selectable_count: e.target.value })}
                                />
                            </td>
                            
                            <td>
                                <div className='d-flex justify-content-start gap-3'>
                                    <Button variant={BUTTONS.TABLEDOWNLOAD} startIcon={<Icon.Floppy />}></Button>
                                    <Button variant={BUTTONS.TABLEDOWNLOAD} onClick={() => (setDeletesectionModel(true))} startIcon={<Icon.X />}></Button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Pumproom
                            </td>
                            <td>
                                -
                            </td>
                            <td>
                                32
                            </td>
                            <td>
                                22
                            </td>
                            <td>
                                10
                            </td>
                            
                            <td>
                                <div className='d-flex justify-content-start gap-3'>
                                    <Button variant={BUTTONS.TABLEDOWNLOAD} startIcon={<Icon.PencilFill />}></Button>
                                    <Button variant={BUTTONS.TABLEDOWNLOAD} onClick={() => (setDeletesectionModel(true))} startIcon={<Icon.TrashFill />}></Button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
            <Modal show={deletesection} size="lg" centered onHide={() => setDeletesectionModel(false)} animation={false} backdrop="static">
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
                                    Are you sure you want to delete 'Section  A' Grading?

                                </p>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className='gap-3'>
                    <Button variant={BUTTONS.SECONDARY} onClick={() => setDeletesectionModel(false)}>
                        Cancel
                    </Button>
                    <Button variant={BUTTONS.PRIMARY} onClick={() => setDeletesectionModel(false)}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default GeneralSection;