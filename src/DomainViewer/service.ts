import { FormAction } from "powerui/types/uispec.types";
import { DomainService } from "../service/DomainService";

export const onActionClick = async (
    apiBaseUrl: string,
    space: string,
    domain: string,
    reference: string,
    authorization: { isAuth: boolean, access_token: string },
    actionSchema: FormAction,
    payload: Record<string, string | number>,
    state: Record<string, any>
) => {
    console.log(state);
    try {
        let response;
        switch (actionSchema.type) {
            case "save":
                response = await DomainService.update(
                    apiBaseUrl,
                    space,
                    domain,
                    reference,
                    state,
                    authorization
                );
                break;

            case "reset":
                return null;

            case "delete":
                response = await DomainService.delete(
                    apiBaseUrl,
                    space,
                    domain,
                    reference,
                    authorization
                );
                console.log("Deleted:", response);
                break;

            case "generate":
                if (!actionSchema.generation?.id) {
                    console.warn("Generation id not specified");
                    break;
                }
                response = await DomainService.generate(
                    apiBaseUrl,
                    space,
                    domain,
                    reference,
                    actionSchema.generation?.id,
                    payload,
                    authorization
                );
                break;

            default:
                console.warn(`Unsupported action type: ${actionSchema.type}`);
                break;
        }
        return response;
    } catch (error) {
        console.error("Action failed:", error);
    }
};
