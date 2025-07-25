import React, { useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "basicui";
import { FormAction } from "powerui/types/uispec.types";
import { ConversationalForm } from "powerui";

type GenerateActionHandlerProps = {
    pendingAction: { action: FormAction, reference: string } | null;
    onGenerate: (e: Record<string, string | number>) => Promise<void>;
    onCancel: () => void;
};

const GenerateActionHandler = (props: GenerateActionHandlerProps) => {
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState<Record<string, string | number>>({});

    const onProceed = async () => {
        setLoading(true);
        console.log(state, props.pendingAction);
        await props.onGenerate(state);
        setLoading(false);
    }

    const handleChange = (e: Record<string, any>) => {
        setState(e);
    }

    return (
        <Modal isOpen={!!props.pendingAction} onClose={props.onCancel}>
            <ModalHeader onClose={props.onCancel} heading="Parameters" />
            <ModalBody>
                {props.pendingAction?.action.generation?.inputFields && <ConversationalForm
                    formData={state}
                    onChange={handleChange}
                    schema={{ fields: props.pendingAction?.action.generation?.inputFields }}
                />}
            </ModalBody>
            <ModalFooter>
                <Button onClick={onProceed} loading={loading}>
                    Proceed
                </Button>
            </ModalFooter>
        </Modal>
    );
}

export default GenerateActionHandler;
