import React from 'react';
import { BreadcrumbBar, Button, AbsReactTable,  BUTTONS, AbsSearch,CheckboxInput } from "customer_portal-ui-shared";
import * as Icon from 'react-bootstrap-icons';  
import ManageGradingTemplateList from './ManageGradingTemplateList';

interface ManageGradingRow {
    partname: string;
    sectionname: string ;
    gradingname: string;
    status: string;
    requiredexport: string;
    action?: unknown;
}

const ManageGradingList: React.FC = () => {
    const [val, updateVal] = React.useState<string>("");
    const [searchApplied, updateSearchApplied] = React.useState<string | null>(null);
    const [checked, setChecked] = React.useState<boolean>();

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
                cell: (info: { getValue: () => any }) => info.getValue(),

            },
            {
                label: "Grading Name",
                accessorKey: "gradingname",
                accessor: "gradingname",
                cell: (info: { getValue: () => any }) => info.getValue(),
            },
            {
                label: "Status",
                accessorKey: "status",
                accessor: "status",
                cell: (info: { getValue: () => any }) => info.getValue(),
            },
            {
                label: "Required in Export",
                accessorKey: "requiredexport",
                accessor: "requiredexport",
                 Cell: ({ row: { original = {} }, cell: { value } }: { row: { original: ManageGradingRow }, cell: { value: any } }) => {
                    return (
                        <div className='d-flex justify-content-center gap-3'>
                            <CheckboxInput label=" " checked={checked} onChange={setChecked} />
 
                        </div>
                    );
                }
            },
            {
                label: "Action",
                accessorKey: "action",
                accessor: "action",
                filter: false,
                Cell: ({ row: { original = {} }, cell: { value } }: { row: { original: ManageGradingRow }, cell: { value: any } }) => {
                    return (
                        <div className='d-flex justify-content-start gap-3'>
                        <Button variant={BUTTONS.TABLEDOWNLOAD} startIcon={<Icon.PencilFill />}></Button>
                        <Button variant={BUTTONS.TABLEDOWNLOAD} startIcon={<Icon.TrashFill />}></Button>
                        </div>
                    );
                }
            },
        ],
        []
    );

    const data = React.useMemo<ManageGradingRow[]>(
        () => [
            {
                partname: "Part A",
                sectionname: "Anchoring and Mooring",
                gradingname: "Chain Stopper",
                status: "Active",
                requiredexport:"yes"
            },
            {
                partname: "Part B",
                sectionname: "Deck Fitting",
                gradingname: "Mooring Winches with Foundations",
                status: "InActive",
                requiredexport:"no"
            },
            {
                partname: "Part C",
                sectionname: "Deck Piping",
                gradingname: "Windlasses with Foundations",
                status: "Active",
                requiredexport:"yes"
            }
        ],
        []
    );

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
                                <h5 className='_600'>  Bulk Carrier - Grading</h5>
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

export default ManageGradingList;