import React, { useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalPlacement } from "basicui";
import { DomainVersion, FormAction } from "powerui/types/uispec.types";
import { ConversationalForm } from "powerui";
import VersionTree from "../DomainViewer/VersionHistory/VersionTree";
import { DomainService } from "../service/DomainService";

type VersionHistoryActionHandlerProps = {
    apiBaseUrl: string;
    space: string;
    domain: string;
    authorization: { isAuth: boolean, access_token: string };
    pendingAction: { action: FormAction, reference: string } | null;
    activeVersions?: Record<string, string>;
    onCancel: () => void;
    onChange: (e: string) => void;
};

const VersionHistoryActionHandler = (props: VersionHistoryActionHandlerProps) => {
    if (!props.pendingAction || props.pendingAction.action.type !== "version") {
        return;
    }
    const [activeVersion, setActiveVersion] = useState<string>();
    const [versionList, setVersionList] = useState<DomainVersion[]>([]);

    useEffect(() => {
        if (props.authorization.isAuth && props.pendingAction?.reference) {
            DomainService.getVersionHistory(props.apiBaseUrl, props.space, props.domain, props.pendingAction?.reference, props.authorization).then((response) => {
                setVersionList(response);
            });
        }
    }, [props.authorization, props.pendingAction]);

    useEffect(() => {
        if (props.pendingAction?.reference && props.activeVersions) {
            setActiveVersion(props.activeVersions[props.pendingAction?.reference]);
        }
    }, [props.activeVersions, props.pendingAction]);

    return (
        <Modal isOpen={!!props.pendingAction} onClose={props.onCancel} placement={ModalPlacement.side}>
            <ModalHeader onClose={props.onCancel} heading="Version tree" />
            <ModalBody>
                <VersionTree activeVersion={activeVersion} versionList={versionList} onActiveVersionChange={props.onChange} />
            </ModalBody>
        </Modal>
    );
}

export default VersionHistoryActionHandler;
