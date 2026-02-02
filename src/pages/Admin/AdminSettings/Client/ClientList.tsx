import React from 'react';
import { BreadcrumbBar, Button, AbsReactTable, BUTTONS, Divider, Input,TextArea,  AbsSelect, AbsSearch, CheckboxInput, RadioInput, Label } from "customer_portal-ui-shared";
import * as Icon from 'react-bootstrap-icons';
import { Modal, Offcanvas } from 'react-bootstrap';

interface ManageClientRow {
    client_name: string;
    wcn: string | string[];
    no_of_projects: string;
   
    status: string;
    action?: unknown;
}
type FormData = {
    client_name: string;
    wcn: string;
    no_of_projects: string;
    billing_url: string;
    company_name: string;
    company_address: string;
    company_email: string;
    status: string;
    activation_status: boolean;

};

const ClientList: React.FC = () => {
    const [val, updateVal] = React.useState<string>("");
    const [value, updateValue] = React.useState<string>("");
    const [searchApplied, updateSearchApplied] = React.useState<string | null>(null);
    const [checked, setChecked] = React.useState<boolean>(false);
    const [open, setOpen] = React.useState<boolean>();
    const [createclient, setCreateclient] = React.useState<boolean>();
    const [deleteModel, setDeleteModel] = React.useState<boolean>();

    const [selected, setSelected] = React.useState<number | undefined>();
    const [formData, setFormData] = React.useState<FormData>({
        wcn: "", 
        billing_url: "",
        company_name: "",
        company_address: "",
        company_email: "",
 
    });
    const columns = React.useMemo<Array<any>>(
        () => [

            {
                label: "Client Name",
                accessorKey: "client_name",
                accessor: "client_name",
                cell: (info: { getValue: () => any }) => info.getValue(),
            },
            {
                label: "WCN",
                accessorKey: "wcn",
                accessor: "wcn",
                cell: (info: { getValue: () => any }) => {
                    const values = info.getValue();
                    return Array.isArray(values) ? values.join(", ") : values;
                },
            },
            {
                label: "Number of Projects",
                accessorKey: "no_of_projects",
                accessor: "no_of_projects",
                cell: (info: { getValue: () => any }) => info.getValue(),
            },
            // {
            //     label: "Status",
            //     accessorKey: "status",
            //     accessor: "status",
            //     cell: (info: { getValue: () => any }) => info.getValue(),
            // },
            {
                label: "Action",
                accessorKey: "action",
                accessor: "action",
                filter: false,
                Cell: ({ row: { original = {} }, cell: { value } }: { row: { original: ManageClientRow }, cell: { value: any } }) => {
                    return (
                        <div className='d-flex justify-content-start gap-3'>
                            <Button variant={BUTTONS.TABLEDOWNLOAD} startIcon={<Icon.PencilFill />}></Button>
                            <Button variant={BUTTONS.TABLEDOWNLOAD} onClick={() => (setDeleteModel(true))} startIcon={<Icon.TrashFill />}></Button>
                        </div>
                    );
                }
            },
        ],
        []
    );

    const data = React.useMemo<ManageClientRow[]>(
        () => [
            {

                client_name: "ABS",
                wcn: "1000",
                no_of_projects: "299",
                status: "Active"
            },
            {

                client_name: "ABS COnsulting",
                wcn: "123456",
                no_of_projects: "125",
                status: "InActive"
            },
            {
                client_name: "ABS Test",
                wcn: "1234566",
                no_of_projects: "10",
                status: "Active"
            }
        ],
        []
    );

    return (
        <>
            <div className="row">
                <div className="col-md-8">
                    <h5 className='_600'> Clients</h5>
                </div>
                <div className="col-md-6 mb-3 mt-2">
                    <div className="d-flex justify-content-start align-items-center gap-2">
                        <AbsSearch
                            handleClear={() => {
                                updateVal("");
                                updateSearchApplied(null);
                            }}
                            value={val}
                            handleChange={(e: any) => updateVal(e.target.value)}
                            handleSearch={() => {
                                updateSearchApplied(val === "" ? null : val);
                            }}
                            placeholder="Search"
                            searchApplied={searchApplied !== null}
                        />
                        <a href="#" className='text-link text-nowrap _500'>Clear Filter</a>
                    </div>
                </div>
                <div className="col-md-6 d-flex justify-content-end">
                    <div>
                        <Button variant={BUTTONS.PRIMARY} onClick={() => { setCreateclient(true) }}>Add New Cllient</Button></div>
                </div>
            </div>
            <div className="custom-react-table">
                <AbsReactTable
                    columns={columns}
                    data={data}
                    pagination={true}
                    expand={false}
                    allowColumnsShowHide={false}
                    shadow={true}

                />
            </div>
            <Offcanvas show={createclient} placement={"end"} onHide={() => setCreateclient(false)} backdrop="static">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Add Client Profile</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className="row">
                        <div className="col-md-12 form-group">
                            <Label name="WCN" bold required />
                            <Input
                                label=""
                                placeholder="Enter WCN"
                                value={formData.wcn}
                                onChange={(e: any) => setFormData({ ...formData, wcn: e.target.value })}
                            />
                        </div>
                        <div className="col-md-12 form-group">
                            <Label name="Company Name" bold required />
                            <Input
                                placeholder="Enter Company Name"
                                value={formData.company_name}
                                onChange={(e: any) => setFormData({ ...formData, company_name: e.target.value })}
                            />
                        </div>
                        <div className="col-md-12 form-group">
                            <Label name="Company Address" bold required />
                           <TextArea
                                placeholder="Enter Company Address"
                                value={formData.company_email}
                                maxLength={120}
                                onChange={(e: any) => setFormData({ ...formData, company_email: e.target.value })}
                            />
                        </div>
                        <div className="col-md-12 form-group">
                            <Label name="Company Billing E-mail" bold />
                  
                            <Input
                                placeholder="Enter Company Billing Email"
                                value={formData.company_email}
                                
                                onChange={(e: any) => setFormData({ ...formData, company_email: e.target.value })}
                            />
                        </div>

                        <div className="col-md-12 form-group">
                            <Label name="Company Billing System URL" bold />
                            <Input
                                placeholder="Enter Company Billing System URL"
                                value={formData.billing_url}
                                onChange={(e: any) => setFormData({ ...formData, billing_url: e.target.value })}
                            />
                        </div>


                        <div className="col-md-12 form-group">
                            <Divider className="divider-1" />
                        </div>
                        <div className="col-md-12 form-group">
                            <div className="d-flex gap-2">
                                <Button variant={BUTTONS.PRIMARY}>Create</Button>
                                <Button variant={BUTTONS.SECONDARY}>Cancel</Button>
                            </div>
                        </div>

                    </div>
                </Offcanvas.Body>
            </Offcanvas>
               <Modal show={deleteModel} size="lg" centered onHide={() => setDeleteModel(false)} animation={false} backdrop="static">
                            <Modal.Header closeButton>
                                <Modal.Title>Delete Grading</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="d-flex justify-content-center align-items-center flex-column">
                                            <div className="delete-icon-wrapper mb-4">
                                                <Icon.Trash size={24} />
                                            </div>
                                            <p className='_500 tx-14'>
                                                Are you sure you want to delete 'Mooring Winches with Foundations' Grading?
            
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Modal.Body>                
                            <Modal.Footer className='gap-3'>
                                <Button variant={BUTTONS.SECONDARY} onClick={() => setDeleteModel(false)}>
                                    Cancel
                                </Button>
                                <Button variant={BUTTONS.PRIMARY} onClick={() => setDeleteModel(false)}>
                                    Save Changes
                                </Button>
                            </Modal.Footer>
                        </Modal>
        </>

    );
};

export default ClientList;