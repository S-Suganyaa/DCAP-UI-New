import React from 'react';
import { BreadcrumbBar, Button, AbsReactTable, BUTTONS, Divider, Input, AbsSelect, AbsSearch, ConversationCollapse, CheckboxInput, RadioInput, Label } from "customer_portal-ui-shared";
import * as Icon from 'react-bootstrap-icons';
import ManageTankTemplateList from './ManageTankTemplateList';
import { Modal, Offcanvas } from 'react-bootstrap';

interface ManageTankRow {
    tank_name: string;
    subheader_name: string;
    vessel_type: string;
    vessel_name: string;
    imo_number: string;
    tank_type: string;
    action?: unknown;
}
type FormData = {
    tank_name: string;
    subheader_name: string;
    vessel_type: string;
    vessel_name: string;
    imo_number: string;
    tank_type: string;
    activation_status: boolean;
    project_name: string
};
const ProjectTankList: React.FC = () => {
    const [val, updateVal] = React.useState<string>("");
    const [value, updateValue] = React.useState<string>("");
    const [searchApplied, updateSearchApplied] = React.useState<string | null>(null);
    const [checked, setChecked] = React.useState<boolean>(false);
    const [open, setOpen] = React.useState<boolean>();
    const [selected, setSelected] = React.useState<number | undefined>();
    const [deleteModel, setDeleteModel] = React.useState<boolean>();
    const [statusModel, setStatusModel] = React.useState<boolean>();
    const [actstatus, setActStatusModel] = React.useState<boolean>();
    const [selectedRows, setSelectedRows] = React.useState([]);

    const [formData, setFormData] = React.useState<FormData>({
        tank_name: "",
        subheader_name: "",
        vessel_type: "",
        imo_number: "",
        vessel_name: "",
        tank_type: "",
        activation_status: false,
        project_name: ""

    });
    const columns = React.useMemo<Array<any>>(
        () => [
            {
                label: "Tank Name",
                accessorKey: "tank_name",
                accessor: "tank_name",
                cell: (info: { getValue: () => any }) => info.getValue(),
            },
            {
                label: "Subheader",
                accessorKey: "subheader_name",
                accessor: "subheader_name",
                cell: (info: { getValue: () => any }) => info.getValue(),

            },
            {
                label: "Vessel Type",
                accessorKey: "vessel_type",
                accessor: "vessel_type",
                cell: (info: { getValue: () => any }) => info.getValue(),
            },
            {
                label: "Vessel Name",
                accessorKey: "vessel_name",
                accessor: "vessel_name",
                cell: (info: { getValue: () => any }) => info.getValue(),
            },
            {
                label: "IMO Number",
                accessorKey: "imo_number",
                accessor: "imo_number",
                cell: (info: { getValue: () => any }) => info.getValue(),
            },
            {
                label: "Tank  Type",
                accessorKey: "tank_type",
                accessor: "tank_type",
                cell: (info: { getValue: () => any }) => info.getValue(),
            },
            {
                label: "Status",
                accessorKey: "status",
                accessor: "status",
                cell: (info: { getValue: () => any }) => info.getValue(),
            },

            {
                label: "Action",
                accessorKey: "action",
                accessor: "action",
                filter: false,
                Cell: ({ row: { original = {} }, cell: { value } }: { row: { original: ManageTankRow }, cell: { value: any } }) => {
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

    const data = React.useMemo<ManageTankRow[]>(
        () => [
            {
                tank_name: "Part A",
                subheader_name: "Anchoring and Mooring",
                vessel_type: "Chain Stopper",
                vessel_name: "Active",
                imo_number: "yes",
                tank_type: "yes"
            },
            {
                tank_name: "Part B",
                subheader_name: "Deck Fitting",
                vessel_type: "Mooring Winches with Foundations",
                vessel_name: "InActive",
                imo_number: "no",
                tank_type: "yes"
            },
            {
                tank_name: "Part C",
                subheader_name: "Deck Piping",
                vessel_type: "Windlasses with Foundations",
                vessel_name: "Active",
                imo_number: "yes",
                tank_type: "yes"
            }
        ],
        []
    );

    return (
        <>
            <div className="filter-section">
                <div className="row">
                    <div className="col-md-2 form-group">
                        <Label name="IMO Number" bold />
                        <AbsSelect mult={false}
                            onChange={(selected: string[] | any) =>
                                setFormData({ ...formData, imo_number: (selected && selected[0]) || "" })
                            }
                            options={[
                                { text: "Bulk Carrier", value: "1" },
                                { text: "Gas Carrier", value: "2" },
                            ]}
                            selected={[formData.imo_number]}
                            placeholder="Select IMO Number"
                        />
                    </div>
                    <div className="col-md-2 form-group">
                        <Label name="Select a Vessel Type" bold />
                        <AbsSelect mult={false}
                            onChange={(selected: string[] | any) =>
                                setFormData({ ...formData, project_name: (selected && selected[0]) || "" })
                            }
                            options={[
                                { text: "Bulk Carrier", value: "1" },
                                { text: "Gas Carrier", value: "2" },
                            ]}
                            selected={[formData.project_name]}
                            placeholder="Select Project Name"
                        />
                    </div>
                    <div className="col-md-2 form-group">
                        <Label name="Select a Tank Type" bold />
                        <AbsSelect mult={false}
                            onChange={(selected: string[] | any) =>
                                setFormData({ ...formData, tank_type: (selected && selected[0]) || "" })
                            }
                            options={[
                                { text: "Bulk Carrier", value: "1" },
                                { text: "Gas Carrier", value: "2" },
                            ]}
                            selected={[formData.tank_type]}
                            placeholder="Select Tank  Type"
                        />
                    </div>

                    <div className="col-md-2 form-group">
                        <Label name="Tank Name" bold />
                        <AbsSelect mult={false}
                            onChange={(selected: string[] | any) =>
                                setFormData({ ...formData, tank_name: (selected && selected[0]) || "" })
                            }
                            options={[
                                { text: "Bulk Carrier", value: "1" },
                                { text: "Gas Carrier", value: "2" },
                            ]}
                            selected={[formData.tank_name]}
                            placeholder="Select Tank  Name"
                        />
                    </div>

                    <div className="col-md-2 form-group">
                        <Label name="  Status" bold />
                        <AbsSelect mult={false}
                            onChange={(selected: string[] | any) =>
                                setFormData({ ...formData, activation_status: (selected && selected[0]) || "" })
                            }
                            options={[
                                { text: "Active", value: "1" },
                                { text: "Inactive", value: "2" },
                            ]}
                            selected={[formData.activation_status]}
                            placeholder="Select   Status"
                        />
                    </div>


                    <div className="col-md-2 form-group align-self-end">
                        <div className="d-flex gap-2">
                            <Button variant={BUTTONS.SECONDARY}>Clear Filter</Button>
                        </div>
                    </div>

                </div>
            </div>

            <div className="grid-container">
                <div className="grid-sidebar">
                    <ManageTankTemplateList />
                </div>
                <div className="grid-content-body">

                    <div className="row">
                        <div className="col-md-8">
                            <h5 className='_600'>  Bulk Carrier - Additional Tank</h5>
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
                            <Button variant={BUTTONS.PRIMARY} onClick={() => { setStatusModel(true) }}>Change Status</Button></div>
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
                            rowSelect
                            maxRowSelect={3}
                            onRowSelected={setSelectedRows}

                        />
                    </div>
                </div>
            </div>

            <Offcanvas show={open} placement={"end"} onHide={() => setOpen(false)} backdrop="static">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Add New Tank</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className="row">
                        <div className="col-md-12 form-group">
                            <Label name="Tank Name" bold />
                            <Input
                                label=""
                                placeholder="Enter Tank Name"
                                value={formData.tank_name}
                                onChange={(e: any) => setFormData({ ...formData, tank_name: e.target.value })}
                            />
                        </div>
                        <div className="col-md-12 form-group">
                            <Label name="Subheader" bold />
                            <Input
                                placeholder="Enter Subheader Name"
                                value={formData.subheader_name}
                                onChange={(e: any) => setFormData({ ...formData, subheader_name: e.target.value })}
                            />
                        </div>
                        <div className="col-md-12 form-group">
                            <Label name="Select a Vessel Type" bold />
                            <AbsSelect mult={false}
                                onChange={(selected: string[] | any) =>
                                    setFormData({ ...formData, vessel_type: (selected && selected[0]) || "" })
                                }
                                options={[
                                    { text: "Bulk Carrier", value: "1" },
                                    { text: "Gas Carrier", value: "2" },
                                ]}
                                selected={[formData.vessel_type]}
                                placeholder="Select a Vessel Type"
                            />
                        </div>

                        <div className="col-md-12">
                            <div className="d-flex align-items-center my-2">
                                <hr className="flex-grow-1 center-divider" />
                                <span className="px-3 text-muted fw-semibold">OR</span>
                                <hr className="flex-grow-1 center-divider" />
                            </div>
                        </div>

                        <div className="col-md-12 form-group">
                            <Label name="Vessel Name" bold />
                            <AbsSelect mult={false}
                                onChange={(selected: string[] | any) =>
                                    setFormData({ ...formData, vessel_name: (selected && selected[0]) || "" })
                                }
                                options={[
                                    { text: "Advantage Love", value: "1" },
                                    { text: "FPSO SERPENTINA", value: "2" },
                                ]}
                                selected={[formData.vessel_name]}
                                placeholder="Select Vessel Name "
                            />
                        </div>

                        <div className="col-md-12 form-group">
                            <Label name="IMO Number" bold />
                            <Input
                                placeholder="Enter IMO Number"
                                value={formData.imo_number}
                                onChange={(e: any) => setFormData({ ...formData, imo_number: e.target.value })}
                            />
                        </div>
                        <div className="col-md-12 form-group">
                            <Label name="Select a Vessel Type" bold />
                            <AbsSelect mult={false}
                                onChange={(selected: string[] | any) =>
                                    setFormData({ ...formData, tank_type: (selected && selected[0]) || "" })
                                }
                                options={[
                                    { text: "Bulk Tank", value: "1" },
                                    { text: "Slop Tank", value: "2" },
                                ]}
                                selected={[formData.tank_type]}
                                placeholder="Select a Tank Type"
                            />
                        </div>
                        <div className="col-md-12 form-group">
                            <Label name="Activation Status" bold />
                            <div className='d-flex justify-contentn-start gap-3'>
                                <RadioInput
                                    label="Active"
                                    checked={selected === 1}
                                    onChange={() => setSelected(1)}
                                />
                                <RadioInput
                                    label="Inactive"
                                    checked={selected === 2}
                                    onChange={() => setSelected(2)}
                                />

                            </div>
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
            <Modal show={statusModel} size="lg" centered onHide={() => setStatusModel(false)} animation={false} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="d-flex justify-content-center align-items-center flex-column">
                                <div className="info-icon-wrapper mb-4">
                                    <Icon.Exclamation size={24} />
                                </div>
                                <p className='_500 tx-14 text-center'>
                                    Are you sure you want to change 'Mooring Winches with Foundations' status?
                                </p>
                                <div className='d-flex jusify-content-center flex-row'>
                                    <RadioInput
                                        label="Active"
                                        checked={actstatus === 1}
                                        onChange={() => setActStatusModel(1)}
                                    />
                                    <RadioInput
                                        label="Inactive"
                                        checked={actstatus === 2}
                                        onChange={() => setActStatusModel(2)}
                                    />
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className='gap-3'>
                    <Button variant={BUTTONS.SECONDARY} onClick={() => setDeleteModel(false)}>
                        No, Cancel
                    </Button>
                    <Button variant={BUTTONS.PRIMARY} onClick={() => setDeleteModel(false)}>
                        Yes, Proceed
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ProjectTankList;