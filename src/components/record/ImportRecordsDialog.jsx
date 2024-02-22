import React from "react";
import {Form, Modal} from "react-bootstrap";
import classNames from "classnames";
import Dropzone from "react-dropzone";
import {FaUpload} from "react-icons/fa";
import {useI18n} from "../../hooks/useI18n";

const ImportRecordsDialog = ({onSubmit, onCancel, show}) => {
    const {i18n} = useI18n();
    const [dragActive, setDragActive] = React.useState(false);
    const onFileSelected = (files) => {
        const file = files[0];
        setDragActive(false);
        if (file) {
            onSubmit(file);
        }
    };

    const containerClasses = classNames("file-upload-dropzone", {
        active: dragActive,
    });

    return <Modal show={show} onHide={onCancel}>
        <Modal.Header closeButton={true}>
            <Modal.Title>{i18n("records.import.dialog.title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Dropzone
                onDrop={onFileSelected}
                onDragEnter={() => setDragActive(true)}
                onDragLeave={() => setDragActive(false)}
                multiple={false}
            >
                {({getRootProps, getInputProps}) => (
                    <>
                        <div {...getRootProps()} className={containerClasses}>
                            <input {...getInputProps()} />
                            <div>
                                <Form.Label className="placeholder-text w-100 text-center">
                                    {i18n("records.import.dropzone.label")}
                                </Form.Label>
                            </div>
                            <div className="w-100 icon-container text-center">
                                <FaUpload/>
                            </div>
                        </div>
                    </>
                )}
            </Dropzone>
        </Modal.Body>
    </Modal>;
}

export default ImportRecordsDialog;
