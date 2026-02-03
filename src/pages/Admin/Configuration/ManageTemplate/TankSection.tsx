import React, { useState } from "react";
import { Button, BUTTONS, CheckboxInput } from "customer_portal-ui-shared";
import * as Icon from "react-bootstrap-icons";
import * as reportConfigService from "../../../../service/ReportConfigService";

type Props = {
    tankSections: any[];
    vesselTypeId: number;
    selectedPartId: number;
    selectedPartName: string;
    onRefresh: () => void;
};

const TankSection: React.FC<Props> = ({
    tankSections,
    vesselTypeId,
    selectedPartId,
    selectedPartName,
    onRefresh
}) => {

    const [editId, setEditId] = useState<number | null>(null);
    const [row, setRow] = useState<any | null>(null);

    const saveTankSection = async () => {
        if (!row) return;

        const payload = {
            reportParts: [],
            normalSectionMappings: [],
            tankSectionMappings: [
                {
                    vesselTypeId: vesselTypeId,
                    partName: selectedPartName,
                    vesselTypePartMappingId: selectedPartId,

                    tankTypeId: row.tankTypeId,
                    placeholderCount: Number(row.placeholderCount),
                    fileNameCount: Number(row.fileNameCount),
                    totalCards:
                        Number(row.placeholderCount) +
                        Number(row.fileNameCount),

                    isMapped: row.isMapped,
                    isActive: true,
                    isDeleted: false
                }
            ]
        };

        await reportConfigService.saveReportTemplateConfig(
            vesselTypeId,
            payload
        );

    
        onRefresh(); 
        setEditId(null);
        setRow(null);
    };

    return (
        <div className="form-area">
            <table className="table table-bordered custom-table">
                <thead>
                    <tr>
                        <th>Tank Type</th>
                        <th>Total Conditions</th>
                        <th>Current Count</th>
                        <th>Selectable Count</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {tankSections.map(t =>
                        editId === t.tankTypeId ? (
                            /* ========== EDIT MODE ========== */
                            <tr key={t.tankTypeId}>
                                <td>{t.tankType}</td>

                                <td>
                                    {Number(row.placeholderCount) +
                                        Number(row.fileNameCount)}
                                </td>

                                <td>
                                    {/* NATIVE INPUT — IMPORTANT */}
                                    <input
                                        type="number"
                                        min={0}
                                        step={1}
                                        className="form-control"
                                        value={row.placeholderCount}
                                        onChange={e =>
                                            setRow(prev =>
                                                prev
                                                    ? {
                                                        ...prev,
                                                        placeholderCount: Number(e.target.value)
                                                    }
                                                    : prev
                                            )
                                        }

                                    />
                                </td>

                                <td>
                                    {/* NATIVE INPUT — IMPORTANT */}
                                    <input
                                        type="number"
                                        min={0}
                                        step={1}
                                        className="form-control"
                                        value={row.fileNameCount}
                                        onChange={e =>
                                            setRow(prev =>
                                                prev
                                                    ? {
                                                        ...prev,
                                                        fileNameCount: Number(e.target.value)
                                                    }
                                                    : prev
                                            )
                                        }

                                    />
                                </td>

                                <td>
                                    <CheckboxInput
                                        label=" "
                                        checked={row.isMapped}
                                        onChange={(v: boolean) =>
                                            setRow({ ...row, isMapped: v })
                                        }
                                    />
                                </td>

                                <td className="d-flex gap-2">
                                    <Button
                                        variant={BUTTONS.PRIMARY}
                                        startIcon={<Icon.Check />}
                                        onClick={saveTankSection}
                                    />
                                    <Button
                                        variant={BUTTONS.SECONDARY}
                                        startIcon={<Icon.X />}
                                        onClick={() => {
                                            setEditId(null);
                                            setRow(null);
                                        }}
                                    />
                                </td>
                            </tr>
                        ) : (
                            /* ========== VIEW MODE ========== */
                            <tr key={t.tankTypeId}>
                                <td>{t.tankType}</td>
                                <td>{t.totalCards}</td>
                                <td>{t.placeholderCount}</td>
                                <td>{t.fileNameCount}</td>
                                <td>
                                    <CheckboxInput label=" " checked={t.isMapped} disabled />
                                </td>
                                <td>
                                    <Button
                                        variant={BUTTONS.TABLEDOWNLOAD}
                                        startIcon={<Icon.PencilFill />}
                                        onClick={() => {
                                            setEditId(t.tankTypeId);
                                            setRow({ ...t }); // clone row
                                        }}
                                    />
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TankSection;
