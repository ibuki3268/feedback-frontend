import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "../build/server";
import { onRequest as authMiddleware } from "./_middleware";

export const onRequest = async (context: any) => {
    const response = await authMiddleware(context);
    if (response) {
        return response;
    }
    return createPagesFunctionHandler({ build })(context);
};
