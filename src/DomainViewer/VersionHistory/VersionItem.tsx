import React from 'react';
import { SvgIcon } from 'basicui';
import './VersionItem.css'
import { DomainVersion } from 'powerui/types/uispec.types';
import { getClassName } from '../../utils/ClassNameUtils';

interface Props {
    item: DomainVersion;
    isActive?: boolean;
    isLast?: boolean;
    onClick: () => void;
}

const BASE_CLASS = "serviceui-versionitem"

const VersionItem = (props: Props) => {

    return (
        <>
            <div className={BASE_CLASS}>
                <div className={getClassName(BASE_CLASS, ["timeline"])}>
                    <button
                        className={getClassName(BASE_CLASS, ["timeline", "button"], props.isActive ? ["active"] : [], "basicui-clean-button")}
                        onClick={props.onClick}
                    >
                        <SvgIcon height="12px" width="12px">
                            {props.isActive ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                    <path d="M320 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160zm156.8-48C462 361 397.4 416 320 416s-142-55-156.8-128L32 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l131.2 0C178 151 242.6 96 320 96s142 55 156.8 128L608 224c17.7 0 32 14.3 32 32s-14.3 32-32 32l-131.2 0z" />
                                </svg>
                            )}
                        </SvgIcon>
                    </button>
                    {!props.isLast && <div className={getClassName(BASE_CLASS, ["timeline", "line"])} />}
                </div>

                <div className={getClassName(BASE_CLASS, ["content"], [], "small")}>
                    <div className={getClassName(BASE_CLASS, ["content", "tag"])}><b>{`v${props.item.__version}`}</b></div>
                    {props.item.__columns && <div className={getClassName(BASE_CLASS, ["content", "note"])}>
                        {props.item.__columns
                            ? Object.entries(props.item.__columns).map(([key, value]) => (
                                <div key={key}>
                                    {key}: {value.toFixed(2).replace(/\.?0+$/, '')}%
                                </div>
                            ))
                            : props.item.__percentage !== undefined
                                ? props.item.__percentage.toFixed(2).replace(/\.?0+$/, '') + "%"
                                : null}
                    </div>}
                    <div className={getClassName(BASE_CLASS, ["content", "date"])}>{new Date(props.item.createdAt).toLocaleDateString()}</div>
                </div>
            </div>
        </>
    );
};

export default VersionItem;
