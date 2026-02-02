import React from 'react';
import { BreadcrumbBar, Button, AbsReactTable, Divider, BUTTONS, CheckboxInput, Label, AbsSelect, } from "customer_portal-ui-shared";

const ManageExport: React.FC = () => {
    type FormData = {
        vessel_type: string;
    };
    const [formData, setFormData] = React.useState<FormData>({
        vessel_type: "",
    });
    const [checked, setChecked] = React.useState();

    return (
        <>
            <div className="page-title">
                <BreadcrumbBar
                    pageName="Manage Custom Export Settings"
                    parentPages={[
                        {
                            name: "Project Configuration",
                            link: ""
                        }
                    ]}>

                </BreadcrumbBar>
            </div>
            <div className="page-content p-4">

                <div className="content-body">
                    <div className="row">
                        <div className="col-md-4 form-group">
                            <Label name="Vessel Type" bold />
                            <AbsSelect mult={false}
                                onChange={(selected: string[] | any) =>
                                    setFormData({ ...formData, vessel_type: (selected && selected[0]) || "" })
                                }
                                options={[
                                    { text: "Bulk Carrier", value: "1" },
                                    { text: "Gas Carrier", value: "2" },
                                    { text: "Chemical Carrier", value: "3" },
                                    { text: "Oil Carrier", value: "3" },
                                ]}
                                selected={[formData.vessel_type]}
                                placeholder="Select a Vessel Type"
                            />
                        </div>
                        <div className="col-md-8 form-group">
                            <Label name="Select Mandate Parts for export" bold />
                            <div className='d-flex justify-content-start gap-3 mt-3'>
                                <CheckboxInput label="Part A" checked={checked} onChange={setChecked} />
                                <CheckboxInput label="Part B" checked={checked} onChange={setChecked} />
                                <CheckboxInput label="Part C" checked={checked} onChange={setChecked} />
                                <CheckboxInput label="Part D" checked={checked} onChange={setChecked} />
                                <CheckboxInput label="Part E" checked={checked} onChange={setChecked} />
                                <CheckboxInput label="Part G" checked={checked} onChange={setChecked} />
                                <CheckboxInput label="Part H" checked={checked} onChange={setChecked} />

                            </div>
                        </div>
                    </div>
                    <div className="card mb-3">
                        <div className="card-header">
                            <h6 className='_600 mb-0'>  Part A</h6>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className='checkbox-grid gap-3 mt-3'>
                                        <CheckboxInput label="Main Deck" checked={checked} onChange={setChecked} />
                                        <CheckboxInput label="Anchoring and Mooring" checked={checked} onChange={setChecked} />
                                        <CheckboxInput label="Deck Piping" checked={checked} onChange={setChecked} />
                                        <CheckboxInput label="Deck Fitting" checked={checked} onChange={setChecked} />
                                        <CheckboxInput label="Miscellaneous" checked={checked} onChange={setChecked} />
                                        <CheckboxInput label="Underdeck Foreship Store" checked={checked} onChange={setChecked} />
                                        <CheckboxInput label="Pumproom" checked={checked} onChange={setChecked} />
                                        <CheckboxInput label="Cargo Control Room" checked={checked} onChange={setChecked} />
                                        <CheckboxInput label="Inert Gas System" checked={checked} onChange={setChecked} />
                                        <CheckboxInput label="Fuel Tanks" checked={checked} onChange={setChecked} />
                                        <CheckboxInput label="Fresh Water Tanks" checked={checked} onChange={setChecked} />
                                        <CheckboxInput label="Lube Oil Tank" checked={checked} onChange={setChecked} />
                                        <CheckboxInput label="Additional Tank" checked={checked} onChange={setChecked} />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="card mb-3">
                        <div className="card-header">
                            <h6 className='_600 mb-0'>  Part B </h6>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className='checkbox-grid gap-3 mt-3'>
                                        <CheckboxInput label="Main Deck" checked={checked} onChange={setChecked} />
                                        <CheckboxInput label="Anchoring and Mooring" checked={checked} onChange={setChecked} />
                                        <CheckboxInput label="Deck Piping" checked={checked} onChange={setChecked} />
                                        <CheckboxInput label="Deck Fitting" checked={checked} onChange={setChecked} />
                                        <CheckboxInput label="Miscellaneous" checked={checked} onChange={setChecked} />
                                        <CheckboxInput label="Underdeck Foreship Store" checked={checked} onChange={setChecked} />
                                        <CheckboxInput label="Pumproom" checked={checked} onChange={setChecked} />
                                        <CheckboxInput label="Cargo Control Room" checked={checked} onChange={setChecked} />
                                        <CheckboxInput label="Inert Gas System" checked={checked} onChange={setChecked} />
                                        <CheckboxInput label="Fuel Tanks" checked={checked} onChange={setChecked} />
                                        <CheckboxInput label="Fresh Water Tanks" checked={checked} onChange={setChecked} />
                                        <CheckboxInput label="Lube Oil Tank" checked={checked} onChange={setChecked} />
                                        <CheckboxInput label="Additional Tank" checked={checked} onChange={setChecked} />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12 form-group">
                            <Divider className="divider-1" />
                        </div>
                        <div className="col-md-12 form-group">
                            <div className="d-flex gap-2 justify-content-end">
                                <Button variant={BUTTONS.SECONDARY}>Cancel</Button>
                                <Button variant={BUTTONS.PRIMARY}>SaveChanges</Button>
                            </div>
                        </div>     
                    </div>
                </div>
            </div>




        </>
    );
};

export default ManageExport;