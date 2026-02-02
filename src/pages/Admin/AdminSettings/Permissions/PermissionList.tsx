import React from 'react';
import { BreadcrumbBar, Button, AbsReactTable, BUTTONS, Divider, Input, AbsSelect, AbsSearch, CheckboxInput, RadioInput, Label } from "customer_portal-ui-shared";
import * as Icon from 'react-bootstrap-icons';
import ManageDescTemplateList from './ManageDescTemplateList';
import { Modal, Offcanvas } from 'react-bootstrap';

interface ManageDescriptionRow {
    partname: string;
    sectionname: string | string[];
    description: string;
    status: string;
    action?: unknown;
}
type FormData = {
    template_name: string;
    part_name: string;
    section_name: string;
    description_name: string;
    activation_status: boolean;

};
 
const PermissionList: React.FC = () => {
         const [val, updateVal] = React.useState<string>("");
         const [value, updateValue] = React.useState<string>("");
         const [searchApplied, updateSearchApplied] = React.useState<string | null>(null);
         const [checked, setChecked] = React.useState<boolean>(false);
         const [open, setOpen] = React.useState<boolean>();
         const [deleteModel, setDeleteModel] = React.useState<boolean>();
     
         const [selected, setSelected] = React.useState<number | undefined>();
         const [formData, setFormData] = React.useState<FormData>({
             template_name: "",
             part_name: "",
             section_name: "",
             description_name: "",
             activation_status: "",
     
         });
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
             </>
     
         );
};

export default PermissionList;