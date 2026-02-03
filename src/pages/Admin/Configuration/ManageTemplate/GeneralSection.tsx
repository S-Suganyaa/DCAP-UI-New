import React, { useEffect, useState } from "react";
import { Button, BUTTONS, Input } from "customer_portal-ui-shared";
import * as Icon from "react-bootstrap-icons";
import { Modal } from "react-bootstrap";
import * as reportConfigService from "../../../../service/ReportConfigService";

type Section = {
    id: number; // vesselTypeNormalSectionMappingId
    section_name: string;
    subheader_name: string;
    current_count: number;
    selectable_count: number;
};

type Props = {
    generalSections?: Section[];
    vesselTypeId: number;
    partId: number;
    partName: string;
    onRefresh: () => void;
};

const EMPTY_FORM: Section = {
    id: 0,
    section_name: "",
    subheader_name: "",
    current_count: 0,
    selectable_count: 0
};

const GeneralSection: React.FC<Props> = ({
    generalSections = [],
    vesselTypeId,
    partId,
    partName,
    onRefresh
}) => {
    const [sections, setSections] = useState<Section[]>([]);
    const [editId, setEditId] = useState<number | null>(null);
    const [formData, setFormData] = useState<Section>(EMPTY_FORM);
    const [showDelete, setShowDelete] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        setSections(generalSections);
        setEditId(null);
        setFormData(EMPTY_FORM);
    }, [generalSections]);

    const totalConditions =
        Number(formData.current_count) + Number(formData.selectable_count);

    // ================= SAVE / UPDATE =================
    const saveSection = async () => {
        if (!vesselTypeId || !partId) return;

        const payload = {
            reportParts: [],
            tankSectionMappings: [],
            normalSectionMappings: [
                {
                    vesselTypeNormalSectionMappingId:
                        editId === 0 ? null : editId,

                    vesselTypeId: Number(vesselTypeId),
                    vesselTypePartMappingId: Number(partId),
                    partName: partName,

                    sectionName: formData.section_name,
                    subHeader: formData.subheader_name,

                    placeholderCount: Number(formData.current_count),
                    fileNameCount: Number(formData.selectable_count),
                    totalCards: totalConditions,

                    isActive: true,
                    isDeleted: false
                }
            ]
        };

        await reportConfigService.saveReportTemplateConfig(
            Number(vesselTypeId),
            payload
        );

        setEditId(null);
        setFormData(EMPTY_FORM);
        onRefresh();
    };

    // ================= EDIT =================
    const onEdit = (sec: Section) => {
        setEditId(sec.id);
        setFormData({ ...sec });
    };

    const onCancel = () => {
        setEditId(null);
        setFormData(EMPTY_FORM);
    };

    // ================= DELETE (UI ONLY) =================
    const onDelete = () => {
        setSections(sections.filter(s => s.id !== deleteId));
        setShowDelete(false);
    };

    const deleteSection = async () => {
        if (!deleteId || !vesselTypeId || !partId) return;

        const sec = sections.find(s => s.id === deleteId);
        if (!sec) return;

        const payload = {
            reportParts: [],
            tankSectionMappings: [],
            normalSectionMappings: [
                {
                    vesselTypeNormalSectionMappingId: sec.id,
                    vesselTypeId: Number(vesselTypeId),
                    vesselTypePartMappingId: Number(partId),
                    partName: partName,

                    sectionName: sec.section_name,
                    subHeader: sec.subheader_name,

                    placeholderCount: Number(sec.current_count),
                    fileNameCount: Number(sec.selectable_count),
                    totalCards:
                        Number(sec.current_count) +
                        Number(sec.selectable_count),

                    isActive: true,
                    isDeleted: true
                }
            ]
        };

        await reportConfigService.saveReportTemplateConfig(
            Number(vesselTypeId),
            payload
        );

        setShowDelete(false);
        setDeleteId(null);
        onRefresh(); // 
    };


    if (sections.length === 0 && editId === null) {
        return <div className="text-center">No Record(s) Found</div>;
    }

    return (
        <>
            <div className="form-area">
                <table className="table table-bordered custom-table">
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
                        {/* ========== ADD NEW ROW ========== */}
                        {editId === 0 && (
                            <tr>
                                <td>
                                    <Input
                                        value={formData.section_name}
                                        onChange={(v: string) =>
                                            setFormData({
                                                ...formData,
                                                section_name: v
                                            })
                                        }
                                    />
                                </td>

                                <td>
                                    <Input
                                        value={formData.subheader_name}
                                        onChange={(v: string) =>
                                            setFormData({
                                                ...formData,
                                                subheader_name: v
                                            })
                                        }
                                    />
                                </td>

                                <td>{totalConditions}</td>

                                <td>
                                    <input
                                        type="number"
                                        min={0}
                                        step={1}
                                        className="form-control"
                                        value={formData.current_count}
                                        onChange={e =>
                                            setFormData({
                                                ...formData,
                                                current_count: Number(
                                                    e.target.value
                                                )
                                            })
                                        }
                                    />
                                </td>

                                <td>
                                    <input
                                        type="number"
                                        min={0}
                                        step={1}
                                        className="form-control"
                                        value={formData.selectable_count}
                                        onChange={e =>
                                            setFormData({
                                                ...formData,
                                                selectable_count: Number(
                                                    e.target.value
                                                )
                                            })
                                        }
                                    />
                                </td>

                                <td className="d-flex gap-2">
                                    <Button
                                        variant={BUTTONS.PRIMARY}
                                        onClick={saveSection}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant={BUTTONS.SECONDARY}
                                        onClick={onCancel}
                                    >
                                        Cancel
                                    </Button>
                                </td>
                            </tr>
                        )}

                        {/* ========== EXISTING ROWS ========== */}
                        {sections.map(sec =>
                            editId === sec.id ? (
                                <tr key={sec.id}>
                                    <td>
                                        <Input
                                            value={formData.section_name}
                                            onChange={(v: string) =>
                                                setFormData({
                                                    ...formData,
                                                    section_name: v
                                                })
                                            }
                                        />
                                    </td>

                                    <td>
                                        <Input
                                            value={formData.subheader_name}
                                            onChange={(v: string) =>
                                                setFormData({
                                                    ...formData,
                                                    subheader_name: v
                                                })
                                            }
                                        />
                                    </td>

                                    <td>{totalConditions}</td>

                                    <td>
                                        <input
                                            type="number"
                                            min={0}
                                            step={1}
                                            className="form-control"
                                            value={formData.current_count}
                                            onChange={e =>
                                                setFormData({
                                                    ...formData,
                                                    current_count: Number(
                                                        e.target.value
                                                    )
                                                })
                                            }
                                        />
                                    </td>

                                    <td>
                                        <input
                                            type="number"
                                            min={0}
                                            step={1}
                                            className="form-control"
                                            value={formData.selectable_count}
                                            onChange={e =>
                                                setFormData({
                                                    ...formData,
                                                    selectable_count: Number(
                                                        e.target.value
                                                    )
                                                })
                                            }
                                        />
                                    </td>

                                    <td className="d-flex gap-2">
                                        <Button
                                            variant={BUTTONS.PRIMARY}
                                            onClick={saveSection}
                                        >
                                            Update
                                        </Button>
                                        <Button
                                            variant={BUTTONS.SECONDARY}
                                            onClick={onCancel}
                                        >
                                            Cancel
                                        </Button>
                                    </td>
                                </tr>
                            ) : (
                                <tr key={sec.id}>
                                    <td>{sec.section_name}</td>
                                    <td>{sec.subheader_name}</td>
                                    <td>
                                        {sec.current_count +
                                            sec.selectable_count}
                                    </td>
                                    <td>{sec.current_count}</td>
                                    <td>{sec.selectable_count}</td>
                                    <td className="d-flex gap-2">
                                        <Button
                                            startIcon={
                                                <Icon.PencilFill />
                                            }
                                            onClick={() => onEdit(sec)}
                                        />
                                        <Button
                                            startIcon={
                                                <Icon.TrashFill />
                                            }
                                            onClick={() => {
                                                setDeleteId(sec.id);
                                                setShowDelete(true);
                                            }}
                                        />
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>

                {editId === null && (
                    <Button
                        variant={BUTTONS.PRIMARY}
                        onClick={() => {
                            setEditId(0);
                            setFormData(EMPTY_FORM);
                        }}
                    >
                        + Add New Section
                    </Button>
                )}
            </div>

            {/* DELETE MODAL */}
            <Modal
                show={showDelete}
                centered
                onHide={() => setShowDelete(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Delete Section</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    Are you sure you want to delete this section?
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant={BUTTONS.SECONDARY}
                        onClick={() => setShowDelete(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant={BUTTONS.PRIMARY}
                        onClick={deleteSection}
                    >
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default GeneralSection;
