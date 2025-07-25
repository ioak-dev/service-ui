import { Button } from "basicui";
import React, { useState } from "react";
import { ActionBuilderProps } from ".";


const SaveAction: React.FC<ActionBuilderProps> = (props) => {

    const [loading, setLoading] = useState(false);

    const onClick = async () => {
        setLoading(true);
        await props.onClick(props.actionSchema, {});
        setLoading(false);
    }

    return (
        <Button
            onClick={onClick}
            loading={loading}
        >
            {props.actionSchema.icon && props.actionSchema.icon}
            {!props.actionSchema.icon && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" /></svg>}
            {props.actionSchema.label}
        </Button>
    );
};

export default SaveAction;
