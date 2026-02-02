import React from 'react';
import { BreadcrumbBar, Button, AbsReactTable, BUTTONS, Divider, Input, AbsSelect, AbsSearch, CheckboxInput, RadioInput, Label } from "customer_portal-ui-shared";
import * as Icon from 'react-bootstrap-icons';
import ManageDescTemplateList from './ManageDescTemplateList';
import { Modal, Offcanvas } from 'react-bootstrap';

interface ManageDescriptionRow {
    user_role: string;

}
type FormData = {
    user_role: string;


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
        user_role: "",

    });


    return (
        <>
            <div className="row">
                <div className="col-md-8">
                    <h5 className='_600'> Manage Permissions</h5>
                </div>
                <div className="col-md-6 mb-3 mt-2">

                    <Label name="Select User Role" bold />
                    <AbsSelect mult={false}
                        onChange={(selected: string[] | any) =>
                            setFormData({ ...formData, user_role: (selected && selected[0]) || "" })
                        }
                        options={[
                            { text: "CAP User", value: "1" },
                            { text: "CAP Admin", value: "2" },
                        ]}
                        selected={[formData.user_role]}
                        placeholder="Select User Role "
                    />

                </div>
                 <div className="col-md-6  d-flex justify-content-end mt-4">
                                    <div className="d-flex justify-content-end align-items-center gap-2">
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
                <table className='table table-bordered custom-table'>
                    <thead>
                        <tr>
                            <th>Pages</th>
                            <th>View</th>
                            <th>Create/Edit </th>
                            <th>Delete</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                Project Files
                            </td>
                            <td>
                                <CheckboxInput label=" " checked={checked} onChange={setChecked} />
                            </td>
                            <td>
                                <CheckboxInput label=" " checked={checked} onChange={setChecked} />
                            </td>
                            <td>
                                <CheckboxInput label=" " checked={checked} onChange={setChecked} />
                            </td>

                        </tr>

                        <tr>
                            <td>
                                Report-Edit
                            </td>
                            <td>
                                <CheckboxInput label=" " checked={checked} onChange={setChecked} />
                            </td>
                            <td>
                                <CheckboxInput label=" " checked={checked} onChange={setChecked} />
                            </td>
                            <td>
                                <CheckboxInput label=" " checked={checked} onChange={setChecked} />
                            </td>

                        </tr>

                        <tr>
                            <td>
                                Revenue Tracker
                            </td>
                            <td>
                                <CheckboxInput label=" " checked={checked} onChange={setChecked} />
                            </td>
                            <td>
                                <CheckboxInput label=" " checked={checked} onChange={setChecked} />
                            </td>
                            <td>
                                <CheckboxInput label=" " checked={checked} onChange={setChecked} />
                            </td>

                        </tr>
                        <tr>
                            <td>
                                Manage Tank
                            </td>
                            <td>
                                <CheckboxInput label=" " checked={checked} onChange={setChecked} />
                            </td>
                            <td>
                                <CheckboxInput label=" " checked={checked} onChange={setChecked} />
                            </td>
                            <td>
                                <CheckboxInput label=" " checked={checked} onChange={setChecked} />
                            </td>

                        </tr>

                        <tr>
                            <td>
                                Manage Grades
                            </td>
                            <td>
                                <CheckboxInput label=" " checked={checked} onChange={setChecked} />
                            </td>
                            <td>
                                <CheckboxInput label=" " checked={checked} onChange={setChecked} />
                            </td>
                            <td>
                                <CheckboxInput label=" " checked={checked} onChange={setChecked} />
                            </td>

                        </tr>

                        <tr>
                            <td>
                                Document-Internal Invoicing
                            </td>
                            <td>
                                <CheckboxInput label=" " checked={checked} onChange={setChecked} />
                            </td>
                            <td>
                                <CheckboxInput label=" " checked={checked} onChange={setChecked} />
                            </td>
                            <td>
                                <CheckboxInput label=" " checked={checked} onChange={setChecked} />
                            </td>

                        </tr>

                    </tbody>
                </table>
            </div>
        </>

    );
};

export default PermissionList;