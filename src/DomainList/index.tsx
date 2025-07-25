import React, { useState, useEffect, ReactNode, useRef, useMemo } from "react";
import { List, SearchBar } from "powerui";
import { DomainService } from "../service/DomainService";
import { FormAction, FormSchema } from "powerui/types/uispec.types";
import { composeActions } from "../DomainViewer/ActionBuilder";
import * as Service from './service';
import GenerateActionHandler from "./GenerateActionHandler";
import VersionHistoryActionHandler from "./VersionHistoryActionHandler";

export type DomainListProps = {
    apiBaseUrl: string;
    space: string;
    domain: string;
    authorization: { isAuth: boolean, access_token: string };
    showSearch?: boolean;
    constraintFilters?: Record<string, any>;
    parentReference?: string;
    parentVersion?: string;
    formSchemaId?: string;
};

/**
 * Component to render list of records for the given domain.
 */
const DomainList = (props: DomainListProps) => {

    const [schema, setSchema] = useState<FormSchema>();
    const [data, setData] = useState<any[]>([]);
    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const checkedItemsRef = useRef<string[]>([]);
    const [actions, setActions] = useState<ReactNode[]>([]);
    const [pendingAction, setPendingAction] = useState<{ action: FormAction, reference: string } | null>(null);
    const [selectedVersions, setSelectedVersions] = useState<Record<string, string>>({});

    const onActionClick = async (actionSchema: FormAction, payload: Record<string, string | number>) => {

        switch (actionSchema.type) {
            case "generate":
                // const response = await Service.onGenerate(
                //     props.apiBaseUrl,
                //     props.space,
                //     props.domain,
                //     checkedItemsRef.current,
                //     props.parentReference,
                //     props.authorization,
                //     actionSchema,
                //     payload);
                const response = await Service.onGenerate(
                    props.apiBaseUrl,
                    props.space,
                    actionSchema,
                    undefined,
                    props.parentReference,
                    props.parentVersion,
                    payload,
                    props.authorization
                )
                setCheckedItems([]);
                handleSearch();
                break;
        }
    }

    useEffect(() => {
        setActions(composeActions(schema?.header?.actions, onActionClick));
    }, [schema])

    useEffect(() => {
        checkedItemsRef.current = checkedItems;
    }, [checkedItems]);

    useEffect(() => {
        if (props.authorization.isAuth) {
            DomainService.getForm(props.apiBaseUrl, props.space, props.domain, props.authorization, props.formSchemaId).then((response: FormSchema) => {
                setSchema(_enhanceIconForActions(response));
            });
            handleSearch();
        }
    }, [props.authorization, props.constraintFilters, props.formSchemaId])

    const _enhanceIconForActions = (_schema: FormSchema): FormSchema => {
        const primaryMenu: FormAction[] = [];
        _schema.actions?.primaryMenu?.forEach(item => primaryMenu.push(_enhanceIconForAction(item)));
        const contextMenu: FormAction[] = [];
        _schema.actions?.contextMenu?.forEach(item => contextMenu.push(_enhanceIconForAction(item)));

        return { ..._schema, actions: { primaryMenu, contextMenu } };
    }

    const _enhanceIconForAction = (e: FormAction): FormAction => {
        const res = {
            ...e
        }

        if (!e.icon) {
            switch (e.type) {
                case "delete":
                    res.icon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z" /></svg>;
                    break;
                case "generate":
                    res.icon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M528 70.1C537.5 61.6 552 62 561 71L569 79C578 88 578.4 102.5 569.9 112L484.1 207.9C481.5 210.8 480 214.6 480 218.6L480 240C480 248.8 472.8 256 464 256L448.2 256C443.6 256 439.3 257.9 436.3 261.3L164.7 564.9C158.4 572 149.4 576 139.9 576C131.1 576 122.6 572.5 116.4 566.2L73.7 523.7C67.5 517.5 64 509 64 500.2C64 490.7 68 481.7 75.1 475.4L186.7 375.6C190.1 372.6 192 368.2 192 363.7L192 336.1C192 327.3 199.2 320.1 208 320.1L242.6 320.1C246.5 320.1 250.3 318.6 253.3 316L528 70.1zM496 352C499.6 352 502.7 354.4 503.7 357.8L518.5 409.5L570.2 424.3C573.6 425.3 576 428.4 576 432C576 435.6 573.6 438.7 570.2 439.7L518.5 454.5L503.7 506.2C502.7 509.6 499.6 512 496 512C492.4 512 489.3 509.6 488.3 506.2L473.5 454.5L421.8 439.7C418.4 438.7 416 435.6 416 432C416 428.4 418.4 425.3 421.8 424.3L473.5 409.5L488.3 357.8C489.3 354.4 492.4 352 496 352zM151.7 133.8L166.5 185.5L218.2 200.3C221.6 201.3 224 204.4 224 208C224 211.6 221.6 214.7 218.2 215.7L166.5 230.5L151.7 282.2C150.7 285.6 147.6 288 144 288C140.4 288 137.3 285.6 136.3 282.2L121.5 230.5L69.8 215.7C66.4 214.7 64 211.6 64 208C64 204.4 66.4 201.3 69.8 200.3L121.5 185.5L136.3 133.8C137.3 130.4 140.4 128 144 128C147.6 128 150.7 130.4 151.7 133.8zM272 64C275.7 64 278.9 66.5 279.8 70.1L286.6 97.4L313.9 104.2C317.5 105.1 320 108.3 320 112C320 115.7 317.5 118.9 313.9 119.8L286.6 126.6L279.8 153.9C278.9 157.5 275.7 160 272 160C268.3 160 265.1 157.5 264.2 153.9L257.4 126.6L230.1 119.8C226.5 118.9 224 115.7 224 112C224 108.3 226.5 105.1 230.1 104.2L257.4 97.4L264.2 70.1C265.1 66.5 268.3 64 272 64z" /></svg>;
                    break;
                case "version":
                    res.icon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M176 168C189.3 168 200 157.3 200 144C200 130.7 189.3 120 176 120C162.7 120 152 130.7 152 144C152 157.3 162.7 168 176 168zM256 144C256 176.8 236.3 205 208 217.3L208 288L384 288C410.5 288 432 266.5 432 240L432 217.3C403.7 205 384 176.8 384 144C384 99.8 419.8 64 464 64C508.2 64 544 99.8 544 144C544 176.8 524.3 205 496 217.3L496 240C496 301.9 445.9 352 384 352L208 352L208 422.7C236.3 435 256 463.2 256 496C256 540.2 220.2 576 176 576C131.8 576 96 540.2 96 496C96 463.2 115.7 435 144 422.7L144 217.4C115.7 205 96 176.8 96 144C96 99.8 131.8 64 176 64C220.2 64 256 99.8 256 144zM488 144C488 130.7 477.3 120 464 120C450.7 120 440 130.7 440 144C440 157.3 450.7 168 464 168C477.3 168 488 157.3 488 144zM176 520C189.3 520 200 509.3 200 496C200 482.7 189.3 472 176 472C162.7 472 152 482.7 152 496C152 509.3 162.7 520 176 520z" /></svg>;
                    break;
            }
        }

        return res;
    }


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
                    handleSearch();
                })
                break;
            case "generate":
                setPendingAction({
                    action: e, reference
                })
                break;
            case "version":
                setPendingAction({
                    action: e, reference
                })
                break;
        }
    }

    const handleOnGenerate = async (e: Record<string, string | number>) => {
        if (pendingAction) {
            Service.onGenerate(props.apiBaseUrl,
                props.space,
                pendingAction?.action,
                pendingAction?.reference,
                props.parentReference,
                props.parentVersion,
                e,
                props.authorization).then(response => {
                    handleSearch();
                    setPendingAction(null);
                })
        }
    }

    const filters: any[] = [];

    const handleVersionChange = async (version: string) => {
        if (pendingAction?.reference) {
            const versionedItem = await DomainService.getById(props.apiBaseUrl, props.space, props.domain, pendingAction.reference, props.authorization, version);
            versionedItem.reference = pendingAction.reference;
            setData(prev =>
                prev.map(item => item.reference === pendingAction.reference ? versionedItem : item)
            );

            setSelectedVersions(prev => ({
                ...prev,
                [pendingAction.reference]: version
            }));
        }
    };

    const displayData = useMemo(() => {
        return data.map(item => {
            const overriddenVersion = selectedVersions[item.reference];
            return overriddenVersion
                ? { ...item, __version: overriddenVersion }
                : item;
        });
    }, [data, selectedVersions]);

    useEffect(() => {
        console.log(selectedVersions);
    }, [selectedVersions])

    return (
        <>
            <div className="serviceui-domainlist">
                {props.showSearch && <div>
                    <SearchBar onSearch={handleSearch} filters={filters} />
                </div>}
                <div>
                    {schema && <List
                        checkedItems={checkedItems}
                        setCheckedItems={setCheckedItems}
                        data={displayData}
                        listSchema={schema}
                        actions={actions}
                        onActionClick={handleActionClick}
                    />
                    }
                </div>
            </div>
            <GenerateActionHandler
                pendingAction={pendingAction}
                onGenerate={handleOnGenerate}
                onCancel={() => setPendingAction(null)}
            />
            <VersionHistoryActionHandler
                pendingAction={pendingAction}
                onCancel={() => setPendingAction(null)}
                onChange={handleVersionChange}
                apiBaseUrl={props.apiBaseUrl}
                space={props.space}
                domain={props.domain}
                authorization={props.authorization}
                activeVersions={selectedVersions}
            />
        </>
    );
};

export default DomainList;
