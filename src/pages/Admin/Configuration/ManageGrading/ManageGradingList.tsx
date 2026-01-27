import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BreadcrumbBar, Button, AbsReactTable, BUTTONS, AbsSearch, CheckboxInput } from "customer_portal-ui-shared";
import * as Icon from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import ManageGradingTemplateList from './ManageGradingTemplateList';
import * as gradingService from '../../../../service/GradingService';

// Define interface locally if Interface/Grading.ts doesn't exist
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

const ManageGradingList: React.FC = () => {
    const navigate = useNavigate();
    const [val, updateVal] = useState<string>("");
    const [searchApplied, updateSearchApplied] = useState<string | null>(null);
    const [gradings, setGradings] = useState<ManageGradingRow[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [filters, setFilters] = useState<any>(null);
    const [finaldata, setFinalData] = useState<any[]>([]);
    const [dataCount, setDataCount] = useState(0);
    const [GradingFilter, setGradingFilter] = useState([]);
    const [searchText, setSearchText] = useState<string>("");
    const [searchApply, setSearchApply] = useState<string | null>(null);
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
        loadGradings();
        restoreFilters();
    }, []);

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

    const searchVessels = (filters: any, searchType: string, pageIndex: number, pageSize: any) => {

        let searchVessels: any = [];

        const filterEntries = Object.entries(filters?.filters || {});

        if (appliedFilters.pageSize !== pageSize) {

            setAppliedFilters({ ...filters, resetPageIndex: true });
        }

        if (searchType === "list") {
            searchVessels = finaldata.slice(
                pageIndex * pageSize,
                pageSize * (pageIndex + 1)
            );
            setDataCount(finaldata.length)
        } else if (searchType === "all") {
            searchVessels = finaldata
                .filter((vessel) =>
                    filterEntries.every(([columnId, filter]) => {
                        const { searchTerm } = filter as { searchTerm: string };
                        if (!searchTerm) return true;

                        const vesselValue = cleanString(vessel[columnId]);
                        const normalizedSearchTerm = cleanString(searchTerm);

                        return vesselValue.includes(normalizedSearchTerm);
                    })
                )
                .slice(pageIndex * pageSize, pageSize * (pageIndex + 1));

            const count = finaldata.filter((vessel) =>
                filterEntries.every(([columnId, filter]) => {
                    const { searchTerm } = filter as { searchTerm: string };
                    if (!searchTerm) return true;

                    const vesselValue = cleanString(vessel[columnId]);
                    const normalizedSearchTerm = cleanString(searchTerm);

                    return vesselValue.includes(normalizedSearchTerm);
                })
            ).length;


            setDataCount(count);

        }
        setGradings([...searchVessels]);
    };


    const applyFilter = useCallback(
        (filtersObj: any) => {

            const filteredData = Object.fromEntries(
                Object.entries(filtersObj.filters).filter(
                    ([key, value]) => (value as { searchTerm: string }).searchTerm !== ""
                )
            );

            const {
                filters = {},
                pageIndex: newPageIndex,
                pageSize: newPageSize,
                searchType: newSearchType,
            } = filtersObj;
            let updatedFilters = {
                ...filtersObj,
                filters: { ...filteredData },
                sort: filtersObj.sort,
            };
            if (appliedFilters.searchType !== newSearchType && newSearchType === 'list') {
                updatedFilters = {
                    ...updatedFilters,
                    filters: {},
                }
            }
            if (
                appliedFilters.searchType !== newSearchType ||
                appliedFilters.searchType === "all" ||
                appliedFilters.pageSize !== newPageSize ||
                appliedFilters.pageIndex !== newPageIndex ||
                appliedFilters.resetFilters
            ) {
                setLoading(true);
                setTimeout(() => {
                    const pageIndexAll = newSearchType === "all" ? 0 : updatedFilters.pageIndex;
                    searchVessels(
                        { ...updatedFilters, pageIndex: pageIndexAll },
                        newSearchType,
                        pageIndexAll,
                        newPageSize
                    );

                    setLoading(false);
                }, 500);
            }
            setAppliedFilters(updatedFilters);
        },
        [appliedFilters, finaldata]
    );

    const onChangeSearchInput = (value: string) => {
        updateVal(value);
        setLoading(true);
        if (value) {
            var filter = GradingFilter.filter((x: ManageGradingRow) =>
                x.templateName.toLowerCase().includes(value.toLowerCase()));
            setGradings(filter);
            setFinalData(filter);
            setDataCount(filter.length);

        } else {
            var filter = GradingFilter.filter((x: ManageGradingRow) =>
                x.templateName.toLowerCase().includes(value.toLowerCase()));
            setGradings(filter);
            setFinalData(filter);
            setDataCount(filter.length);

        }
    };

    useEffect(() => {
        if (loading) {
            setLoading(false);
            const pagesize = appliedFilters.pageSize != null && appliedFilters.pageSize != "" ? appliedFilters.pageSize : 5;
            searchVessels({}, "list", 0, pagesize);
            applyFilter({
                ...appliedFilters, pageIndex: 0, resetPageIndex: true
            })
        }
    }, [finaldata]);

    const loadGradings = async () => {
        try {
            setLoading(true);


            const res = await gradingService.getGradings();

            setGradings(res.data);
            setGradingFilter(res.data);
            setFinalData(res.data);
            setDataCount(res.data.length);
            sessionStorage.setItem("GradingList", JSON.stringify(res.data));

            //if (response.data) {
            //    console.log(response.data, "response.data");

            //    // Handle both array response and DataSourceResult response
            //    let dataArray: ManageGradingRow[] = [];
            //    if (Array.isArray(response.data)) {
            //        dataArray = response.data;
            //    } else if (response.data.data && Array.isArray(response.data.data)) {
            //        dataArray = response.data.data;
            //    } else if (response.data.Data && Array.isArray(response.data.Data)) {
            //        dataArray = response.data.Data;
            //    }

            //    // Set finaldata with ALL records (like AssociatedAnomalies)
            //    setFinalData(dataArray);

            //    // Set data count to total length (like AssociatedAnomalies)
            //    setDataCount(dataArray.length);
            //}
        } catch (error) {
            console.error("Error loading gradings:", error);
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

    const handleEditGrading = (row: ManageGradingRow) => {
        saveFilters();
        gradingService.navigateToEditGrading(
            row.gradingId,
            row.sectionId,
            row.tanktypeId
        );
    };

    const handleDeleteGrading = async (row: ManageGradingRow) => {
        if (window.confirm(`Are you sure you want to delete '${row.gradingName}' Grading?`)) {
            try {
                setLoading(true);
                const response = await gradingService.deleteGrading(row.gradingId, row.tanktypeId);
                if (response.data) {
                    // Reload data after deletion
                    loadGradings();
                } else {
                    alert("Grading deletion failed, Please try again later..!");
                }
            } catch (error) {
                console.error("Error deleting grading:", error);
                alert("Grading deletion failed, Please try again later..!");
            } finally {
                setLoading(false);
            }
        }
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
                cell: (info: { getValue: () => any }) => {
                    const isActive = info.getValue();
                    return isActive ? 'Active' : 'InActive';
                },
            },
            {
                label: "Required in Export",
                accessorKey: "requiredInReport",
                accessor: "requiredInReport",
                Cell: ({ row: { original = {} }, cell: { value } }: { row: { original: ManageGradingRow }, cell: { value: any } }) => {
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
                Cell: ({ row: { original = {} } }: { row: { original: ManageGradingRow } }) => {
                    return (
                        <div className='d-flex justify-content-start gap-3'>
                            <Button
                                variant={BUTTONS.TABLEDOWNLOAD}
                                startIcon={<Icon.PencilFill />}
                                onClick={() => handleEditGrading(original)}
                            />
                            <Button
                                variant={BUTTONS.TABLEDOWNLOAD}
                                startIcon={<Icon.TrashFill />}
                                onClick={() => handleDeleteGrading(original)}
                            />
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
        localStorage.removeItem("SearchGradingFilter");
        localStorage.removeItem("GradingFilter");

        // Reset pagination to first page (pageIndex 0 = 1-20)
        setAppliedFilters(prev => ({
            ...prev,
            pageIndex: 0,
            resetPageIndex: true
        }));

        if (finaldata && finaldata.length > 0) {
            const pagesize = appliedFilters.pageSize != null && appliedFilters.pageSize != ""
                ? (typeof appliedFilters.pageSize === 'string' ? parseInt(appliedFilters.pageSize, 10) : Number(appliedFilters.pageSize))
                : 20;
            // Reset to first page with all data (no search filter)
            searchVessels({}, "list", 0, pagesize, null);
            // Update dataCount to total records
            setDataCount(finaldata.length);
        }
    };


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
                    <Button>Add New Grading</Button>
                </BreadcrumbBar>
            </div>
            <div className="page-content">
                <div className="grid-container">
                    <div className="grid-sidebar">
                        <ManageGradingTemplateList />
                    </div>
                    <div className="grid-content-body">
                        <div className="row">
                            <div className="col-md-8">
                                <h5 className='_600'>Bulk Carrier - Grading</h5>
                            </div>
                            <div className="col-md-6 mb-3 mt-2">
                                <div className="d-flex justify-content-start align-items-center gap-2">
                                    <AbsSearch
                                        handleClear={() => {
                                            onChangeSearchInput("");
                                            setAppliedFilters((prev) => ({
                                                ...prev,
                                                pageIndex: 0,
                                                resetPageIndex: true,
                                                searchType: "list",
                                                filters: {},
                                            }));
                                            searchVessels({}, "list", 0, appliedFilters.pageSize || 5);
                                        }}
                                        value={val}
                                        handleChange={(e: any) => onChangeSearchInput(e.target.value)}
                                        handleSearch={() => {
                                            updateSearchApplied(val === "" ? null : val);
                                        }}
                                        placeholder="Search by Part Name, Section Name"
                                        searchApplied={searchApplied !== null}

                                    />
                                    <a onClick={() => onChangeSearchInput("")} className="ml-3 text-nowrap text-underline" >Clear Filters</a>

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
                                    dataCount={dataCount || finaldata.length}
                                    appliedFilters={{
                                        ...appliedFilters,
                                        pageSize: appliedFilters.pageSize.toString(),
                                    }}
                                    pageOptions={["20", "30", "40", "50"]}
                                    pageIndex={appliedFilters.pageIndex}
                                    pageSize={appliedFilters.pageSize.toString()}
                                    allowColumnsShowHide={false}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ManageGradingList;