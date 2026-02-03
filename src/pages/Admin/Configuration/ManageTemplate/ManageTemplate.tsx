import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BreadcrumbBar, Button, Tab, BUTTONS, Input, CheckboxInput, Label, AbsSelect, } from "customer_portal-ui-shared";
import * as Icon from 'react-bootstrap-icons';
import { Modal } from 'react-bootstrap';
import GeneralSection from './GeneralSection';
import TankSection from './TankSection';
import * as reportConfigService from '../../../../service/ReportConfigService';
import * as gradingService from '../../../../service/GradingService';

type FormData = {
    vesselTypeId: number | "";
    partId: number | "";
};
const ManageTemplate: React.FC = () => {

    const [formData, setFormData] = useState<FormData>({
        vesselTypeId: "",
        partId: ""
    });
    type SelectOption = {
        text: string;
        value: number | string;  // Allow both number and string (for GUID)
    };

    const [parts, setParts] = useState<any[]>([]);
    const [normalSections, setNormalSections] = useState<any[]>([]);
    const [tankSections, setTankSections] = useState<any[]>([]);
    const [deleteModal, setDeleteModal] = useState(false);
    const [partOptions, setPartOptions] = useState<SelectOption[]>([]);
    const [deletepart, setDeletepartModel] = React.useState<boolean>();
    const [activeTab, setActiveTab] = React.useState<number>(0);
    const [vesselOptions, setVesselOptions] = useState<SelectOption[]>([]);
    const [isLoadingParts, setIsLoadingParts] = useState(false);
    const [showAddRow, setShowAddRow] = useState(false);
    const [editPartId, setEditPartId] = useState<number | null>(null);
    const [editPart, setEditPart] = useState<any>(null);
    const [deletePartId, setDeletePartId] = useState<number | null>(null);
    const [selectedPartName, setSelectedPartName] = useState<string>("");
    const [selectedSequenceNo, setSelectedSequenceNo] = useState<string>("");
    const [selectedPartId, setSelectedPartId] = useState<number | null>(null);
    const [deletePartData, setDeletePartData] = useState<any>(null);

    const [newPart, setNewPart] = useState({
        sequenceNo: "",
        partName: "",
        isActive: true
    });
    const [error, setError] = React.useState<boolean>();
    const handleTabClick = (tabIndex: number) => {
        setActiveTab(tabIndex);
    };

    useEffect(() => {
        gradingService.getVesselType().then(res => {
            setVesselOptions(
                res.data.data.map((v: any) => ({
                    text: v.vesselType,
                    value: v.id
                }))
            );
        });
    }, []);

    const onVesselTypeChange = async (vesselTypeId: number) => {
        if (!vesselTypeId) return;

        setIsLoadingParts(true);
        setParts([]);
        setShowAddRow(false);

        try {
            const res = await reportConfigService.getReportPartsByVesselType(vesselTypeId);

            setParts(res.data ?? []);
            const partOptions = res.data.map(p => ({
                text: p.partName,
                value: p.partId
            }));

            setPartOptions(partOptions);

        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingParts(false);
        }
    };

    const onEditClick = (part: any) => {
        setEditPartId(part.partId);
        setShowAddRow(false);
        setEditPart({ ...part });
    };

    const saveNewPart = async () => {

        if (!formData.vesselTypeId) {
            setError(true);
            return;
        }

        const payload = {
            reportParts: [{
                sequenceNo: Number(newPart.sequenceNo),
                vesselTypeId: formData.vesselTypeId,
                partName: newPart.partName,
                isActive: newPart.isActive,
                vesselTypePartMappingId: 0
            }]
        };

        await reportConfigService.saveReportTemplateConfig(
            Number(formData.vesselTypeId),
            payload
        );

        setShowAddRow(false);
        setNewPart({ sequenceNo: "", partName: "", isActive: true });
        onVesselTypeChange(Number(formData.vesselTypeId));
    };

    const updatePart = async () => {
        if (!editPart) return;

        const payload = {
            reportParts: [{
                vesselTypePartMappingId: editPart.partId,
                vesselTypeId: Number(formData.vesselTypeId),
                partName: editPart.partName,
                sequenceNo: Number(editPart.sequenceNo),
                isActive: editPart.isActive,
                isDeleted: false
            }]
        };

        await reportConfigService.saveReportTemplateConfig(
            Number(formData.vesselTypeId),
            payload
        );

        setEditPartId(null);
        onVesselTypeChange(Number(formData.vesselTypeId));
    };
    const deletePart = async () => {
        if (!deletePartData || !formData.vesselTypeId) return;

        const payload = {
            reportParts: [
                {
                    vesselTypePartMappingId: deletePartData.vesselTypePartMappingId,
                    vesselTypeId: Number(formData.vesselTypeId),
                    partName: deletePartData.partName,
                    sequenceNo: Number(deletePartData.sequenceNo),
                    isActive: deletePartData.isActive,
                    isDeleted: true
                }
            ]
        };

        try {
            await reportConfigService.saveReportTemplateConfig(
                Number(formData.vesselTypeId),
                payload
            );

            setDeletepartModel(false);
            setDeletePartData(null);
            onVesselTypeChange(Number(formData.vesselTypeId));
        } catch (err) {
            console.error("Delete Part Error", err);
        }
    };

    const onPartChange = async (partId: number) => {
        setFormData(prev => ({ ...prev, partId }));

        try {
            const res =
                await reportConfigService.getSectionNamesByPartId(
                    Number(formData.vesselTypeId),
                    partId
                );

            //  setNormalSections(res.data.normalSections ?? []);
            const mappedSections = (res.data.normalSections ?? []).map((s: any) => ({
                id: s.sectionId,
                section_name: s.sectionName,
                subheader_name: s.subHeader ?? "",
                current_count: Number(s.placeholderCount),
                selectable_count: Number(s.fileNameCount)
            }));

            setNormalSections(mappedSections);

            setTankSections(res.data.tanksSections ?? []);
            // optional
            // setSubSections(res.data.subSections ?? []);
        } catch (err) {
            console.error("Get sections failed", err);
        }
    };

    const refreshTankSections = async () => {
        if (!formData.vesselTypeId || !formData.partId) return;

        try {
            const res =
                await reportConfigService.getSectionNamesByPartId(
                    Number(formData.vesselTypeId),
                    Number(formData.partId)
                );

            setTankSections(res.data.tanksSections ?? []);


            const mapped = (res.data.normalSections ?? []).map((s: any) => ({
                id: s.sectionId,
                section_name: s.sectionName,
                subheader_name: s.subHeader ?? "",
                current_count: Number(s.placeholderCount),
                selectable_count: Number(s.fileNameCount)
            }));

            setNormalSections(mapped);

        } catch (err) {
            console.error("Refresh tank sections failed", err);
        }
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
                            <AbsSelect
                                mult={false}
                                options={vesselOptions}
                                selected={
                                    formData.vesselTypeId
                                        ? [String(formData.vesselTypeId)]
                                        : []
                                }
                                onChange={(selected: any) => {
                                    if (!selected || !selected.length) return;

                                    const id = Number(selected[0]);
                                    if (isNaN(id)) return;

                                    setFormData(prev => ({ ...prev, vesselTypeId: id }));
                                    onVesselTypeChange(id);
                                }}
                                placeholder="Select a Vessel Type"
                            />
                            {(error && (![formData.vesselTypeId] || formData.vesselTypeId == "")) ?
                                <div><label style={{ color: 'red' }}>Please Select VesselType</label></div> :
                                <></>
                            }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card mb-3">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h5 className='form-title mb-0'>Manage Parts</h5>
                                    <Button variant={BUTTONS.PRIMARY} onClick={() => {
                                        setShowAddRow(true);
                                        setEditPartId(null); // IMPORTANT
                                    }}                                    >
                                        Add New Part
                                    </Button>
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
                                            {!showAddRow && parts.length === 0 && formData.vesselTypeId && (
                                                <tr>
                                                    <td colSpan={4} className="text-center">
                                                        No records found
                                                    </td>
                                                </tr>
                                            )}

                                            <tbody>
                                                {/* ================= ADD NEW PART ROW ================= */}
                                                {showAddRow && (
                                                    <tr>
                                                        <td>
                                                            {/*<Input*/}
                                                            {/*    value={newPart.sequenceNo}*/}
                                                            {/*    onChange={(v: string) =>*/}
                                                            {/*        setNewPart(p => ({ ...p, sequenceNo: v }))*/}
                                                            {/*    }*/}
                                                            {/*/>*/}

                                                        </td>

                                                        <td>
                                                            <Input
                                                                value={newPart.partName}
                                                                onChange={(v: string) =>
                                                                    setNewPart(p => ({ ...p, partName: v }))
                                                                }
                                                            />
                                                        </td>

                                                        <td>
                                                            <CheckboxInput
                                                                label=" "
                                                                checked={newPart.isActive}
                                                                onChange={(v: boolean) =>
                                                                    setNewPart(p => ({ ...p, isActive: v }))
                                                                }
                                                            />
                                                        </td>

                                                        <td>
                                                            <Button onClick={saveNewPart}>Save</Button>
                                                            <Button onClick={() => setShowAddRow(false)}>Cancel</Button>
                                                        </td>
                                                    </tr>
                                                )}


                                                {/* ================= EXISTING PARTS ================= */}
                                                {parts.map(part =>
                                                    editPartId === part.partId ? (
                                                        <tr key={part.partId}>
                                                            <td>{editPart.sequenceNo}</td>

                                                            <td>
                                                                <Input
                                                                    value={editPart.partName}
                                                                    onChange={(v: string) =>
                                                                        setEditPart({ ...editPart, partName: v })
                                                                    }
                                                                />
                                                            </td>

                                                            <td>
                                                                <CheckboxInput
                                                                    label=" "
                                                                    checked={editPart.isActive}
                                                                    onChange={(v: boolean) =>
                                                                        setEditPart({ ...editPart, isActive: v })
                                                                    }
                                                                />
                                                            </td>

                                                            <td>
                                                                <Button onClick={updatePart}>Update</Button>
                                                                <Button onClick={() => setEditPartId(null)}>Cancel</Button>
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        <tr key={part.partId}>
                                                            <td>{part.sequenceNo}</td>
                                                            <td>{part.partName}</td>
                                                            <td><CheckboxInput label=" " checked={part.isActive} /></td>
                                                            <td>
                                                                <Button variant={BUTTONS.TABLEDOWNLOAD} startIcon={<Icon.PencilFill />} onClick={() => {
                                                                    setEditPartId(part.partId);
                                                                    setEditPart({ ...part });
                                                                    setShowAddRow(false);
                                                                }}>Edit</Button>
                                                                <Button
                                                                    variant={BUTTONS.TABLEDOWNLOAD}
                                                                    startIcon={<Icon.TrashFill />}
                                                                    onClick={() => {
                                                                        setDeletePartData({
                                                                            vesselTypePartMappingId: part.partId,
                                                                            vesselTypeId: formData.vesselTypeId,
                                                                            partName: part.partName ?? "",      // fallback safety
                                                                            sequenceNo: part.sequenceNo,
                                                                            isActive: part.isActive,
                                                                            isDeleted: true
                                                                        });
                                                                        setDeletepartModel(true);
                                                                    }}
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}

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
                            <AbsSelect
                                mult={false}
                                options={partOptions}
                                selected={
                                    formData.partId
                                        ? [String(formData.partId)]
                                        : []
                                }
                                onChange={(selected: any[]) => {
                                    if (!selected || !selected.length) return;

                                    const partId = Number(selected[0]);

                                    const part = partOptions.find(
                                        p => Number(p.value) === partId
                                    );

                                    setSelectedPartId(partId);
                                    setSelectedPartName(part?.text ?? "");

                                    onPartChange(partId)
                                }}

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
                                        <Button variant={BUTTONS.PRIMARY} onClick={() => { }}>Add New Section</Button>
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
                                                        <GeneralSection
                                                            generalSections={normalSections}
                                                            vesselTypeId={Number(formData.vesselTypeId)}
                                                            partId={Number(formData.partId)}
                                                            partName={selectedPartName}
                                                            onRefresh={refreshTankSections}
                                                        />

                                                    </>
                                                ),
                                                header: 'General '
                                            },
                                            {
                                                content: (
                                                    <>
                                                        <TankSection tankSections={tankSections}
                                                            vesselTypeId={formData.vesselTypeId}
                                                            selectedPartId={formData.partId}
                                                            selectedPartName={selectedPartName}
                                                            onRefresh={refreshTankSections} 
                                                        />
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
                                    Are you sure you want to delete {deletePartData?.partName} Grading?

                                </p>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className='gap-3'>
                    <Button variant={BUTTONS.SECONDARY} onClick={() => setDeletepartModel(false)}>
                        Cancel
                    </Button>
                    <Button variant={BUTTONS.PRIMARY} onClick={deletePart} >
                        Delete
                    </Button>


                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ManageTemplate;