import React, { useState, useEffect, useRef, ReactNode } from "react";
import { ConversationalFormTypes, ConversationalForm } from "powerui";
import { DomainService } from "../service/DomainService";
import DomainList from "../DomainList";
import { composeActions } from "./ActionBuilder";
import * as Service from "./service";
import { FormAction } from "powerui/types/uispec.types";
import { SpecDefinition } from "powerui/types/DynamicFormTypes";
import "./style.css";

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
    const [state, setState] = useState<Record<string, any>>({});
    const stateRef = useRef<Record<string, any>>(state);
    const [data, setData] = useState<Record<string, any>>({});
    const dataRef = useRef<Record<string, any>>({});
    const [formSchema, setFormSchema] = useState<ConversationalFormTypes.FormSchema>();
    const [editMode, setEditMode] = useState(true);
    const [specDefinition, setSpecDefinition] = useState<SpecDefinition>();
    const [actions, setActions] = useState<ReactNode>();

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    useEffect(() => {
        dataRef.current = data;
    }, [data]);

    const onActionClick = async (actionSchema: FormAction, payload: Record<string, string | number>) => {
        const response = await Service.onActionClick(
            props.apiBaseUrl,
            props.space,
            props.domain,
            props.reference,
            props.authorization,
            actionSchema,
            payload,
            stateRef.current)
        switch (actionSchema.type) {
            case "save":
                setState(response);
                setData(response);
                break;
            case "reset":
                setState({ ...dataRef.current });
                break;
            case "generate":
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

            DomainService.getMeta(props.apiBaseUrl, props.space, props.domain, props.authorization).then((response: SpecDefinition) => {
                setSpecDefinition(response);
            })

            refreshData();

        }
    }, [props.authorization]);

    const [saving, setSaving] = useState(false);

    const handleChange = (e: Record<string, any>) => {
        console.log(state);
        setState(e);
    }

    const refreshData = () => {
        DomainService.getById(props.apiBaseUrl, props.space, props.domain, props.reference, props.authorization).then((response) => {
            const _data: any = response;
            setState(_data);
            setData(_data);
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

    return (
        <>
            <div className="serviceui-domainviewer">
                <div className="serviceui-domainviewer__main">
                    {formSchema?.header && <header>
                        <h2>{getValue(formSchema?.header.title, data)}</h2>
                        {formSchema?.header.subtitle && <p>{getValue(formSchema?.header.subtitle, data)}</p>}
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
                                    [child.field.child]: data[child.field.parent]
                                }}
                                parentDomain={props.domain}
                                parentReference={props.reference}
                                schema={child.listSchema}
                            />
                        </div>
                    ))}
                </div>}
            </div>
        </>
    );
};

export default DomainViewer;
