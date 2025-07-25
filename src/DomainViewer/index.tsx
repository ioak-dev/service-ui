import React, { useState, useEffect, useRef, ReactNode } from "react";
import { ConversationalFormTypes, ConversationalForm } from "powerui";
import { DomainService } from "../service/DomainService";
import DomainList from "../DomainList";
import { composeActions } from "./ActionBuilder";
import * as DomainListService from "../DomainList/service";
import { DomainVersion, FormAction } from "powerui/types/uispec.types";
import { SpecDefinition } from "powerui/types/DynamicFormTypes";
import "./style.css";
import { getClassName } from "../utils/ClassNameUtils";
import VersionHistory from "./VersionHistory";

export type DomainViewerProps = {
    apiBaseUrl: string;
    space: string;
    domain: string;
    reference: string;
    authorization: { isAuth: boolean, access_token: string };
};


const BASE_CLASS = "serviceui-domainviewer";

/**
 * Component to present the given domain record and its related entities.
 */
const DomainViewer = (props: DomainViewerProps) => {
    const [state, setState] = useState<Record<string, any>>({});
    const stateRef = useRef<Record<string, any>>(state);
    const [data, setData] = useState<Record<string, any>>({});
    const dataRef = useRef<Record<string, any>>({});
    const [formSchema, setFormSchema] = useState<ConversationalFormTypes.FormSchema>();
    const [actions, setActions] = useState<ReactNode>();
    const [activeVersion, setActiveVersion] = useState<string>();
    const [versionList, setVersionList] = useState<DomainVersion[]>([]);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    useEffect(() => {
        dataRef.current = data;
    }, [data]);

    const onActionClick = async (actionSchema: FormAction, payload: Record<string, string | number>) => {
        switch (actionSchema.type) {
            case "save":
                const response = await DomainListService.onSave(
                    props.apiBaseUrl,
                    props.space,
                    props.domain,
                    props.reference,
                    stateRef.current,
                    props.authorization
                );
                setState(response);
                setData(response);
                console.log(response, formSchema?.versioning);
                // if (formSchema?.versioning) {
                    setActiveVersion(response.__version);
                // }
                break;
            case "reset":
                setState({ ...dataRef.current });
                break;
            case "generate":
                await DomainListService.onGenerate(props.apiBaseUrl,
                    props.space,
                    actionSchema,
                    props.reference,
                    undefined,
                    undefined,
                    payload,
                    props.authorization
                );
                refreshData();
        }
    }

    useEffect(() => {
        if (props.authorization.isAuth) {
            DomainService.getForm(props.apiBaseUrl, props.space, props.domain, props.authorization).then((response) => {
                const _data: ConversationalFormTypes.FormSchema = response;
                setActions(composeActions(
                    _data.header?.actions,
                    onActionClick
                ));
                setFormSchema(_data);
            });

            refreshData();

        }
    }, [props.authorization]);

    useEffect(() => {
        if (props.authorization.isAuth && formSchema?.versioning) {
            DomainService.getVersionHistory(props.apiBaseUrl, props.space, props.domain, props.reference, props.authorization).then((response) => {
                setVersionList(response);
            });
        }
    }, [props.authorization, data, formSchema])

    const handleChange = (e: Record<string, any>) => {
        setState(e);
    }

    const refreshData = (_activeVersion?: string) => {
        let _version = _activeVersion;
        if (!_version) {
            _version = activeVersion
        }
        DomainService.getById(props.apiBaseUrl, props.space, props.domain, props.reference, props.authorization, _version).then((response) => {
            const _data: any = response;
            setState(_data);
            setData(_data);
            setActiveVersion(response.__version);
        });
    }

    const getValue = (
        dataSpec?: { type: "static" | "dynamic", field?: string, value?: string },
        data?: Record<string, any>
    ): string | undefined => {
        if (!dataSpec || !data) {
            return undefined;
        }

        if (dataSpec.type === "static") {
            return dataSpec.value;
        }

        if (!dataSpec.field) {
            return undefined;
        }

        const path = dataSpec.field.split(".");

        const result = path.reduce((acc, key) => {
            if (acc && typeof acc === "object" && key in acc) {
                return acc[key];
            }
            return undefined;
        }, data);

        return result != null ? String(result) : undefined;
    };

    const handleVersionChange = (e: string) => {
        refreshData(e);
    }

    return (
        <>
            <div className={BASE_CLASS}>
                <div className={getClassName(BASE_CLASS, ["main"])}>
                    {formSchema?.header && <header className={getClassName(BASE_CLASS, ["main", "header"])}>
                        {formSchema.versioning && <VersionHistory
                            activeVersion={activeVersion}
                            versionList={versionList}
                            onChange={handleVersionChange}
                        />}
                        <div>
                            {formSchema.versioning && activeVersion && <div className={getClassName(BASE_CLASS, ["main", "header", "version"], [], "small")}>v{activeVersion}</div>}
                            <h2>{getValue(formSchema?.header.title, data)}</h2>
                            {formSchema?.header.subtitle && <p>{getValue(formSchema?.header.subtitle, data)}</p>}
                        </div>
                    </header>}
                    <div>
                        {formSchema && <ConversationalForm
                            formData={state}
                            onChange={handleChange}
                            schema={formSchema}
                            actions={actions}
                        />}
                    </div>
                </div>
                {formSchema?.children && <div>
                    {formSchema?.children?.map(child => (
                        <div>
                            <DomainList
                                apiBaseUrl={props.apiBaseUrl}
                                authorization={props.authorization}
                                domain={child.domain}
                                space={props.space}
                                constraintFilters={{
                                    [child.field.child]: props.reference
                                }}
                                parentReference={props.reference}
                                parentVersion={activeVersion}
                                formSchemaId={child.formSchemaId}
                            />
                        </div>
                    ))}
                </div>}
            </div>
        </>
    );
};

export default DomainViewer;
