import React from 'react';
import './VersionTree.css';
import VersionItem from './VersionItem';
import { DomainVersion } from 'powerui/types/uispec.types';

interface Props {
    versionList: DomainVersion[];
    activeVersion?: string;
    onActiveVersionChange: (e: string) => void;
}

const VersionTree = (props: Props) => {
    return (
        <div>
            {props.versionList.map((item, index) => (
                <VersionItem
                    key={item.__version}
                    item={item}
                    isActive={props.activeVersion === item.__version}
                    isLast={index === props.versionList.length - 1}
                    onClick={() => props.onActiveVersionChange(item.__version)}
                />
            ))}
        </div>
    );
};

export default VersionTree;
