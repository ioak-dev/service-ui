import React, { useState, useEffect, useRef } from "react";
import { Input, SvgIcon, Button, ButtonVariantType, ThemeType } from 'basicui';
// import Topbar from "basicui/components/AppShellReveal/Topbar";
import { DynamicForm, List, SearchBar } from "powerui";
import { DomainService } from "../lib/DomainService";
import { DynamicFormHandle, SpecDefinition } from "powerui/types/DynamicFormTypes";

export type DomainViewerProps = {
    apiBaseUrl: string;
    space: string;
    domain: string;
    reference: string;
    authorization: { isAuth: boolean, access_token: string };
};

/**
 * Component to present the given domain record and its related entities.
 */
const DomainViewer = (props: DomainViewerProps) => {
    const submitActionRef = useRef<DynamicFormHandle>(null);
    const [state, setState] = useState<any>({});
    const [data, setData] = useState<any>({});
    const [specDefinition, setSpecDefinition] = useState<SpecDefinition>();
    const [editMode, setEditMode] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        if (props.authorization.isAuth) {
            DomainService.getMeta(props.apiBaseUrl, props.space, props.domain, props.authorization).then((response) => {
                const _data: SpecDefinition = response;
                setSpecDefinition(_data);
            });

            DomainService.getById(props.apiBaseUrl, props.space, props.domain, props.reference, props.authorization).then((response) => {
                const _data: any = response;
                setData(_data);
                setState(_data);
            });
        }
    }, [props.authorization]);

    const [saving, setSaving] = useState(false);

    const handleChange = (fieldName: string, fieldValue: any) => {
        if (state) {
            setState({
                ...state, [fieldName]: fieldValue
            })
        }
    }

    const onSave = () => {
        setSaving(true);
        DomainService.update(props.apiBaseUrl, props.space, props.domain, props.reference, state, props.authorization).then((response) => {
            setState(response);
            setSaving(false);
            setEditMode(false);
        })
    }

    const onCancel = () => {
        setState(data);
        setEditMode(false);
    }


    return (
        <>
            <div className="serviceui-domainviewer">
                <div>
                    {!editMode && <Button onClick={() => setEditMode(true)}>Edit</Button>}
                    {editMode && <Button onClick={onSave}>Save</Button>}
                    {editMode && <Button onClick={() => setEditMode(false)}>Cancel</Button>}
                </div>
                <div>
                    {specDefinition && <DynamicForm
                        onChange={handleChange}
                        data={state}
                        metadata={specDefinition}
                        editMode={editMode}
                        optionsLookupDictionary={{}}
                        ref={submitActionRef}
                    />}
                </div>
            </div>
            {/* <CreatePopup space={props.space} isOpen={isOpen} onClose={() => setIsOpen(false)} /> */}
        </>
    );
};

export default DomainViewer;
