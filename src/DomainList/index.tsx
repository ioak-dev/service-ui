import React, { useState, useEffect } from "react";
import { Input, SvgIcon, Button, ButtonVariantType, ThemeType } from 'basicui';
// import Topbar from "basicui/components/AppShellReveal/Topbar";
import { ConversationalFormTypes, List, SearchBar } from "powerui";
import { DomainService } from "../service/DomainService";
import { SpecDefinition } from "powerui/types/DynamicFormTypes";
import { ListSchema } from "powerui/types/uispec.types";

export type DomainListProps = {
    apiBaseUrl: string;
    space: string;
    domain: string;
    authorization: { isAuth: boolean, access_token: string };
    showSearch?: boolean;
    constraintFilters?: Record<string, any>;
    schema: ListSchema;
};

/**
 * Component to render list of records for the given domain.
 */
const DomainList = (props: DomainListProps) => {

    const [specDefinition, setSpecDefinition] = useState<SpecDefinition>();
    const [data, setData] = useState<any[]>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const [isOpen, setIsOpen] = useState(false);

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

    const handleDelete = () => { }

    const handleClick = () => { }

    const handleSelect = (event: any) => {
        const { name, checked } = event.currentTarget;
        setSelectedItems(prev => {
            if (checked) {
                return prev.includes(name) ? prev : [...prev, name];
            } else {
                return prev.filter(item => item !== name);
            }
        });
    }

    const filters: any[] = [];

    const [checkedItems, setCheckedItems] = useState<string[]>([]);

    return (
        <>
            <div className="serviceui-domainlist">
                <h4>{specDefinition?.displayOptions?.list?.header?.title}</h4>
                <p>{specDefinition?.displayOptions?.list?.header?.subtitle}</p>
                {props.showSearch && <div>
                    <SearchBar onSearch={handleSearch} filters={filters} />
                </div>}
                <div>
                    {props.schema && <List
                        checkedItems={checkedItems}
                        setCheckedItems={setCheckedItems}
                        data={data}
                        listSchema={props.schema}
                    // actions={
                    //     {
                    //         multiSelect: [
                    //             <Button onClick={handleDelete} theme={ThemeType.danger}>
                    //                 FA Delete ({selectedItems.length})
                    //             </Button>
                    //         ],
                    //         singleSelect: [
                    //             <Button onClick={() => { }} theme={ThemeType.primary}>
                    //                 FA Edit
                    //             </Button>,
                    //             <Button onClick={handleDelete} theme={ThemeType.danger}>
                    //                 FA Delete
                    //             </Button>
                    //         ],
                    //         noneSelect: [
                    //             <Button onClick={() => setIsOpen(true)} theme={ThemeType.primary}>
                    //                 FA Create new
                    //             </Button>
                    //         ]
                    //     }
                    // }
                    // onClick={handleClick} onSelect={handleSelect} selectedItems={selectedItems} 
                    />}
                </div>
            </div>
            {/* <CreatePopup space={props.space} isOpen={isOpen} onClose={() => setIsOpen(false)} /> */}
        </>
    );
};

export default DomainList;
