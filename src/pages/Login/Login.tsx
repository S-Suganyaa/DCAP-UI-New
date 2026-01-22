import React from 'react';
import ABSLogo from '../../assets/images/ABSLogo.svg';
import {
      Button,
      BUTTONS, Input,
} from 'customer_portal-ui-shared';

const Login: React.FC = () => {
      const [value, setValue] = React.useState<string>("");

      return <>
            <div className="login-wrapper">
                  <div className="container">
                        <div className="login-content">
                              <div className="row justify-content-center">
                                    <div className="col-md-6">
                                          <div className="form-block">
                                                <div className="img-logo mb-25">
                                                      <img src={ABSLogo} alt="DCAP Logo"
                                                            className="filter-dark-blue login-logo" />
                                                </div>

                                                <div className="red-line"></div>

                                                <div className="mt-25 mb-25">
                                                      <h3 className="login-title">Condition Assessment Program (CAP)</h3>
                                                </div>
                                                <div className="login-form">
                                                      <div className="form-group">
                                                             <Input
                                                                  label="Email Address"
                                                                  placeholder="Email"
                                                                  value={value}
                                                                  onChange={(e:any) => setValue(e.target.value)}
                                                            />
                                                       </div>
                                                      <div className="login-actions d-flex justify-content-between mt-30">
                                                            <Button variant={BUTTONS.SECONDARY} >Request Access</Button>
                                                            <Button variant={BUTTONS.PRIMARY} >Next</Button>
                                                      </div>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
      </>;
};

export default Login;
