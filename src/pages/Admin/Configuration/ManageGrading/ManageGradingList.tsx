import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BreadcrumbBar, Button, AbsReactTable, BUTTONS, Divider, Input, AbsSelect, AbsSearch, CheckboxInput, RadioInput, Label } from "customer_portal-ui-shared";
import * as Icon from 'react-bootstrap-icons';
import ManageGradingTemplateList from './ManageGradingTemplateList';
import InformationPopup from '../../../../Common/InformationPopup';
import { Modal, Offcanvas } from 'react-bootstrap';
import * as gradingService from '../../../../service/GradingService';

interface ManageGradingRow {
    gradingId: number;
    sectionId: number;
    tanktypeId: number;
    vesselType: string;
    templateName: string;
    sectionName: string;
    gradingName: string;
    isActive: boolean;
    requiredInReport: boolean;
}
// Around line 19
type FormData = {
    vesselValue: number | string | null;
    vesselText: string;

    partValue: number | null;
    partText: string;

    sectionValue: string | number;  // Allow GUID (string) or number
    sectionText: string;

    grading_name: string;
};
type SelectOption = {
    text: string;
    value: number | string;  // Allow both number and string (for GUID)
};
const ManageGradingList: React.FC = () => {
    const [val, updateVal] = React.useState<string>("");
    const [searchApplied, updateSearchApplied] = React.useState<string | null>(null);
    const [gradings, setGradings] = useState<ManageGradingRow[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [filters, setFilters] = useState<any>(null);
    const [FinalData, setFinalData] = useState<any[]>([]);
    const [dataCount, setDataCount] = useState(0);
    const [GradingFilter, setGradingFilter] = useState<ManageGradingRow[]>([]);
    const [hierarchicalFilters, setHierarchicalFilters] = useState<{
        vesselType?: string;
        templateName?: string;
        sectionName?: string;
        gradingName?: string;
    }>({});
    const [error, setError] = React.useState<boolean>();
    const [open, setOpen] = React.useState<boolean>();
    const [deleteModel, setDeleteModel] = React.useState<boolean>();
    const [selected, setSelected] = React.useState<number | undefined>();
    const [showInfoPopup, setShowInfoPopup] = useState(false);
    const [popupPageName, setPopupPageName] = useState<string | undefined>();
    const [isSaving, setIsSaving] = useState(false);
    const [responseMsg, setResponseMsg] = React.useState<boolean>();
    const [formData, setFormData] = useState<FormData>({
        vesselValue: null,
        vesselText: "",
        partValue: null,
        partText: "",
        sectionValue: "",
        sectionText: "",
        grading_name: ""
    });

    const initialFilterState = {
        searchType: "list",
        resetPageIndex: false,
        expandAll: false,
        resetFilters: false,
        deselectRows: false,
        filters: {},
        sort: null,
        pageIndex: 0,
        pageSize: "20"
    };

    const [appliedFilters, setAppliedFilters] = React.useState({
        ...initialFilterState,
    });
    const [vesselOptions, setVesselOptions] = useState<SelectOption[]>([]);
    const [partOptions, setPartOptions] = useState<SelectOption[]>([]);
    const [sectionOptions, setSectionOptions] = useState<SelectOption[]>([]);
    const [selectedVesselType, setselectedVesselType] = useState("");
    const [GradingName, setGradingName] = useState("");
    const [activationStatus, setActivationStatus] = useState<boolean | null>(true);
    const [reportStatus, setReportStatus] = useState<boolean | null>(true);
    const [selectedRow, setSelectedRow] = useState<ManageGradingRow | null>(null);
    const [deleteGradingId, setDeleteGradingId] = useState<number | null>(null);
    const [deleteTanktypeId, setDeleteTanktypeId] = useState<number | null>(null);
    const [deletingGrading, setDeletingGrading] = useState<ManageGradingRow | null>(null);
    useEffect(() => {
        loadGradings();
        restoreFilters();
    }, []);

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

    const onVesselChange = (vesselType: string) => {

        setselectedVesselType(vesselType);
        gradingService.getTemplateName(vesselType).then(res => {

            setPartOptions(
                res.data.data.map((p: any) => ({
                    text: p.templateName,
                    value: p.templateId
                }))
            );
        });
    };


    const onTemplateChange = (templateId: number) => {
        if (!templateId || !selectedVesselType) return;

        gradingService
            .getSectionName(templateId, selectedVesselType)
            .then(res => {

                setSectionOptions(
                    res.data.data.map((s: any) => ({
                        text: s.sectionName,
                        value: s.sectionId
                    }))
                );
            })
            .catch(err => {
                setSectionOptions([]);
            });
    };

    const isDuplicateGrading = () => {
        return GradingFilter.some(g =>
            g.vesselType === formData.vesselText &&
            g.templateName === formData.partText &&
            g.sectionName === formData.sectionText &&
            g.gradingName.trim().toLowerCase() === GradingName.trim().toLowerCase() &&
            g.gradingId !== editingGradingId // 
        );
    };

    const handleCreate = async () => {
        if (!formData.vesselText || !formData.partText || !formData.sectionText || !GradingName.trim()) {
            setError(true);
            return;
        }

        if (isDuplicateGrading()) {
            setResponseMsg(true);
            return;
        }

        setIsSaving(true); // 

        try {
            if (editingGradingId) {
                const formdata = {
                    gradingId: editingGradingId,
                    vesselType: formData.vesselText,
                    templateName: formData.partText,
                    sectionName: formData.sectionText,
                    sectionId: formData.sectionValue,
                    gradingName: GradingName,
                    isActive: activationStatus === true,
                    requiredInReport: reportStatus === true,
                };

                await gradingService.updateGrading(formdata);

                setPopupPageName("UpdateGrading");
            } else {
                const formdata = {
                    vesselType: formData.vesselText,
                    templateName: formData.partText,
                    sectionName: formData.sectionText,
                    sectionId: formData.sectionValue,
                    gradingName: GradingName,
                    isActive: activationStatus === true,
                    requiredInReport: reportStatus === true,
                };

                await gradingService.createGrading(formdata);

                setPopupPageName("CreateGrading");
            }

            setShowInfoPopup(true);   // show success popup
            loadGradings();
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false); // 
        }
    };


    const cleanString = (str: string) =>
        str
            ? str
                .toString()
                .normalize("NFKD")
                .replace(/\s+/g, " ")
                .replace(/[\u200B-\u200D\uFEFF]/g, "")
                .trim()
                .toLowerCase()
            : "";

    const searchVessels = useCallback((filters: any, searchType: string, pageIndex: number, pageSize: any, searchText?: string | null) => {
        let searchVessels: any = [];
        const filterEntries = Object.entries(filters?.filters || {});

        // Convert pageSize and pageIndex to numbers
        const pageSizeNum = typeof pageSize === 'string' ? parseInt(pageSize, 10) : Number(pageSize);
        const pageIndexNum = typeof pageIndex === 'string' ? parseInt(pageIndex, 10) : Number(pageIndex);

        // Use searchText parameter or fallback to searchApplied state
        const currentSearchText = searchText !== undefined ? searchText : searchApplied;

        // Filter data based on hierarchical filters and search text
        let dataToPaginate = GradingFilter;

        // Apply hierarchical filters (vesselType, templateName, sectionName)
        if (hierarchicalFilters.vesselType) {
            dataToPaginate = dataToPaginate.filter(item =>
                item.vesselType === hierarchicalFilters.vesselType
            );
        }
        if (hierarchicalFilters.templateName) {
            dataToPaginate = dataToPaginate.filter(item =>
                item.templateName === hierarchicalFilters.templateName
            );
        }
        if (hierarchicalFilters.sectionName) {
            dataToPaginate = dataToPaginate.filter(item =>
                item.sectionName === hierarchicalFilters.sectionName
            );
        }
        if (hierarchicalFilters.gradingName) {
            dataToPaginate = dataToPaginate.filter(item =>
                item.gradingName === hierarchicalFilters.sectionName
            );
        }
        // Apply search text filter (templateName and sectionName)
        if (currentSearchText) {
            dataToPaginate = dataToPaginate.filter((item) => {
                const searchLower = currentSearchText.toLowerCase();
                return (
                    item.templateName?.toLowerCase().includes(searchLower) ||
                    item.sectionName?.toLowerCase().includes(searchLower) ||
                    item.gradingName?.toLowerCase().includes(searchLower) ||
                    item.vesselType?.toLowerCase().includes(searchLower)
                );
            });
        }

        if (searchType === "list") {
            // Calculate slice indices correctly - ensure pageIndex is 0-based
            const startIndex = pageIndexNum * pageSizeNum;
            const endIndex = startIndex + pageSizeNum;

            searchVessels = dataToPaginate.slice(startIndex, endIndex);
            setDataCount(dataToPaginate.length); // Set total count for filtered data
        } else if (searchType === "all") {
            const filteredData = dataToPaginate.filter((vessel) =>
                filterEntries.every(([columnId, filter]) => {
                    const { searchTerm } = filter as { searchTerm: string };
                    if (!searchTerm) return true;

                    const vesselValue = cleanString((vessel as any)[columnId] || '');
                    const normalizedSearchTerm = cleanString(searchTerm);

                    return vesselValue.includes(normalizedSearchTerm);
                })
            );

            const startIndex = pageIndexNum * pageSizeNum;
            const endIndex = startIndex + pageSizeNum;

            searchVessels = filteredData.slice(startIndex, endIndex);
            setDataCount(filteredData.length);
        }

        setGradings(searchVessels);
    }, [GradingFilter, searchApplied, hierarchicalFilters]);

    const applyFilter = useCallback(
        (filtersObj: any) => {
            const filteredData = Object.fromEntries(
                Object.entries(filtersObj.filters || {}).filter(
                    ([, value]) => (value as { searchTerm: string })?.searchTerm !== ""
                )
            );

            const {
                pageIndex: newPageIndex,
                pageSize: newPageSize,
                searchType: newSearchType,
            } = filtersObj;

            // Ensure pageIndex is a number
            const pageIndexNum = typeof newPageIndex === 'string'
                ? parseInt(newPageIndex, 10)
                : Number(newPageIndex) || 0;

            // Convert pageSize to number
            const pageSizeNum = typeof newPageSize === 'string'
                ? parseInt(newPageSize, 10)
                : Number(newPageSize) || 20;

            // Update state and call searchVessels immediately
            setAppliedFilters(() => {
                const updatedFilters = {
                    ...filtersObj,
                    pageIndex: pageIndexNum,
                    filters: filteredData,
                    sort: filtersObj.sort,
                    searchType: newSearchType,
                    pageSize: newPageSize,
                    resetPageIndex: false,
                };

                // Call searchVessels immediately with correct parameters
                const pageIndexAll = newSearchType === "all" ? 0 : pageIndexNum;

                searchVessels(
                    { ...updatedFilters, pageIndex: pageIndexAll, filters: filteredData },
                    newSearchType,
                    pageIndexAll,
                    pageSizeNum
                );

                return updatedFilters;
            });
        },
        [searchVessels]
    );

    const onChangeSearchInput = useCallback((value: string) => {
        updateVal(value);

        if (value.trim() === "") {
            // Clear search - show all data and reset to first page
            updateSearchApplied(null);
            if (GradingFilter && GradingFilter.length > 0) {
                const pagesize = appliedFilters.pageSize != null && appliedFilters.pageSize != ""
                    ? (typeof appliedFilters.pageSize === 'string' ? parseInt(appliedFilters.pageSize, 10) : Number(appliedFilters.pageSize))
                    : 20;
                // Reset pagination to first page
                setAppliedFilters(prev => ({
                    ...prev,
                    pageIndex: 0,
                    resetPageIndex: true
                }));
                searchVessels({}, "list", 0, pagesize, null);
                // Update dataCount to total records
                setDataCount(GradingFilter.length);
            }
        } else {
            // Apply search filter in real-time
            updateSearchApplied(value);
            if (GradingFilter && GradingFilter.length > 0) {
                const pagesize = appliedFilters.pageSize != null && appliedFilters.pageSize != ""
                    ? (typeof appliedFilters.pageSize === 'string' ? parseInt(appliedFilters.pageSize, 10) : Number(appliedFilters.pageSize))
                    : 20;
                // Reset to first page when search changes
                setAppliedFilters(prev => ({
                    ...prev,
                    pageIndex: 0,
                    resetPageIndex: true
                }));
                searchVessels({}, "list", 0, pagesize, value);
            }
        }
    }, [GradingFilter, appliedFilters.pageSize, searchVessels]);

    useEffect(() => {
        if (GradingFilter && GradingFilter.length > 0) {
            if (gradings.length === 0) {
                const pagesize = appliedFilters.pageSize != null && appliedFilters.pageSize != ""
                    ? (typeof appliedFilters.pageSize === 'string' ? parseInt(appliedFilters.pageSize, 10) : Number(appliedFilters.pageSize))
                    : 20;

                searchVessels({}, "list", 0, pagesize);
                setDataCount(GradingFilter.length);
            }
        }
    }, [GradingFilter]);

    const loadGradings = async () => {
        try {
            setLoading(true);

            const res = await gradingService.getGradings();

            // Handle response data
            let dataArray: ManageGradingRow[] = [];
            if (Array.isArray(res.data)) {
                dataArray = res.data;
            } else if (res.data?.data && Array.isArray(res.data.data)) {
                dataArray = res.data.data;
            } else if (res.data?.Data && Array.isArray(res.data.Data)) {
                dataArray = res.data.Data;
            }
            setGradings(res.data);
            setGradingFilter(dataArray);
            setFinalData(dataArray);
            setDataCount(dataArray.length);

            sessionStorage.setItem("GradingList", JSON.stringify(dataArray));
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const restoreFilters = () => {
        // Restore search filter
        const searchFilter = localStorage.getItem("SearchGradingFilter");
        if (searchFilter) {
            updateVal(searchFilter);
            updateSearchApplied(searchFilter);
        }

        // Restore grid filters
        const gridFilter = localStorage.getItem("GradingFilter");
        if (gridFilter) {
            try {
                const parsedFilter = JSON.parse(gridFilter);
                setFilters(parsedFilter);
            } catch (e) {
                console.error("Error parsing filter:", e);
            }
        }
    };

    const saveFilters = () => {
        if (val) {
            localStorage.setItem("SearchGradingFilter", val);
        } else {
            localStorage.removeItem("SearchGradingFilter");
        }

        if (filters) {
            localStorage.setItem("GradingFilter", JSON.stringify(filters));
        } else {
            localStorage.removeItem("GradingFilter");
        }
    };

    const [editingGradingId, setEditingGradingId] = useState<number | null>(null);
    const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
    const [editingTanktypeId, setEditingTanktypeId] = useState<number | null>(null);


    const handleEditGrading = async (row: ManageGradingRow) => {
        try {
            setEditingGradingId(row.gradingId);
            setEditingSectionId(row.sectionId);
            setEditingTanktypeId(row.tanktypeId);

            // Use data from row directly - bind specifically for display
            // Since dropdowns will be disabled, we just need to ensure the Text matches the Value in the options provided

            // Vessel - User confirmed ID is not saved, so we use the Text as the Value to ensure binding
            const vesselVal = row.vesselType;

            const vesselType = row.vesselType;

            // Set vessel type
            setselectedVesselType(vesselType);

            setVesselOptions([{
                text: row.vesselType,
                value: vesselVal
            }]);

            // Part / Template
            // Note: row might not have templateId, using -1 as placeholder since it's disabled anyway
            const partVal = (row as any).templateId || -1;
            setPartOptions([{
                text: row.templateName,
                value: partVal
            }]);

            // Section
            const sectionVal = row.sectionId;
            setSectionOptions([{
                text: row.sectionName,
                value: sectionVal
            }]);

            setFormData({
                vesselText: row.vesselType,
                vesselValue: vesselVal,
                partText: row.templateName,
                partValue: partVal, // Keep as is for part
                sectionText: row.sectionName,
                sectionValue: sectionVal,
                grading_name: row.gradingName
            });

            setGradingName(row.gradingName || "");
            setActivationStatus(row.isActive);
            setReportStatus(row.requiredInReport);
            setOpen(true);
        } catch (error) { }
    };


    const resetForm = () => {
        setFormData({
            vesselValue: null,
            vesselText: "",
            partValue: null,
            partText: "",
            sectionValue: "",
            sectionText: "",
            grading_name: ""
        });
        setGradingName("");
        setActivationStatus(null);
        setReportStatus(null);
        setPartOptions([]);
        setSectionOptions([]);
        setselectedVesselType("");

        // Clear edit mode
        setEditingGradingId(null);
        setEditingSectionId(null);
        setEditingTanktypeId(null);
    };


    const columns = useMemo<Array<any>>(
        () => [
            {
                label: "Vessel Template",
                accessorKey: "vesselType",
                accessor: "vesselType",
                cell: (info: { getValue: () => any }) => info.getValue(),
            },
            {
                label: "Part Name",
                accessorKey: "templateName",
                accessor: "templateName",
                cell: (info: { getValue: () => any }) => info.getValue(),
            },
            {
                label: "Section Name",
                accessorKey: "sectionName",
                accessor: "sectionName",
                cell: (info: { getValue: () => any }) => info.getValue(),
            },
            {
                label: "Grading Name",
                accessorKey: "gradingName",
                accessor: "gradingName",
                cell: (info: { getValue: () => any }) => info.getValue(),
            },
            {
                label: "Status",
                accessorKey: "isActive",
                accessor: "isActive",
                Cell: ({ cell: { value } }: { cell: { value: any } }) => {
                    return <span>{value ? 'Active' : 'Inactive'}</span>;
                },
            },
            {
                label: "Required in Export",
                accessorKey: "requiredInReport",
                accessor: "requiredInReport",
                Cell: ({ cell: { value } }: { cell: { value: any } }) => {
                    return (
                        <div className='d-flex justify-content-center gap-3'>
                            <CheckboxInput
                                label=" "
                                checked={value || false}
                                onChange={() => { }}
                                disabled
                            />
                        </div>
                    );
                }
            },
            {
                label: "Action",
                accessorKey: "action",
                accessor: "action",
                filter: false,
                Cell: ({ row }: { row: { original: ManageGradingRow } }) => {
                    return (
                        <div className='d-flex justify-content-start gap-3'>
                            <Button
                                variant={BUTTONS.TABLEDOWNLOAD}
                                startIcon={<Icon.PencilFill />}
                                onClick={() => handleEditGrading(row.original)}  // ADD: Call handleEditGrading
                            ></Button>
                            <Button variant={BUTTONS.TABLEDOWNLOAD} onClick={() => {
                                handleDeleteClick(row.original);
                            }} startIcon={<Icon.TrashFill />}></Button>
                        </div>
                    );
                }
            },
        ],
        []
    );

    const handleClearFilter = () => {
        updateVal("");
        updateSearchApplied(null);
        setFilters(null);
        setHierarchicalFilters({});
        localStorage.removeItem("SearchGradingFilter");
        localStorage.removeItem("GradingFilter");

        setAppliedFilters(prev => ({
            ...prev,
            pageIndex: 0,
            resetPageIndex: true
        }));

        if (GradingFilter && GradingFilter.length > 0) {
            const pagesize = appliedFilters.pageSize != null && appliedFilters.pageSize != ""
                ? (typeof appliedFilters.pageSize === 'string' ? parseInt(appliedFilters.pageSize, 10) : Number(appliedFilters.pageSize))
                : 20;
            // Show first page with all data (no search filter)
            searchVessels({}, "list", 0, pagesize, null);
            // Update dataCount to total records
            setDataCount(GradingFilter.length);
        }
    };

    const handleHierarchicalFilterChange = useCallback((filters: {
        vesselType?: string;
        templateName?: string;
        sectionName?: string
    }) => {
        setHierarchicalFilters(filters);
        // Reset pagination when filter changes
        setAppliedFilters(prev => ({
            ...prev,
            pageIndex: 0,
            resetPageIndex: true
        }));
    }, []);

    const handleDeleteClick = (row: ManageGradingRow) => {
        setDeleteGradingId(row.gradingId);
        setDeleteTanktypeId(row.tanktypeId);
        setDeletingGrading(row);
        setDeleteModel(true);
    };


    const handleConfirmDelete = async () => {
      
        setIsSaving(true);

        try {
            await gradingService.deleteGrading(deleteGradingId, deleteTanktypeId);

            setDeleteModel(false);
            setPopupPageName("DeleteGrading");
            setShowInfoPopup(true);

            loadGradings();
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };


    const gradingHeaderTitle = useMemo(() => {
        if (hierarchicalFilters.sectionName) {
            return `${hierarchicalFilters.sectionName} - Grading`;
        }
        if (hierarchicalFilters.templateName) {
            return `${hierarchicalFilters.templateName} - Grading`;
        }
        if (hierarchicalFilters.vesselType) {
            return `${hierarchicalFilters.vesselType} - Grading`;
        }
        return "Grading";
    }, [hierarchicalFilters]);


    return (
        <>
            <div className="page-title">
                <BreadcrumbBar
                    pageName="Manage Grading"
                    parentPages={[
                        {
                            name: "Project Configuration",
                            link: ""
                        }
                    ]}>
                    <Button onClick={() => (setOpen(true))}>Add New Grading</Button>
                </BreadcrumbBar>
            </div>
            <div className="page-content">
                <div className="grid-container">
                    <div className="grid-sidebar">
                        <ManageGradingTemplateList
                            data={GradingFilter}
                            onFilterChange={handleHierarchicalFilterChange}
                            selectedFilters={hierarchicalFilters}
                        />
                    </div>
                    <div className="grid-content-body">
                        <div className="row">
                            <div className="col-md-8">
                                <h5 className='_600'>{gradingHeaderTitle}</h5>
                            </div>
                            <div className="col-md-6 mb-3 mt-2">
                                <div className="d-flex justify-content-start align-items-center gap-2">
                                    <AbsSearch
                                        handleClear={() => {
                                            handleClearFilter();
                                        }}
                                        value={val}
                                        handleChange={(e: any) => onChangeSearchInput(e.target.value)}
                                        handleSearch={() => {
                                            updateSearchApplied(val === "" ? null : val);
                                        }}
                                        placeholder="Search by Part Name, Section Name,Grading Name"
                                        searchApplied={searchApplied !== null}
                                    />
                                    <a onClick={() => handleClearFilter()} className="ml-3 text-nowrap text-underline">Clear Filters</a>
                                </div>
                            </div>
                        </div>
                        <div className="custom-react-table">
                            {loading ? (
                                <div>Loading...</div>
                            ) : (
                                <AbsReactTable
                                    columns={columns}
                                    data={gradings}
                                    pagination={true}
                                    expand={false}
                                    allowColumnsShowHide={false}
                                    shadow={true}
                                    dataCount={dataCount || GradingFilter.length}
                                    applyFilterCallback={applyFilter}
                                    appliedFilters={{
                                        ...appliedFilters,
                                        pageSize: appliedFilters.pageSize.toString(),
                                        pageIndex: appliedFilters.pageIndex.toString(),
                                    }}
                                    pageOptions={["20", "30", "40", "50"]}
                                    allDataProvided
                                />

                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Offcanvas show={open} placement={"end"} onHide={() => setOpen(false)} backdrop="static">
                <Offcanvas.Header closeButton>
                    {editingGradingId ? "Edit ABS Grading" : "Add New ABS Grading"}
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className="row">
                        <div className="col-md-12 form-group">
                            <Label name="Vessel Template " bold />
                            <AbsSelect
                                mult={false}
                                options={vesselOptions}
                                disabled={!!editingGradingId}
                                selected={formData.vesselValue ? [formData.vesselValue] : []}

                                onChange={(selected: any[]) => {
                                    const selectedValue = selected?.[0];
                                    if (!selectedValue) return;

                                    const opt = vesselOptions.find(option => option.value === selectedValue);
                                    if (!opt) return;

                                    setFormData(prev => ({
                                        ...prev,
                                        vesselValue: opt.value,
                                        vesselText: opt.text,
                                        partValue: null,
                                        partText: "",
                                        sectionValue: "",
                                        sectionText: ""
                                    }));

                                    setPartOptions([]);
                                    setSectionOptions([]);

                                    onVesselChange(opt.text);
                                }}
                                placeholder="Select Vessel Template"
                            />
                            {(error && (![formData.vesselValue] || formData.vesselValue == null)) ?
                                <div><label style={{ color: 'red' }}> Please Select Vessel Type</label></div> :
                                <></>
                            }
                        </div>
                        <div className="col-md-12 form-group">
                            <Label name="Part Name" bold />
                            <AbsSelect
                                mult={false}
                                options={partOptions}
                                disabled={!!editingGradingId}
                                selected={formData.partValue ? [formData.partValue] : []}
                                onChange={(selected: any[]) => {
                                    const selectedValue = selected?.[0]; // This is the VALUE (number: templateId)
                                    if (!selectedValue) return;

                                    // Find the option object from partOptions by matching VALUE
                                    const opt = partOptions.find(option => option.value === selectedValue);
                                    if (!opt) return;

                                    // Part Name Select - around line 683
                                    // Part Name Select onChange - around line 683
                                    setFormData(prev => ({
                                        ...prev,
                                        partValue: Number(opt.value) as number,   // Cast to number explicitly
                                        partText: opt.text,
                                        sectionValue: "",
                                        sectionText: ""
                                    }));
                                    setSectionOptions([]);
                                    onTemplateChange(opt.value); // FIX: was 'opt', now 'opt.value' (number)
                                }}
                                placeholder="Select Part Name"
                            />
                            {(error && (![formData.partValue] || formData.partValue == null)) ?
                                <div><label style={{ color: 'red' }}> Please Select Part Name</label></div> :
                                <></>
                            }
                        </div>
                        <div className="col-md-12 form-group">
                            <Label name="Section Name" bold />
                            <AbsSelect
                                mult={false}
                                options={sectionOptions}
                                disabled={!!editingGradingId}
                                selected={formData.sectionValue ? [formData.sectionValue] : []}
                                onChange={(selected: any[]) => {
                                    const selectedValue = selected?.[0]; // This is the VALUE (GUID string: sectionId)
                                    if (!selectedValue) return;

                                    // Find the option object from sectionOptions by matching VALUE
                                    const opt = sectionOptions.find(option =>
                                        String(option.value) === String(selectedValue)
                                    );
                                    if (!opt) return;

                                    setFormData(prev => ({
                                        ...prev,
                                        sectionValue: opt.value,
                                        sectionText: opt.text
                                    }));
                                }}
                                placeholder="Select Section Name"
                            />
                            {(error && (![formData.sectionValue] || !formData.sectionValue || formData.sectionValue == null)) ?
                                <div><label style={{ color: 'red' }}> Please Select Section Name</label></div> :
                                <></>
                            }
                        </div>

                        <div className="col-md-12 form-group">
                            <Label name="Grading Name" bold />
                            <Input
                                placeholder="Enter Grading Name"
                                value={GradingName}
                                onChange={(value) => {
                                    setGradingName(value);
                                }}
                            />
                            {(error && (!GradingName || GradingName == null)) ?
                                <div><label style={{ color: 'red' }}> Grading Name required</label></div> :
                                <></>
                            }
                        </div>

                        <div className="col-md-12 form-group">
                            <Label name="Activation Status" bold />
                            <div className='d-flex justify-contentn-start gap-3'>
                                <RadioInput
                                    label="Active"
                                    checked={activationStatus === true}
                                    onChange={() => setActivationStatus(true)}
                                />

                                <RadioInput
                                    label="Inactive"
                                    checked={activationStatus === false}
                                    onChange={() => setActivationStatus(false)}
                                />

                            </div>
                        </div>
                        <div className="col-md-12 form-group">
                            <Label name="Report Configuration" bold />
                            <div className='d-flex justify-contentn-start gap-3'>
                                <RadioInput
                                    label="Required in Export"
                                    checked={reportStatus === true}
                                    onChange={() => setReportStatus(true)}
                                />

                                <RadioInput
                                    label="Exclude in Export"
                                    checked={reportStatus === false}
                                    onChange={() => setReportStatus(false)}
                                />

                            </div>
                        </div>
                        <div className="col-md-12 form-group">
                            <Divider className="divider-1" />
                        </div>
                        <div className="col-md-12 form-group">
                            <div className="d-flex gap-2">
                                <Button variant={BUTTONS.PRIMARY} onClick={handleCreate} disabled={isSaving}>{editingGradingId ? "Update" : "Create"}</Button>
                                <Button variant={BUTTONS.SECONDARY} onClick={() => setOpen(false)}>Cancel</Button>

                            </div>
                            {(responseMsg) ?
                                <div><label style={{ color: 'red' }}>Grading Already Exist</label></div> :
                                <></>
                            }

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
                                    Are you sure you want to delete <b> {deletingGrading?.gradingName}</b> Grading?

                                </p>
                            </div>
                        </div>
                    </div>
                </Modal.Body>                <Modal.Footer className='gap-3'>
                    <Button variant={BUTTONS.SECONDARY} onClick={() => setDeleteModel(false)}>
                        Cancel
                    </Button>
                    <Button variant={BUTTONS.PRIMARY} onClick={handleConfirmDelete}>
                        Delete
                    </Button>

                </Modal.Footer>
            </Modal>
            {showInfoPopup && (
                <InformationPopup
                    onShow={showInfoPopup}
                    onClose={() => {
                        setShowInfoPopup(false);
                        setOpen(false);
                        resetForm();           // optional clean reset
                    }}
                    pageName={popupPageName}
                />
            )}

        </>
    );
};

export default ManageGradingList;