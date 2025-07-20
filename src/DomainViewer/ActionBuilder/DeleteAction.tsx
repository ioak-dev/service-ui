import { Button } from "basicui";
import React, { useState } from "react";
import { ActionBuilderProps } from ".";


const DeleteAction: React.FC<ActionBuilderProps> = (props) => {

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
            {props.actionSchema.label}
        </Button>
    );
};

export default DeleteAction;
