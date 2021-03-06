export declare type UploadHandlerPart = {
    name: string;
    filename?: string;
    contentType: string;
    data: AsyncIterable<Uint8Array>;
};
export declare type UploadHandler = (part: UploadHandlerPart) => Promise<File | string | null | undefined>;
export declare function composeUploadHandlers(...handlers: UploadHandler[]): UploadHandler;
/**
 * Allows you to handle multipart forms (file uploads) for your app.
 *
 * TODO: Update this comment
 * @see https://remix.run/api/remix#parsemultipartformdata-node
 */
export declare function parseMultipartFormData(request: Request, uploadHandler: UploadHandler): Promise<FormData>;
