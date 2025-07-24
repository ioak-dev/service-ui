import { FormAction } from "powerui/types/uispec.types";
import { DomainService } from "../service/DomainService";

export const onDelete = async (
    apiBaseUrl: string,
    space: string,
    domain: string,
    reference: string,
    authorization: { isAuth: boolean, access_token: string }) => {
    const response = await DomainService.delete(
        apiBaseUrl,
        space,
        domain,
        reference,
        authorization
    );
    console.log(`Deleted ${reference}:`, response);
    return response;
}

export const onGenerate = async (
    apiBaseUrl: string,
    space: string,
    schema: FormAction,
    reference: string,
    parentReference: string | undefined,
    payload: Record<string, string | number>,
    authorization: { isAuth: boolean, access_token: string }) => {

    if (!schema.generation?.id) {
        console.warn("Generation id not specified");
    }
    const response = await DomainService.generate({
        baseUrl: apiBaseUrl,
        space,
        reference,
        parentReference,
        generationId: schema.generation?.id || "",
        payload,
        authorization
    });
    console.log(`Generated for ${reference}:`, response);
    return response;
}

export const onActionClick = async (
    apiBaseUrl: string,
    space: string,
    domain: string,
    references: string[],
    parentDomain: string | undefined,
    parentReference: string | undefined,
    authorization: { isAuth: boolean, access_token: string },
    actionSchema: FormAction,
    payload: Record<string, string | number>,
) => {
    try {
        const responses: any[] = [];

        if (actionSchema.type === "generate" && (!references || references.length === 0)) {
            if (actionSchema.generation?.id) {
                const response = await DomainService.generate({
                    baseUrl: apiBaseUrl,
                    space,
                    generationId: actionSchema.generation?.id,
                    reference: undefined,
                    parentReference,
                    payload,
                    authorization
                });
                responses.push(response);
            }
            return responses;
        }

        for (const reference of references) {
            try {
                let response;
                switch (actionSchema.type) {
                    case "generate":
                        if (!actionSchema.generation?.id) {
                            console.warn("Generation id not specified");
                            break;
                        }
                        response = await DomainService.generate({
                            baseUrl: apiBaseUrl,
                            space,
                            reference,
                            parentReference,
                            generationId: actionSchema.generation?.id,
                            payload,
                            authorization
                        }
                        );
                        console.log(`Generated for ${reference}:`, response);
                        break;

                    default:
                        console.warn(`Unsupported action type: ${actionSchema.type}`);
                        break;
                }

                if (response) {
                    responses.push({
                        reference,
                        status: 'success',
                        data: response
                    });
                }
            } catch (error) {
                console.error(`Action failed for reference ${reference}:`, error);
                responses.push({
                    reference,
                    status: 'error',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }

        return {
            action: actionSchema.type,
            processedCount: references.length,
            successCount: responses.filter(r => r.status === 'success').length,
            errorCount: responses.filter(r => r.status === 'error').length,
            results: responses
        };
    } catch (error) {
        console.error("Global action failed:", error);
        return {
            action: actionSchema.type,
            status: 'global_error',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};