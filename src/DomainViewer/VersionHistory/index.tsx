import React, { useState, useEffect, useRef, ReactNode } from "react";
import "./style.css";
import { ButtonVariantType, IconButton, Modal, ModalBody, ModalHeader, ModalPlacement, SvgIcon } from "basicui";
import VersionTree from "./VersionTree";
import { DomainVersion } from "powerui/types/uispec.types";

export type VersionHistoryProps = {
    versionList: DomainVersion[];
    activeVersion?: string;
    onChange: (e: string) => void;
};


const BASE_CLASS = "serviceui-versionhistory";

const VersionHistory = (props: VersionHistoryProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className={BASE_CLASS}>
                <IconButton circle variant={ButtonVariantType.outline} onClick={() => setIsOpen(true)}>
                    <SvgIcon height={16} width={16}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M176 120C189.3 120 200 130.7 200 144C200 157.3 189.3 168 176 168C162.7 168 152 157.3 152 144C152 130.7 162.7 120 176 120zM208.4 217.2C236.4 204.8 256 176.7 256 144C256 99.8 220.2 64 176 64C131.8 64 96 99.8 96 144C96 176.8 115.7 205 144 217.3L144 422.6C115.7 435 96 463.2 96 496C96 540.2 131.8 576 176 576C220.2 576 256 540.2 256 496C256 463.2 236.3 435 208 422.7L208 336.1C234.7 356.2 268 368.1 304 368.1L390.7 368.1C403 396.4 431.2 416.1 464 416.1C508.2 416.1 544 380.3 544 336.1C544 291.9 508.2 256.1 464 256.1C431.2 256.1 403 275.8 390.7 304.1L304 304C254.1 304 213 265.9 208.4 217.2zM176 472C189.3 472 200 482.7 200 496C200 509.3 189.3 520 176 520C162.7 520 152 509.3 152 496C152 482.7 162.7 472 176 472zM440 336C440 322.7 450.7 312 464 312C477.3 312 488 322.7 488 336C488 349.3 477.3 360 464 360C450.7 360 440 349.3 440 336z" /></svg>
                    </SvgIcon>
                </IconButton>
            </div>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} placement={ModalPlacement.side}>
                <ModalHeader onClose={() => setIsOpen(false)} heading="Version history" />
                <ModalBody>
                    <VersionTree versionList={props.versionList} activeVersion={props.activeVersion} onActiveVersionChange={props.onChange} />
                </ModalBody>
            </Modal>
        </>
    );
};

export default VersionHistory;
