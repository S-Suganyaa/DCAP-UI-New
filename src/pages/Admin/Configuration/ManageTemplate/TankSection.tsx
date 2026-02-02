import React from 'react';
import {   Button,  BUTTONS,  CheckboxInput } from "customer_portal-ui-shared";
import * as Icon from 'react-bootstrap-icons';
 
const TankSection: React.FC = () => {
    
    const [checked, setChecked] = React.useState();

    return (
        <>
            <div className="form-area">
                <table className='table table-bordered custom-table'>
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

                        <tr>
                            <td>
                                Cargo Tank
                            </td>

                            <td>
                                32
                            </td>
                            <td>
                                22
                            </td>
                            <td>
                                10
                            </td>
                            <td>
                                <CheckboxInput label=" " checked={checked} onChange={setChecked} />
                            </td>
                            <td>
                                <div className='d-flex justify-content-start gap-3'>
                                    <Button variant={BUTTONS.TABLEDOWNLOAD} startIcon={<Icon.PencilFill />}></Button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody>

                        <tr>
                            <td>
                                Slop Tank                            
                            </td>

                            <td>
                                32
                            </td>
                            <td>
                                22
                            </td>
                            <td>
                                10
                            </td>
                            <td>
                                <CheckboxInput label=" " checked={checked} onChange={setChecked} />
                            </td>
                            <td>
                                <div className='d-flex justify-content-start gap-3'>
                                    <Button variant={BUTTONS.TABLEDOWNLOAD} startIcon={<Icon.PencilFill />}></Button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </>
    )
}

export default TankSection;