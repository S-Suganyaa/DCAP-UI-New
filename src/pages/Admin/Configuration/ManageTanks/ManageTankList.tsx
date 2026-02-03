import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BreadcrumbBar, Button, AbsReactTable, BUTTONS, Divider, Input, AbsSelect, AbsSearch, CheckboxInput, RadioInput, Label } from "customer_portal-ui-shared";
import * as Icon from 'react-bootstrap-icons';
import ManageTankTemplateList from './ManageTankTemplateList';
import { Modal, Offcanvas } from 'react-bootstrap';
import * as tankService from '../../../../service/TankService';
import * as gradingService from '../../../../service/GradingService';
interface ManageTankRow {
    tankId?: string;
    templateId?: number;
    vesselType: string;
    tankType: string;
    status: string;
    tankName: string;
    subheader: string;
}

type TankFormState = {
    tankName: string;
    subheader: string;

    vesselValue: string | number | null;
    vesselText: string;

    tankTypeValue: string | number | null;
    tankTypeText: string;

    status: boolean;
};

type SelectOption = {
    text: string;
    value: number | string;
};
const ManageTankList: React.FC = () => {
    const [val, updateVal] = React.useState<string>("");
    const [value, updateValue] = React.useState<string>("");

    const [searchApplied, updateSearchApplied] = React.useState<string | null>(null);
    const [checked, setChecked] = React.useState<boolean>(false);
    const [open, setOpen] = React.useState<boolean>();
    const [selected, setSelected] = React.useState<number | undefined>();
    const [deleteModel, setDeleteModel] = React.useState<boolean>();
    const [statusModel, setStatusModel] = React.useState<boolean>();
    const [actstatus, setActStatusModel] = React.useState<number>();
    const [tankList, setTankList] = useState<ManageTankRow[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [filters, setFilters] = useState<any>(null);
    const [FinalData, setFinalData] = useState<any[]>([]);
    const [TankFilter, setTankFilter] = useState<ManageTankRow[]>([]);
    const [dataCount, setDataCount] = useState(0);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [bulkStatus, setBulkStatus] = useState<boolean>(true);

    const [hierarchicalFilters, setHierarchicalFilters] = useState<{
        vesselType?: string;
        tankName?: string;
        tankType?: string;
    }>({});
    const [formData, setFormData] = useState<TankFormState>({
        tankName: "",
        subheader: "",
        vesselValue: null,
        vesselText: "",
        tankTypeValue: null,
        tankTypeText: "",
        status: true
    });

    const [vesselOptions, setVesselOptions] = useState<SelectOption[]>([]);
    const [tankOptions, setTankOptions] = useState<SelectOption[]>([]);
    const [editingTankId, setEditingTankId] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<number>(1);
    const [error, setError] = React.useState<boolean>();
    const [deletingTank, setDeletingTank] = useState<ManageTankRow | null>(null);

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
    useEffect(() => {
        loadTankList();
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
        tankService.GetMappedTankTypes(0, vesselType).then(res => {

            setTankOptions(
                res.data.map((p: any) => ({
                    text: p.tankType,
                    value: p.id
                }))
            );
        });
    };
    const normalizeStatus = (status: any): boolean => {
        if (typeof status === "boolean") return status;
        if (typeof status === "number") return status === 1;
        if (typeof status === "string")
            return status.toLowerCase() === "active" || status === "1" || status === "true";
        return false;
    };

    const handleEditTank = async (row: ManageTankRow) => {
        const isActive = normalizeStatus(row.status);

        setVesselOptions([
            {
                text: row.vesselType,
                value: row.vesselType
            }
        ]);

        setTankOptions([
            {
                text: row.tankType,
                value: row.tankType
            }
        ]);

        setFormData({
            tankName: row.tankName,
            subheader: row.subheader,

            vesselValue: row.vesselType,
            vesselText: row.vesselType,

            tankTypeValue: row.tankType,
            tankTypeText: row.tankType,

            status: isActive
        });

        setEditingTankId(row.tankId ?? null);
        setOpen(true);
    };


    const handleSaveTank = async () => {
        if (!formData.tankName.trim() || !formData.vesselText || !formData.tankTypeText.trim()) {
            setError(true);
            return;
        }

        const payload = {
            tankName: formData.tankName,
            subheader: formData.subheader,
            vesselType: formData.vesselText,
            tankType: formData.tankTypeText,
            status: formData.status
        };
        if (editingTankId) {
            await tankService.updateTank({
                ...payload,
                tankId: editingTankId
            });
        } else {
            await tankService.createTank(payload);
        }

        setOpen(false);
        resetForm();
        loadTankList();
    };

    const handleDeleteTank = async () => {
        if (!deletingTank?.tankId) return;

        try {
            await tankService.deleteTank(
                deletingTank.tankId,
                "",   // IMO
                0     // ProjectId
            );

            setDeleteModel(false);

            setDeletingTank(null);

            await loadTankList();

            loadTankList(); // refresh grid
        } catch (err) {
            console.error("Delete Tank failed", err);
        }
    };


    const resetForm = () => {
        setEditingTankId(null);
        setFormData({
            tankName: "",
            subheader: "",
            vesselValue: null,
            vesselText: "",
            tankTypeValue: null,
            tankTypeText: "",
            status: true
        });
        setTankOptions([]);
    };

    const toggleRow = (tankId?: string) => {
        if (!tankId) return;

        setSelectedIds(prev => {
            const exists = prev.includes(tankId);
            const next = exists
                ? prev.filter(id => id !== tankId)
                : [...prev, tankId];

            return next;
        });
    };


    const loadTankList = async () => {
        try {
            setLoading(true);

            const res = await tankService.getTanks();

            let rawData: any[] = [];

            if (Array.isArray(res.data)) {
                rawData = res.data;
            } else if (Array.isArray(res.data?.data)) {
                rawData = res.data.data;
            } else if (Array.isArray(res.data?.Data)) {
                rawData = res.data.Data;
            }
            const mappedData: ManageTankRow[] = rawData.map(item => ({
                tankId: item.tankId ?? item.tankId ?? "",
                vesselType: item.vesselType ?? item.VesselType ?? "",
                tankType: item.tankType ?? item.TankType ?? "",
                status: item.status ?? item.status ?? "",
                tankName: item.tankName ?? item.TankName ?? "",
                subheader: item.subheader ?? item.Subheader ?? "",
            }));

            setTankFilter(mappedData);
            setDataCount(mappedData.length);

        } catch (error) {
        } finally {
            setLoading(false);
        }
    };
    const handleClearFilter = () => {
        updateVal("");
        updateSearchApplied(null);
        setFilters(null);
        setHierarchicalFilters({}); // Clear hierarchical filters

        // Reset pagination to first page
        setAppliedFilters(prev => ({
            ...prev,
            pageIndex: 0,
            resetPageIndex: true
        }));

        if (TankFilter && TankFilter.length > 0) {
            const pagesize = appliedFilters.pageSize != null && appliedFilters.pageSize != ""
                ? (typeof appliedFilters.pageSize === 'string' ? parseInt(appliedFilters.pageSize, 10) : Number(appliedFilters.pageSize))
                : 20;
            // Show first page with all data (no search filter)
            searchVessels({}, "list", 0, pagesize, null);
            // Update dataCount to total records
            setDataCount(TankFilter.length);
        }
    };
    const searchVessels = useCallback((filters: any, searchType: string, pageIndex: number, pageSize: any, searchText?: string | null) => {
        let searchVessels: any = [];
        const filterEntries = Object.entries(filters?.filters || {});

        // Convert pageSize and pageIndex to numbers
        const pageSizeNum = typeof pageSize === 'string' ? parseInt(pageSize, 10) : Number(pageSize);
        const pageIndexNum = typeof pageIndex === 'string' ? parseInt(pageIndex, 10) : Number(pageIndex);

        // Use searchText parameter or fallback to searchApplied state
        const currentSearchText = searchText !== undefined ? searchText : searchApplied;

        // Filter data based on hierarchical filters and search text
        let dataToPaginate = TankFilter;

        // Apply hierarchical filters (vesselType, templateName, sectionName)
        if (hierarchicalFilters.vesselType) {
            dataToPaginate = dataToPaginate.filter(item =>
                item.vesselType === hierarchicalFilters.vesselType
            );
        }
        if (hierarchicalFilters.tankName) {
            dataToPaginate = dataToPaginate.filter(item =>
                item.tankName === hierarchicalFilters.tankName
            );
        }
        if (hierarchicalFilters.tankType) {
            dataToPaginate = dataToPaginate.filter(item =>
                item.tankType === hierarchicalFilters.tankType
            );
        }

        // Apply search text filter (templateName and sectionName)
        if (currentSearchText) {
            dataToPaginate = dataToPaginate.filter((item) => {
                const searchLower = currentSearchText.toLowerCase();
                return (
                    item.tankName?.toLowerCase().includes(searchLower) ||
                    item.tankType?.toLowerCase().includes(searchLower) ||
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

        // REPLACE data, don't append
        setTankList(searchVessels);
    }, [TankFilter, searchApplied, hierarchicalFilters]);

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
            if (TankFilter && TankFilter.length > 0) {
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
                setDataCount(TankFilter.length);
            }
        } else {
            // Apply search filter in real-time
            updateSearchApplied(value);
            if (TankFilter && TankFilter.length > 0) {
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
    }, [TankFilter, appliedFilters.pageSize, searchVessels]);

    useEffect(() => {
        if (TankFilter && TankFilter.length > 0) {
            if (tankList.length === 0) {
                const pagesize = appliedFilters.pageSize != null && appliedFilters.pageSize != ""
                    ? (typeof appliedFilters.pageSize === 'string' ? parseInt(appliedFilters.pageSize, 10) : Number(appliedFilters.pageSize))
                    : 20;

                searchVessels({}, "list", 0, pagesize);
                setDataCount(TankFilter.length);
            }
        }
    }, [TankFilter]);

    const columns = useMemo(
        () => [
            {
                id: "select",
                label: "",
                Cell: ({ row }: any) => (
                    <CheckboxInput
                        label=" "
                        checked={selectedIds.includes(row.original.tankId)}
                        onChange={(e: any) => {
                            toggleRow(row.original.tankId);
                        }}
                    />
                )
            },

            {
                label: "Vessel Type",
                accessor: "vesselType",
            },
            {
                label: "Tank Type",
                accessor: "tankType",
            },
            {
                label: "Tank Name",
                accessor: "tankName",
            },
            {
                label: "Subheader",
                accessor: "subheader",
            },

            {
                id: "action",
                label: "Action",
                filter: false,
                Cell: ({ row }: any) => (
                    <div className="d-flex gap-3">
                        <Button
                            variant={BUTTONS.TABLEDOWNLOAD}
                            startIcon={<Icon.PencilFill />}
                            onClick={(e: any) => {
                                e.stopPropagation();
                                handleEditTank(row.original);
                            }}
                        />
                        <Button
                            variant={BUTTONS.TABLEDOWNLOAD}
                            startIcon={<Icon.TrashFill />}
                            onClick={(e: any) => {
                                e.stopPropagation();
                                setDeletingTank(row.original);
                                setDeleteModel(true);
                            }}
                        />
                    </div>
                )
            }
        ],
        [selectedIds]
    );


    const handleHierarchicalFilterChange = useCallback((filters: {
        vesselType?: string;
        tankType?: string;
    }) => {
        setHierarchicalFilters(filters);
        // Reset pagination when filter changes
        setAppliedFilters(prev => ({
            ...prev,
            pageIndex: 0,
            resetPageIndex: true
        }));
    }, []);

    const handleBulkStatusUpdate = async () => {
        try {
            const response = await tankService.updateTankStatus({
                data: selectedIds,
                status: bulkStatus,
                IMO: ""
            });

            if (response?.data === true || response?.data?.success === true) {

                // close modal
                setStatusModel(false);

                // clear selection
                setSelectedIds([]);

                // reset radio to default Active
                setBulkStatus(true);

                // refresh grid
                await loadTankList();
            }
        } catch (e) {

        }
    };



    return (
        <>
            <div className="page-title">
                <BreadcrumbBar
                    pageName="Manage Tank"
                    parentPages={[
                        {
                            name: "Project Configuration",
                            link: ""
                        }
                    ]}>
                    <Button onClick={() => (setOpen(true))}> Add New Tank</Button>
                </BreadcrumbBar>
            </div>
            <div className="page-content">
                <div className="grid-container">
                    <div className="grid-sidebar">
                        <ManageTankTemplateList
                            data={TankFilter}
                            onFilterChange={handleHierarchicalFilterChange}
                            selectedFilters={hierarchicalFilters}
                        />
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
                                            handleClearFilter(); // Use the clear filter function
                                        }}
                                        value={val}
                                        handleChange={(e: any) => onChangeSearchInput(e.target.value)} // FIX: Use onChangeSearchInput
                                        handleSearch={() => {
                                            updateSearchApplied(val === "" ? null : val);
                                        }}
                                        placeholder="Search by Tank Name, Tank Type, Vessel Type"
                                        searchApplied={searchApplied !== null}
                                    />
                                    <a onClick={() => handleClearFilter()} className="ml-3 text-nowrap text-underline">Clear Filters</a>
                                </div>
                            </div>
                            <div className="col-md-6 d-flex justify-content-end">
                                <div>
                                    <Button variant={BUTTONS.PRIMARY} disabled={selectedIds.length === 0}
                                        onClick={() => setStatusModel(true)}>Change Status</Button></div>
                            </div>
                        </div>
                        <div className="custom-react-table">
                            <AbsReactTable
                                columns={columns}
                                data={tankList}
                                rowIdAccessor="tankId"
                                pagination={true}
                                expand={false}
                                allowColumnsShowHide={false}
                                shadow={true}
                                dataCount={dataCount || TankFilter.length}
                                applyFilterCallback={applyFilter}
                                appliedFilters={{
                                    ...appliedFilters,
                                    pageSize: appliedFilters.pageSize.toString(),
                                    pageIndex: appliedFilters.pageIndex.toString(),
                                }}
                                pageOptions={["20", "30", "40", "50"]}
                                allDataProvided
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Offcanvas show={open} placement={"end"} onHide={() => setOpen(false)} backdrop="static">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                        {editingTankId ? "Edit Tank" : "Add New Tank"}
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className="row">
                        <div className="col-md-12 form-group">
                            <Label name="Tank Name" bold />
                            <Input
                                placeholder="Enter Tank Name"
                                value={formData.tankName}
                                onChange={(value: string) =>
                                    setFormData(prev => ({ ...prev, tankName: value }))
                                }
                            />
                            {(error && (![formData.tankName] || formData.tankName == "" || formData.tankName == null)) ?
                                <div><label style={{ color: 'red' }}> Tank Name Required</label></div> :
                                <></>
                            }
                        </div>
                        <div className="col-md-12 form-group">
                            <Label name="Subheader" bold />
                            <Input
                                placeholder="Enter Subheader Name"
                                value={formData.subheader}
                                onChange={(value: string) =>
                                    setFormData(prev => ({ ...prev, subheader: value }))
                                }
                            />

                        </div>
                        <div className="col-md-12 form-group">
                            <Label name="Select a Vessel Type" bold />
                            <AbsSelect
                                options={vesselOptions}
                                mult={false}
                                disabled={!!editingTankId}
                                selected={formData.vesselValue ? [formData.vesselValue] : []}
                                onChange={(selected: any[]) => {
                                    const value = selected?.[0];
                                    if (!value) return;

                                    const opt = vesselOptions.find(o => o.value === value);
                                    if (!opt) return;

                                    setFormData(prev => ({
                                        ...prev,
                                        vesselValue: opt.value,
                                        vesselText: opt.text,
                                        tankTypeValue: null,
                                        tankTypeText: ""
                                    }));

                                    onVesselChange(opt.text);
                                }}
                                placeholder="Select a Vessel Type"
                            />
                            {(error && (![formData.vesselValue] || formData.vesselValue == null)) ?
                                <div><label style={{ color: 'red' }}> Vessel Type Required</label></div> :
                                <></>
                            }
                        </div>
                        <div className="col-md-12 form-group">
                            <Label name="Tank Type" bold />
                            <AbsSelect
                                options={tankOptions}
                                mult={false}
                                disabled={!!editingTankId}
                                selected={formData.tankTypeValue ? [formData.tankTypeValue] : []}
                                onChange={(selected: any[]) => {
                                    const value = selected?.[0];
                                    if (!value) return;

                                    const opt = tankOptions.find(o => o.value === value);
                                    if (!opt) return;

                                    setFormData(prev => ({
                                        ...prev,
                                        tankTypeValue: opt.value,
                                        tankTypeText: opt.text
                                    }));
                                }}
                                placeholder="Select a Tank Type"
                            />
                            {(error && (![formData.tankTypeValue] || formData.tankTypeValue == null)) ?
                                <div><label style={{ color: 'red' }}> Tank Type Required</label></div> :
                                <></>
                            }
                        </div>
                        <div className="col-md-12 form-group">
                            <Label name="Activation Status" bold />
                            <div className='d-flex justify-contentn-start gap-3'>
                                <RadioInput
                                    label="Active"
                                    checked={formData.status === true}
                                    onChange={() =>
                                        setFormData(prev => ({ ...prev, status: true }))
                                    }
                                />

                                <RadioInput
                                    label="Inactive"
                                    checked={formData.status === false}
                                    onChange={() =>
                                        setFormData(prev => ({ ...prev, status: false }))
                                    }
                                />

                            </div>
                        </div>
                        <div className="col-md-12 form-group">
                            <Divider className="divider-1" />
                        </div>
                        <div className="col-md-12 form-group">
                            <div className="d-flex gap-2">
                                <Button variant={BUTTONS.PRIMARY} onClick={handleSaveTank}>
                                    {editingTankId ? "Update" : "Create"}
                                </Button>

                                <Button variant={BUTTONS.SECONDARY} onClick={() => {
                                    setOpen(false);
                                    resetForm();
                                }}
                                > Cancel</Button>

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
                                    Are you sure you want to delete <b> {deletingTank?.tankName}</b> Tank?

                                </p>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className='gap-3'>
                    <Button variant={BUTTONS.SECONDARY} onClick={() => setDeleteModel(false)}>
                        Cancel
                    </Button>

                    <Button variant={BUTTONS.PRIMARY} onClick={handleDeleteTank}>
                        Delete
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
                                        checked={bulkStatus === true}
                                        onChange={() => setBulkStatus(true)}
                                    />

                                    <RadioInput
                                        label="Inactive"
                                        checked={bulkStatus === false}
                                        onChange={() => setBulkStatus(false)}
                                    />


                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className='gap-3'>
                    <Button variant={BUTTONS.SECONDARY} onClick={() => setStatusModel(false)}>
                        No, Cancel
                    </Button>
                    <Button variant={BUTTONS.PRIMARY} onClick={handleBulkStatusUpdate}>
                        Yes, Proceed
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ManageTankList;