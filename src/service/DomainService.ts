import {
    httpGet,
    httpPost,
    httpPut,
    httpDelete,
    httpPatch,
} from "./RestTemplate";

const API_PREFIX = "/resources";
const UI_API_PREFIX = "/resources-ui";
const AI_API_PREFIX = "/resources-ai";

const buildEndpoint = (baseUrl: string, space: string, domain: string, reference?: string) => {
    let base = `${baseUrl}${API_PREFIX}/${space}/${domain}`;
    return reference ? `${base}/${reference}` : base;
};

const buildVersionEndpoint = (baseUrl: string, space: string, domain: string, reference: string) => {
    let base = buildEndpoint(baseUrl, space, domain, reference);
    return `${base}/version`
};

const buildGetByIdEndpoint = (baseUrl: string, space: string, domain: string, reference: string, version?: string) => {
    let base = buildEndpoint(baseUrl, space, domain, reference);
    return version ? `${base}?version=${version}` : base;
};

const buildUiApiEndpoint = (baseUrl: string, space: string, domain: string, formName?: string) => {
    let base = `${baseUrl}${UI_API_PREFIX}/${space}/${domain}`;
    return formName ? `${base}/${formName}` : base;
};

const buildAiApiEndpoint = (
    baseUrl: string,
    space: string,
    generationId: string,
    reference?: string,
    parentReference?: string,
    parentVersion?: string
) => {
    let base = `${baseUrl}${AI_API_PREFIX}/${space}/generate/${generationId}?`;
    if (reference) {
        base += `reference=${reference}&`;
    }
    if (parentReference) {
        base += `parentReference=${parentReference}&`;
    }
    if (parentVersion) {
        base += `parentVersion=${parentVersion}`;
    }
    return base;
};

const buildHeaders = (authorization: { access_token: string }) => ({
    headers: {
        Authorization: authorization.access_token,
    },
});

const handleError = (method: string, endpoint: string, error: any) => {
    const status = error?.response?.status || "N/A";
    const message = error?.response?.data?.message || error.message || "Unknown error";
    console.warn(`❌ [${method}] ${endpoint} → ${status}: ${message}`);
};

export const DomainService = {
    getMeta: async (
        baseUrl: string,
        space: string,
        domain: string,
        authorization: { access_token: string }
    ) => {

        const endpoint = `${buildEndpoint(baseUrl, space, domain)}`;

        try {
            const res = await httpGet(endpoint, buildHeaders(authorization));
            return res.data;
        } catch (err) {
            handleError("GET", endpoint, err);
            return {};
        }
    },

    getForm: async (
        baseUrl: string,
        space: string,
        domain: string,
        authorization: { access_token: string },
        formName?: string
    ) => {

        const endpoint = `${buildUiApiEndpoint(baseUrl, space, domain, formName)}`;

        try {
            const res = await httpGet(endpoint, buildHeaders(authorization));
            return res.data;
        } catch (err) {
            handleError("GET", endpoint, err);
            return {};
        }
    },

    search: async (
        baseUrl: string,
        space: string,
        domain: string,
        searchPayload: any,
        authorization: { access_token: string }
    ) => {
        const endpoint = `${buildEndpoint(baseUrl, space, domain)}/search`;

        try {
            const res = await httpPost(endpoint, searchPayload, buildHeaders(authorization));
            return res.data;
        } catch (err) {
            handleError("POST", endpoint, err);
            return [];
        }
    },

    getVersionHistory: async (
        baseUrl: string,
        space: string,
        domain: string,
        reference: string,
        authorization: { access_token: string }
    ) => {
        const endpoint = buildVersionEndpoint(baseUrl, space, domain, reference);

        try {
            const res = await httpGet(endpoint, buildHeaders(authorization));
            return res.data;
        } catch (err) {
            handleError("GET", endpoint, err);
            return null;
        }
    },

    getById: async (
        baseUrl: string,
        space: string,
        domain: string,
        id: string,
        authorization: { access_token: string },
        version?: string
    ) => {
        const endpoint = buildGetByIdEndpoint(baseUrl, space, domain, id, version);

        try {
            const res = await httpGet(endpoint, buildHeaders(authorization));
            return res.data;
        } catch (err) {
            handleError("GET", endpoint, err);
            return null;
        }
    },

    create: async (
        baseUrl: string,
        space: string,
        domain: string,
        payload: any,
        authorization: { access_token: string }
    ) => {
        const endpoint = buildEndpoint(baseUrl, space, domain);

        try {
            const res = await httpPost(endpoint, payload, buildHeaders(authorization));
            return res?.data;
        } catch (err) {
            handleError("POST", endpoint, err);
            return null;
        }
    },

    update: async (
        baseUrl: string,
        space: string,
        domain: string,
        id: string,
        payload: any,
        authorization: { access_token: string }
    ) => {
        const endpoint = buildEndpoint(baseUrl, space, domain, id);

        try {
            const res = await httpPut(endpoint, payload, buildHeaders(authorization));
            return res.data;
        } catch (err) {
            handleError("PUT", endpoint, err);
            return null;
        }
    },

    patch: async (
        baseUrl: string,
        space: string,
        domain: string,
        id: string,
        payload: any,
        authorization: { access_token: string }
    ) => {
        const endpoint = buildEndpoint(baseUrl, space, domain, id);

        try {
            const res = await httpPatch(endpoint, payload, buildHeaders(authorization));
            return res.data;
        } catch (err) {
            handleError("PATCH", endpoint, err);
            return null;
        }
    },

    delete: async (
        baseUrl: string,
        space: string,
        domain: string,
        id: string,
        authorization: { access_token: string }
    ) => {
        const endpoint = buildEndpoint(baseUrl, space, domain, id);

        try {
            const res = await httpDelete(endpoint, buildHeaders(authorization));
            return res.data;
        } catch (err) {
            handleError("DELETE", endpoint, err);
            return { success: false };
        }
    },

    generate: async (params: {
        baseUrl: string,
        space: string,
        generationId: string,
        reference?: string,
        parentReference?: string,
        parentVersion?: string,
        payload: any,
        authorization: { access_token: string }
    }
    ) => {
        const endpoint = buildAiApiEndpoint(params.baseUrl, params.space, params.generationId, params.reference, params.parentReference, params.parentVersion)

        try {
            const res = await httpPost(endpoint, params.payload, buildHeaders(params.authorization));
            return res.data;
        } catch (err) {
            handleError("POST", endpoint, err);
            return null;
        }
    },

    inferTypes: async (
        baseUrl: string,
        space: string,
        authorization: { access_token: string }
    ) => {
        const endpoint = `${baseUrl}${API_PREFIX}/${space}/infer/types`;

        try {
            const res = await httpGet(endpoint, buildHeaders(authorization));
            return res.data;
        } catch (err) {
            handleError("GET", endpoint, err);
            return {};
        }
    },
};
