import React from 'react';
import { BreadcrumbBar, Button, AbsReactTable, BUTTONS, Divider, Input, AbsSelect, AbsSearch, CheckboxInput, RadioInput, Label } from "customer_portal-ui-shared";
import * as Icon from 'react-bootstrap-icons';
import ManageDescTemplateList from './ManageDescTemplateList';
import { Modal, Offcanvas } from 'react-bootstrap';

interface ManageUserRow {
    first_name: string;
    last_name: string | string[];
    email: string;
    user_role: string;
    status: string;
    phone: number;
    action?: unknown;
}
type FormData = {
    first_name: string;
    last_name: string | string[];
    email: string;
    user_role: string;
    company: string;
    time_zone: string;
    phone: number;
    action?: unknown;

};
const UsersList: React.FC = () => {
    const [val, updateVal] = React.useState<string>("");
    const [value, updateValue] = React.useState<string>("");
    const [searchApplied, updateSearchApplied] = React.useState<string | null>(null);
    const [checked, setChecked] = React.useState<boolean>(false);
    const [open, setOpen] = React.useState<boolean>();
    const [deleteModel, setDeleteModel] = React.useState<boolean>();
    const [createuser, setCreateuser] = React.useState<boolean>();

    const [selected, setSelected] = React.useState<number | undefined>();
    const [formData, setFormData] = React.useState<FormData>({
        first_name: "",
        last_name: "",
        email: "",
        user_role: "",
        time_zone:"",
        phone: 0,
        company:"",
        
 
    });
    const columns = React.useMemo<Array<any>>(
        () => [

            {
                label: "First Name",
                accessorKey: "first_name",
                accessor: "first_name",
                cell: (info: { getValue: () => any }) => info.getValue(),
            },
            {
                label: "Last Name",
                accessorKey: "last_name",
                accessor: "last_name",
                cell: (info: { getValue: () => any }) => {
                    const values = info.getValue();
                    return Array.isArray(values) ? values.join(", ") : values;
                },
            },
            {
                label: "Email",
                accessorKey: "email",
                accessor: "email",
                cell: (info: { getValue: () => any }) => info.getValue(),
            },
            {
                label: "User Role",
                accessorKey: "user_role",
                accessor: "user_role",
                cell: (info: { getValue: () => any }) => info.getValue(),
            },
            {
                label: "Action",
                accessorKey: "action",
                accessor: "action",
                filter: false,
                Cell: ({ row: { original = {} }, cell: { value } }: { row: { original: ManageUserRow }, cell: { value: any } }) => {
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

    const data = React.useMemo<ManageUserRow[]>(
        () => [
            {

                first_name: "Barbara ",
                last_name: "Mosteller",
                email: "barbaraamosteller@domain.com",
                user_role: "CAP User",
                status: "Active"
            },
            {

                first_name: "Tracy ",
                last_name: "Knapp",
                email: "tracyhknapp@domain.com",
                user_role: "CAP User",
                status: "InActive"
            },
            {
                first_name: "Charles  C",
                last_name: "Labounty",
                email: "charlesclabounty@domain.com",
                user_role: "CAP User",
                status: "Active"
            }
        ],
        []
    );

    return (
        <>
            <div className="row">
                <div className="col-md-8">
                    <h5 className='_600'> User List</h5>
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
                        <Button variant={BUTTONS.PRIMARY} onClick={() => { setCreateuser(true) }}>Add New User</Button></div>
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
            <Offcanvas show={createuser} placement={"end"} onHide={() => setCreateuser(false)} backdrop="static">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Add Client Profile</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className="row">
                        <div className="col-md-12 form-group">
                            <Label name="First Name" bold required />
                            <Input
                                label=""
                                placeholder="Enter First Name"
                                value={formData.first_name}
                                onChange={(e: any) => setFormData({ ...formData, first_name: e.target.value })}
                            />
                        </div>
                        <div className="col-md-12 form-group">
                            <Label name="Last Name" bold required />
                            <Input
                                placeholder="Enter Last Name"
                                value={formData.last_name}
                                onChange={(e: any) => setFormData({ ...formData, last_name: e.target.value })}
                            />
                        </div>
                        <div className="col-md-12 form-group">
                            <Label name="Select Time Zone" bold required />
                            <AbsSelect mult={false}
                                onChange={(selected: string[] | any) =>
                                    setFormData({ ...formData, time_zone: (selected && selected[0]) || "" })
                                }
                                options={[
                                    { text: "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi", value: "1" },
                                    { text: "(UTC+05:00) Ekaterinburg", value: "2" },
                                ]}
                                selected={[formData.time_zone]}
                                placeholder="Select TIme Zone "
                            />
                        </div>
                        <div className="col-md-12 form-group">
                            <Label name="Phone" bold   />
                            <Input
                                placeholder="Enter Phone"
                                value={String(formData.phone)}
                                onChange={(e: any) => setFormData({ ...formData, phone: Number(e.target.value) })}
                            />
                        </div>
                        <div className="col-md-12 form-group">
                            <Label name="E-mail" bold required />

                            <Input
                                placeholder="Enter Email"
                                value={formData.email}

                                onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="col-md-12 form-group">
                            <Label name="Company " bold />
                            <Input
                                placeholder="Enter Company "
                                value={formData.company}
                                onChange={(e: any) => setFormData({ ...formData, company: e.target.value })}
                            />
                        </div>
                        <div className="col-md-12 form-group">
                            <Label name="User Role " bold />
                             <AbsSelect mult={false}
                                onChange={(selected: string[] | any) =>
                                    setFormData({ ...formData, user_role: (selected && selected[0]) || "" })
                                }
                                options={[
                                    { text: "CAP User", value: "1" },
                                    { text: "Contributor", value: "2" },
                                    { text: "Admin", value: "2" },
                                ]}
                                selected={[formData.user_role]}
                                placeholder="Select User Role "
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
                    <Modal.Title>Delete User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="d-flex justify-content-center align-items-center flex-column">
                                <div className="delete-icon-wrapper mb-4">
                                    <Icon.Trash size={24} />
                                </div>
                                <p className='_500 tx-14'>
                                    Are you sure you want to delete 'Barbara Mosteller' User?

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

export default UsersList;