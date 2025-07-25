import { Button } from "basicui";
import React, { useState } from "react";
import { ActionBuilderProps } from ".";


const ResetAction: React.FC<ActionBuilderProps> = (props) => {

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
        >{props.actionSchema.icon && props.actionSchema.icon}
            {!props.actionSchema.icon && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M290.7 57.4L57.4 290.7c-25 25-25 65.5 0 90.5l80 80c12 12 28.3 18.7 45.3 18.7L288 480l9.4 0L512 480c17.7 0 32-14.3 32-32s-14.3-32-32-32l-124.1 0L518.6 285.3c25-25 25-65.5 0-90.5L381.3 57.4c-25-25-65.5-25-90.5 0zM297.4 416l-9.4 0-105.4 0-80-80L227.3 211.3 364.7 348.7 297.4 416z" /></svg>}
            {props.actionSchema.label}
        </Button>
    );
};

export default ResetAction;
