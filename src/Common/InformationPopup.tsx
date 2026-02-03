import React from "react";
import Modal from 'react-bootstrap/Modal';
import { Button } from 'customer_portal-ui-shared';
import { GetTitle, GetPopupMessage, Buttons } from './UtilityMessage';
import Spinner from 'react-bootstrap/Spinner';

interface InformationPopup
{
    onShow: boolean;
    onClose: () => void;
    pageName?: string;
    name?: string;
    status?: string;
    applicationName?: string;
    skippedExaminationNames?: string;
    loading?: boolean;
    onDownload?: () => void; // Made optional
    Continue?: () => void;   // Made optional
    okClose?: () => void;    // Made optional
    nextPage?: boolean;      // Made optional
}

export default function InformationPopup({
    onShow,
    onClose,
    pageName,
    name,
    status,
    applicationName,
    skippedExaminationNames,
    loading,
    onDownload,
    Continue,
    okClose,
    nextPage
}: InformationPopupProps) {

    const handleClose = () => {
        onClose();
    };

    return (
        <>
            <Modal size="lg" show={onShow} onHide={handleClose} centered>
                <Modal.Header>
                    <Modal.Title>
                        {GetTitle(pageName)}
                    </Modal.Title>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        onClick={handleClose}
                        aria-label="Close"
                    ></button>
                </Modal.Header>
                <Modal.Body>
                    <p className="px-10">
                        {GetPopupMessage(pageName, name, status, applicationName, skippedExaminationNames)}
                    </p>
                    <div className="d-flex justify-content-end fixed-action-btns gap-2">
                        {pageName === 'FileSizeExceeded' || pageName === 'FileType' ? (
                            <>
                                {loading ? (
                                    <Button variant="primary" disabled>
                                        <Spinner
                                            size="sm"
                                            animation="border"
                                        />
                                    </Button>
                                ) : (
                                    onDownload && (
                                        <Button onClick={onDownload} variant="primary">
                                            Download File
                                        </Button>
                                    )
                                )}
                                <Button onClick={handleClose} variant="secondary">
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <>
                                {nextPage && Continue && (
                                    <Button onClick={Continue}>{Buttons.Continue}</Button>
                                )}
                                {status ? (
                                    <Button onClick={okClose}>{Buttons.ok}</Button>
                                ) : (
                                    <Button onClick={handleClose}>{Buttons.ok}</Button>
                                )}
                            </>
                        )}
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}