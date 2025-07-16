import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "basicui";
import React, { useState } from "react";
import { ActionBuilderProps } from ".";
import { ConversationalForm } from "powerui";


const GenerateAction: React.FC<ActionBuilderProps> = (props) => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState<Record<string, string | number>>({});

    const onClick = async () => {
        if (props.actionSchema.generation?.inputFields
            && props.actionSchema.generation.inputFields.length > 0) {
            setShowModal(true);
        } else {
            await onProceed();
        }
    }

    const onProceed = async () => {
        setLoading(true);
        await props.onClick(props.actionSchema, state);
        setLoading(false);
    }

    const handleChange = (e: Record<string, any>) => {
        setState(e);
    }

    return (
        <>
            <Button
                onClick={onClick}
                loading={loading}
            >
                {props.actionSchema.label}
            </Button>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <ModalHeader onClose={() => setShowModal(false)} heading="Parameters" />
                <ModalBody>
                    {props.actionSchema.generation?.inputFields && <ConversationalForm
                        formData={state}
                        onChange={handleChange}
                        schema={{ fields: props.actionSchema.generation?.inputFields }}
                    />}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onProceed}>
                        Proceed
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default GenerateAction;
