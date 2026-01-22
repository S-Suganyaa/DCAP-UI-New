import React from 'react';
import { BreadcrumbBar, Button, AbsReactTable,  BUTTONS, AbsSearch } from "customer_portal-ui-shared";
import * as Icon from 'react-bootstrap-icons'; 
import ManageDescTemplateList from './ManageDescTemplateList';

interface ManageDescriptionRow {
    partname: string;
    sectionname: string | string[];
    description: string;
    status: string;
    action?: unknown;
}

const ManageDescriptionList: React.FC = () => {
    const [val, updateVal] = React.useState<string>("");
    const [searchApplied, updateSearchApplied] = React.useState<string | null>(null);

    const columns = React.useMemo<Array<any>>(
        () => [
            {
                label: "Part Name",
                accessorKey: "partname",
                accessor: "partname",
                cell: (info: { getValue: () => any }) => info.getValue(),
            },
            {
                label: "Section Name",
                accessorKey: "sectionname",
                accessor: "sectionname",
                cell: (info: { getValue: () => any }) => {
                    const values = info.getValue();
                    return Array.isArray(values) ? values.join(", ") : values;
                },
            },
            {
                label: "Description",
                accessorKey: "description",
                accessor: "description",
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
                Cell: ({ row: { original = {} }, cell: { value } }: { row: { original: ManageDescriptionRow }, cell: { value: any } }) => {
                    return (
                        <Button variant={BUTTONS.TABLEDOWNLOAD} startIcon={<Icon.Pencil />}></Button>
                    );
                }
            },
        ],
        []
    );

    const data = React.useMemo<ManageDescriptionRow[]>(
        () => [
            {
                partname: "Part A",
                sectionname: "Anchoring and Mooring",
                description: "This is a sample description for the  section.",
                status: "Active"
            },
            {
                partname: "Part B",
                sectionname: "Deck Fitting",
                description: "This is a sample description for the section.",
                status: "InActive"
            },
            {
                partname: "Part C",
                sectionname: "Deck Piping",
                description: "This is a sample description for the section.",
                status: "Active"
            }
        ],
        []
    );

    return (
        <>
            <div className="page-title">
                <BreadcrumbBar
                    pageName="Manage Descriptions"
                    parentPages={[
                        {
                            name: "Project Configuration",
                            link: ""
                        }
                    ]}>
                    <Button>Add New Description</Button>
                </BreadcrumbBar>
            </div>
            <div className="page-content">
                <div className="grid-container">
                    <div className="grid-sidebar">
                        <ManageDescTemplateList />
                    </div>
                    <div className="grid-content-body">
                        <div className="row">
                            <div className="col-md-8">
                                <h5 className='_600'>  Bulk Carrier - Descriptions</h5>
                            </div>
                            <div className="col-md-6 mb-3 mt-2">
                                <div className="d-flex justify-content-start align-items-center gap-2">
                                    <AbsSearch
                                        handleClear={() => {
                                            updateVal("");
                                            updateSearchApplied(null);
                                        }}
                                        value={val}
                                        handleChange={(e:any) => updateVal(e.target.value)}
                                        handleSearch={() => {
                                            updateSearchApplied(val === "" ? null : val);
                                        }}
                                        placeholder="Search"
                                        searchApplied={searchApplied !== null}
                                    />  
                                    <a href="#" className='text-link text-nowrap _500'>Clear Filter</a>
                                </div>
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
                    </div>
                </div>
            </div>
        </>
    );
};

export default ManageDescriptionList;