import React, { useState, useEffect, useRef } from "react";
import { Input, SvgIcon, Button, ButtonVariantType, ThemeType, IconButton } from 'basicui';
// import Topbar from "basicui/components/AppShellReveal/Topbar";
import { DynamicForm, List, SearchBar } from "powerui";
import { DomainService } from "../service/DomainService";
import { DynamicFormHandle, SpecDefinition } from "powerui/types/DynamicFormTypes";
import DomainList from "../DomainList";

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

    useEffect(() => {
        console.log(specDefinition);
    }, [specDefinition])

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
                <div className="serviceui-domainviewer__main">
                    <div className="serviceui-domainviewer__main__actions">
                        {!editMode && <IconButton
                            circle
                            onClick={() => setEditMode(true)}
                            variant={ButtonVariantType.fill}
                            theme={ThemeType.default}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" /></svg>
                        </IconButton>}
                        {editMode && <IconButton circle onClick={onSave} theme={ThemeType.primary}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" /></svg>
                        </IconButton>}
                        {editMode && <IconButton circle onClick={() => setEditMode(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                        </IconButton>}
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
                {specDefinition?.meta?.children && <div>
                    {specDefinition?.meta?.children?.map(child => (
                        <div>
                            <DomainList
                                apiBaseUrl={props.apiBaseUrl}
                                authorization={props.authorization}
                                domain={child.domain}
                                space={props.space}
                                constraintFilters={{
                                    [child.field.child]: data[child.field.parent]
                                }}
                            />
                        </div>
                    ))}
                </div>}
            </div>
            {/* <CreatePopup space={props.space} isOpen={isOpen} onClose={() => setIsOpen(false)} /> */}
        </>
    );
};

export default DomainViewer;
