import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BreadcrumbBar, Button, AbsReactTable, BUTTONS, Divider, Input, AbsSelect, AbsSearch, CheckboxInput, RadioInput, Label } from "customer_portal-ui-shared";
import * as Icon from 'react-bootstrap-icons';
import ManageTankTemplateList from './ManageTankTemplateList';
import { Modal, Offcanvas } from 'react-bootstrap';
import * as tankService from '../../../../service/TankService';
interface ManageTankRow {
    vesselType: string;
    tankType: string;
    status: string;
    tankName: string;
    subheader: string;
}

type FormData = {
    tank_name: string;
    subheader_name: string;
    vessel_type: string;
    tank_type: string;
    activation_status: boolean;
};
const ManageTankList: React.FC = () => {
    const [val, updateVal] = React.useState<string>("");
    const [value, updateValue] = React.useState<string>("");

    const [searchApplied, updateSearchApplied] = React.useState<string | null>(null);
    const [checked, setChecked] = React.useState<boolean>(false);
    const [open, setOpen] = React.useState<boolean>();
    const [selected, setSelected] = React.useState<number | undefined>();
    const [deleteModel, setDeleteModel] = React.useState<boolean>();
    const [tankList, setTankList] = useState<ManageTankRow[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [filters, setFilters] = useState<any>(null);
    const [FinalData, setFinalData] = useState<any[]>([]);
    const [TankFilter, setTankFilter] = useState<ManageTankRow[]>([]);
    const [dataCount, setDataCount] = useState(0);
    const [hierarchicalFilters, setHierarchicalFilters] = useState<{
        vesselType?: string;
        tankName?: string;
        tankType?: string;
    }>({});
    const [formData, setFormData] = React.useState<FormData>({
        tank_name: "",
        subheader_name: "",
        vessel_type: "",
        tank_type: "",

        activation_status: false,

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
    useEffect(() => {
        loadTankList();
    }, []);
    // Fix loadTankList - around line 70
    const loadTankList = async () => {
        try {
            setLoading(true);

            const res = await tankService.getTanks();
            console.log(res.data, "raw api data");

            let rawData: any[] = [];

            if (Array.isArray(res.data)) {
                rawData = res.data;
            } else if (Array.isArray(res.data?.data)) {
                rawData = res.data.data;
            } else if (Array.isArray(res.data?.Data)) {
                rawData = res.data.Data;
            }

            const mappedData: ManageTankRow[] = rawData.map(item => ({
                vesselType: item.vesselType ?? item.VesselType ?? "",
                tankType: item.tankType ?? item.TankType ?? "",
                status: item.status ?? item.Status ?? "",
                tankName: item.tankName ?? item.TankName ?? "",
                subheader: item.subheader ?? item.Subheader ?? ""
            }));

            console.log(mappedData, "mapped table data");

            // FIX: Set TankFilter for pagination/search
            setTankFilter(mappedData);
            setDataCount(mappedData.length);

        } catch (error) {
            console.error("Error loading tanks:", error);
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

    // Fix columns definition - around line 320
    const columns = useMemo<Array<any>>(
        () => [
            {
                label: "Vessel Type",
                accessorKey: "vesselType",
                accessor: "vesselType",  // ADD: Required for table
                cell: (info: { getValue: () => any }) => info.getValue(),
            },
            {
                label: "Tank Type",
                accessorKey: "tankType",
                accessor: "tankType",  // ADD: Required for table
                cell: (info: { getValue: () => any }) => info.getValue(),
            },
            {
                label: "Status",
                accessorKey: "status",
                accessor: "status",  // ADD: Required for table
                Cell: ({ row }: any) => (
                    <div className="d-flex justify-content-center">
                        <CheckboxInput
                            label=" "
                            checked={row.original.status === "Active"}
                            onChange={() => { }}
                            disabled
                        />
                    </div>
                )
            },
            {
                label: "Tank Name",
                accessorKey: "tankName",
                accessor: "tankName",  // ADD: Required for table
                cell: (info: { getValue: () => any }) => info.getValue(),
            },
            {
                label: "Subheader",
                accessorKey: "subheader",
                accessor: "subheader",  // ADD: Required for table
                cell: (info: { getValue: () => any }) => info.getValue(),
            }
        ],
        []
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
                        </div>
                        <div className="custom-react-table">
                            <AbsReactTable
                                columns={columns}
                                data={tankList}
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
                        <div className="col-md-12 form-group">
                            <Label name="Tank Type" bold />
                            <AbsSelect mult={false}
                                onChange={(selected: string[] | any) =>
                                    setFormData({ ...formData, tank_type: (selected && selected[0]) || "" })
                                }
                                options={[
                                    { text: "Cargo Tank", value: "1" },
                                    { text: "Slop Tank", value: "2" },
                                ]}
                                selected={[formData.tank_type]}
                                placeholder="Select a Tank Type "
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
        </>
    );
};

export default ManageTankList;