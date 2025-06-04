import React, { useState, useEffect } from "react";
import { Input, SvgIcon, Button, ButtonVariantType, ThemeType } from 'basicui';
// import Topbar from "basicui/components/AppShellReveal/Topbar";
import { List, SearchBar } from "powerui";
import { DomainService } from "../lib/DomainService";

export type DomainListProps = {
    apiBaseUrl: string;
    space: string;
    domain: string;
    authorization: { isAuth: boolean, access_token: string };
    showSearch: boolean;
};

/**
 * Component to render list of records for the given domain.
 */
const DomainList = (props: DomainListProps) => {

    const [data, setData] = useState<any[]>([]);

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (props.authorization.isAuth) {
            console.log(props.authorization)
            handleSearch();
        }
    }, [props.authorization])


    const handleSearch = (event?: any) => {
        DomainService.search(props.apiBaseUrl, props.space, props.domain, {
            page: 1, limit: 10
        }, props.authorization).then((response) => {
            const _data: any[] = response.data;
            setData(_data.map(item => ({
                id: item.reference,
                title: item.name,
                summary: item.description || "",
                labels: item.labels?.map((labelItem: any) => ({
                    id: labelItem,
                    value: labelItem
                })),
                createdAt: item.createdAt
            })));
        });
    }

    const handleDelete = () => { }

    const handleClick = () => { }

    const handleSelect = () => { }

    const selectedItems: string[] = [];

    const filters: any[] = [];

    return (
        <>
            <div className="serviceui-domainlist">
                {props.showSearch && <div>
                    <SearchBar onSearch={handleSearch} filters={filters} />
                </div>}
                <div>
                    <List data={data}
                        actions={
                            {
                                multiSelect: [
                                    <Button onClick={handleDelete} theme={ThemeType.danger}>
                                        FA Delete
                                    </Button>
                                ],
                                singleSelect: [
                                    <Button onClick={() => { }} theme={ThemeType.primary}>
                                        FA Edit
                                    </Button>,
                                    <Button onClick={handleDelete} theme={ThemeType.danger}>
                                        FA Delete
                                    </Button>
                                ],
                                noneSelect: [
                                    <Button onClick={() => setIsOpen(true)} theme={ThemeType.primary}>
                                        FA Create new
                                    </Button>
                                ]
                            }
                        }
                        onClick={handleClick} onSelect={handleSelect} selectedItems={selectedItems} />
                </div>
            </div>
            {/* <CreatePopup space={props.space} isOpen={isOpen} onClose={() => setIsOpen(false)} /> */}
        </>
    );
};

export default DomainList;
