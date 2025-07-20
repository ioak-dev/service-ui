import React, { ReactNode } from "react";
import { ConversationalFormTypes } from "powerui";
import SaveAction from "./SaveAction";
import { FormAction } from "powerui/types/uispec.types";
import ResetAction from "./ResetAction";
import GenerateAction from "./GenerateAction";
import DeleteAction from "./DeleteAction";

export type ActionBuilderProps = {
  actionSchema: FormAction;
  onClick: (actionSchema: FormAction, payload: Record<string, string | number>) => Promise<void>
}

export const composeActions = (
  actions: FormAction[] = [],
  onClick: (actionSchema: FormAction, payload: Record<string, string | number>) => Promise<void>
): ReactNode[] => {
  const _actions: ReactNode[] = [];

  for (const action of actions) {
    switch (action.type) {
      case "save":
        _actions.push(<SaveAction key={action.label} actionSchema={action} onClick={onClick} />);
        break;
      case "reset":
        _actions.push(<ResetAction key={action.label} actionSchema={action} onClick={onClick} />);
        break;
      case "delete":
        _actions.push(<DeleteAction key={action.label} actionSchema={action} onClick={onClick} />);
        break;
      case "generate":
        _actions.push(<GenerateAction key={action.label} actionSchema={action} onClick={onClick} />);
        break;
      // case "cancel":
      //   _actions.push(<CancelAction key={action.label} label={action.label} />);
      //   break;
      // case "delete":
      //   _actions.push(<DeleteAction key={action.label} label={action.label} />);
      //   break;
      // case "generate":
      //   _actions.push(<GenerateAction key={action.label} label={action.label} />);
      //   break;
      // case "custom":
      //   _actions.push(<CustomAction key={action.label} label={action.label} />);
      //   break;
      default:
        console.warn(`Unknown action type: ${action.type}`);
        break;
    }
  }

  return _actions;
};
