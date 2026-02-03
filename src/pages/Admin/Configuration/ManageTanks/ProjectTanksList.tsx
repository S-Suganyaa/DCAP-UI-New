import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BreadcrumbBar, Button, AbsReactTable, BUTTONS, Divider, Input, AbsSelect, AbsSearch, ConversationCollapse, CheckboxInput, RadioInput, Label } from "customer_portal-ui-shared";
import * as Icon from 'react-bootstrap-icons';
import ManageTankTemplateList from './ManageTankTemplateList';
import { Modal, Offcanvas } from 'react-bootstrap';
import type { TankDto, SelectOption, ManageTankResponse } from "../../../../Interface/ProjectTank";
import * as tankService from '../../../../service/TankService';
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
    const [actstatus, setActStatusModel] = React.useState<number | undefined>();
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    const [tanks, setTanks] = React.useState<TankDto[]>([]);
    const [filteredTanks, setFilteredTanks] = React.useState<TankDto[]>([]);

    const [imoOptions, setImoOptions] = React.useState<SelectOption[]>([]);
    const [tankTypeOptions, setTankTypeOptions] = React.useState<SelectOption[]>([]);
    const [tankNameOptions, setTankNameOptions] = React.useState<SelectOption[]>([]);
    const [statusOptions, setStatusOptions] = React.useState<SelectOption[]>([]);

    const [tableData, setTableData] = React.useState<any[]>([]);
    const [selectedIMO, setSelectedIMO] = React.useState<string>("");


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
    useEffect(() => {
        loadManageTanks(formData.imo_number || undefined);
    }, [formData.imo_number]);

    const loadManageTanks = async (imo?: string) => {
        setLoading(true);
        try {
            const res = await tankService.getManageTanks({ imo });
            const data = res.data; 

            //setTanks(data.tanks);
           // setFilteredTanks(data.tanks);

            setImoOptions(data.imoNumberOptions);
            setTankTypeOptions(data.tankTypeOptions);
            setTankNameOptions(data.tankNameOptions);
            setStatusOptions(data.tankStatusOptions);
        } catch (e) {
           
        } finally {
            setLoading(false);
        }
    };

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

    const tableRows = filteredTanks.map(t => ({
        tank_name: t.tankName,
        subheader_name: t.subheader,
        vessel_type: t.vesselType,
        vessel_name: t.vesselName,
        imo_number: t.imoNumber,
        tank_type: t.tankType,
        status: t.status ? "Active" : "InActive"
    }));


    return (
        <>
            <div className="filter-section">
                <div className="row">
                    <div className="col-md-2 form-group">
                        <Label name="IMO Number" bold />
                        <AbsSelect
                            mult={false}
                            options={imoOptions.map(o => ({
                                text: o.text,
                                value: o.value
                            }))}
                            selected={formData.imo_number ? [formData.imo_number] : []}
                            placeholder="Select IMO Number"
                            onChange={(selected) => {
                                const imo = selected?.[0] ?? "";
                                setFormData(prev => ({ ...prev, imo_number: imo }));
                                loadManageTanks(imo); 
                            }}
                        />


                    </div>
                    <div className="col-md-2 form-group">
                        <Label name="Select a Tank Type" bold />
                        <AbsSelect
                            mult={false}
                            options={tankTypeOptions}
                            selected={formData.tank_type ? [formData.tank_type] : []}
                            placeholder="Select Tank Type"
                            onChange={(s) =>
                                setFormData(prev => ({ ...prev, tank_type: s?.[0] ?? "" }))
                            }
                        />

                    </div>
                    <div className="col-md-2 form-group">
                        <Label name="Select a Tank Name" bold />
                        <AbsSelect
                            mult={false}
                            options={tankNameOptions.map(o => ({
                                text: o.text,
                                value: o.value
                            }))}
                            selected={formData.tank_name ? [formData.tank_name] : []}
                            placeholder="Select Tank Name"
                            onChange={(s) =>
                                setFormData(prev => ({ ...prev, tank_name: s?.[0] ?? "" }))
                            }
                        />

                    </div>
                    <div className="col-md-2 form-group">
                        <Label name="  Status" bold />
                        <AbsSelect
                            mult={false}
                            options={statusOptions}
                            selected={
                                formData.activation_status === true
                                    ? ["Active"]
                                    : formData.activation_status === false
                                        ? ["InActive"]
                                        : []
                            }
                            placeholder="Select Status"
                            onChange={(s) =>
                                setFormData(prev => ({
                                    ...prev,
                                    activation_status: s?.[0] === "Active"
                                }))
                            }
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
                            data={tableRows}
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