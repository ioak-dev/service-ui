import React, { useState, useEffect, ReactNode, useRef } from "react";
// import Topbar from "basicui/components/AppShellReveal/Topbar";
import { List, SearchBar } from "powerui";
import { DomainService } from "../service/DomainService";
import { SpecDefinition } from "powerui/types/DynamicFormTypes";
import { FormAction, ListSchema } from "powerui/types/uispec.types";
import { composeActions } from "../DomainViewer/ActionBuilder";
import * as Service from './service';
import GenerateActionHandler from "./GenerateActionHandler";

export type DomainListProps = {
    apiBaseUrl: string;
    space: string;
    domain: string;
    authorization: { isAuth: boolean, access_token: string };
    showSearch?: boolean;
    constraintFilters?: Record<string, any>;
    schema: ListSchema;
    parentDomain?: string;
    parentReference?: string;
};

/**
 * Component to render list of records for the given domain.
 */
const DomainList = (props: DomainListProps) => {

    const [specDefinition, setSpecDefinition] = useState<SpecDefinition>();
    const [data, setData] = useState<any[]>([]);
    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const checkedItemsRef = useRef<string[]>([]);
    const [actions, setActions] = useState<ReactNode[]>([]);
    const [pendingAction, setPendingAction] = useState<{ action: FormAction, reference: string } | null>(null);

    const onActionClick = async (actionSchema: FormAction, payload: Record<string, string | number>) => {
        const response = await Service.onActionClick(
            props.apiBaseUrl,
            props.space,
            props.domain,
            checkedItemsRef.current,
            props.parentReference,
            props.authorization,
            actionSchema,
            payload);
        setCheckedItems([]);
        handleSearch();
        switch (actionSchema.type) {
            case "delete":
            case "generate":
                break;
        }
    }

    useEffect(() => {
        setActions(composeActions(props.schema.header?.actions, onActionClick));
    }, [props.schema])

    useEffect(() => {
        checkedItemsRef.current = checkedItems;
    }, [checkedItems]);

    useEffect(() => {
        if (props.authorization.isAuth) {
            DomainService.getMeta(props.apiBaseUrl, props.space, props.domain, props.authorization).then((response) => {
                const _data: SpecDefinition = response;
                setSpecDefinition(_data);
                console.log(_data)
            });

            console.log(props.authorization)
            handleSearch();
        }
    }, [props.authorization, props.constraintFilters])


    const handleSearch = (event?: any) => {
        DomainService.search(props.apiBaseUrl, props.space, props.domain, {
            filters: props.constraintFilters,
            pagination: { page: 1, limit: 10 }
        }, props.authorization).then((response) => {
            const _data: any[] = response.data;
            setData(_data);
        });
    }

    const handleActionClick = async (e: FormAction, reference: string) => {

        switch (e.type) {
            case "delete":
                Service.onDelete(props.apiBaseUrl, props.space, props.domain, reference, props.authorization).then(response => {
                    console.log(response);
                    handleSearch();
                })
                break;
            case "generate":
                setPendingAction({
                    action: e, reference
                })
                break;
        }
    }

    const handleOnGenerate = async (e: Record<string, string | number>) => {
        if (pendingAction) {
            Service.onGenerate(props.apiBaseUrl, props.space, pendingAction?.action, pendingAction?.reference, props.parentReference, e, props.authorization).then(response => {
                handleSearch();
                setPendingAction(null);
            })
        }
    }

    const filters: any[] = [];

    return (
        <>
            <div className="serviceui-domainlist">
                {props.showSearch && <div>
                    <SearchBar onSearch={handleSearch} filters={filters} />
                </div>}
                <div>
                    {props.schema && <List
                        checkedItems={checkedItems}
                        setCheckedItems={setCheckedItems}
                        data={data}
                        listSchema={props.schema}
                        actions={actions}
                        onActionClick={handleActionClick}
                    />}
                </div>
            </div>
            <GenerateActionHandler
                pendingAction={pendingAction}
                onGenerate={handleOnGenerate}
                onCancel={() => setPendingAction(null)}
            />
        </>
    );
};

export default DomainList;
