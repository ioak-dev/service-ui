import React, { useState, useEffect, ReactNode, useRef } from "react";
import { Input, SvgIcon, Button, ButtonVariantType, ThemeType } from 'basicui';
// import Topbar from "basicui/components/AppShellReveal/Topbar";
import { ConversationalFormTypes, List, SearchBar } from "powerui";
import { DomainService } from "../service/DomainService";
import { SpecDefinition } from "powerui/types/DynamicFormTypes";
import { FormAction, ListSchema } from "powerui/types/uispec.types";
import { composeActions } from "../DomainViewer/ActionBuilder";
import * as Service from './service';

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

    useEffect(() => {
        checkedItemsRef.current = checkedItems;
    }, [checkedItems]);

    const [actions, setActions] = useState<{ noneSelect: ReactNode[], singleSelect: ReactNode[], multiSelect: ReactNode[] }>({
        noneSelect: [], singleSelect: [], multiSelect: []
    });

    const onActionClick = async (actionSchema: FormAction, payload: Record<string, string | number>) => {
        const response = await Service.onActionClick(
            props.apiBaseUrl,
            props.space,
            props.domain,
            checkedItemsRef.current,
            props.parentDomain,
            props.parentReference,
            props.authorization,
            actionSchema,
            payload);
        console.log(response);
        setCheckedItems([]);
        handleSearch();
        switch (actionSchema.type) {
            case "delete":
            case "generate":
                break;
        }
    }

    useEffect(() => {
        const noneSelect = composeActions(props.schema.header?.actionMap?.noneSelect, onActionClick);
        const singleSelect = composeActions(props.schema.header?.actionMap?.singleSelect, onActionClick);
        const multiSelect = composeActions(props.schema.header?.actionMap?.multiSelect, onActionClick);
        setActions({ noneSelect, singleSelect, multiSelect });
    }, [props.schema])

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

    const handleClick = () => { }

    const filters: any[] = [];

    return (
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
                />}
            </div>
        </div>
    );
};

export default DomainList;
