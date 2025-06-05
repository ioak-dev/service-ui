import {
    httpGet,
    httpPost,
    httpPut,
    httpDelete,
    httpPatch,
} from "./RestTemplate";

const API_PREFIX = "/resources";

const buildEndpoint = (baseUrl: string, space: string, domain: string, id?: string) => {
    let base = `${baseUrl}${API_PREFIX}/${space}/${domain}`;
    return id ? `${base}/${id}` : base;
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

    getById: async (
        baseUrl: string,
        space: string,
        domain: string,
        id: string,
        authorization: { access_token: string }
    ) => {
        const endpoint = buildEndpoint(baseUrl, space, domain, id);

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
