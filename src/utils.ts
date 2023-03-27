import path from "path";
import {promises} from "fs";
import Handlebars from "handlebars";
import {Elysia} from "elysia";
import {Context} from "elysia/dist";

export const registerPartials = async (): Promise<void> => {
    const basePath = path.join(import.meta.dir, 'layouts');
    const files = await promises.readdir(basePath);

    for (let f of files) {
        const fileData = await promises.readFile(path.join(basePath, f), 'utf8');
        const [fileName] = f.split('.');

        Handlebars.registerPartial(fileName, fileData);
    }
}

export const registerRoutes = async (elysia: Elysia): Promise<void> => {
    const basePath = path.join(import.meta.dir, 'routes');
    const files = await promises.readdir(basePath);

    for (let f of files) {
        const fileData = await promises.readFile(path.join(basePath, f), 'utf8');
        const [fileName] = f.split('.');
        const compiled = Handlebars.compile(fileData);

        if (fileName === 'home') {
            elysia.get('/', async ({set}) => {
                const nonce = setHeaders(set);

                return compiled(nonce);
            });
        } else {
            const fileNameSplit = fileName.split('_');
            let paramPresent = false;

            if (fileNameSplit.length > 0) {
                let path = '';

                for (const split of fileNameSplit) {
                    path = `${path}/${split}`;

                    if (split.includes(':')) {
                        paramPresent = true;
                    }
                }

                if (paramPresent) {
                    import(`./handlers/${fileName}.ts`).then(async (handler) => {
                        elysia.get(path, await handler.default);
                    });
                } else {
                    elysia.get(path, async ({set}) => {
                        const nonce = setHeaders(set);

                        return compiled(nonce);
                    });
                }
            } else {
                elysia.get(`/${fileName}`, async ({set}) => {
                    const nonce = setHeaders(set);

                    return compiled(nonce);
                });
            }
        }
    }
}

export const registerApi = async (elysia: Elysia): Promise<void> => {
    const basePath = path.join(import.meta.dir, 'api');
    const files = await promises.readdir(basePath);

    for (let f of files) {
        import(`./api/${f}`).then((api) => {
            const {type, path, handler} = api.default;

            switch (type) {
                case 'get': {
                    elysia.get(`/api/${path}`, async () => await handler());
                    break;
                }
                case 'put': {
                    elysia.put(`/api/${path}`, async () => await handler());
                    break;
                }
                case 'post': {
                    elysia.post(`/api/${path}`, async () => await handler());
                    break;
                }
                case 'patch': {
                    elysia.patch(`/api/${path}`, async () => await handler());
                    break;
                }
                case 'delete': {
                    elysia.delete(`/api/${path}`, async () => await handler());
                    break;
                }
                case 'options': {
                    elysia.options(`/api/${path}`, async () => await handler());
                    break;
                }
                case 'head': {
                    elysia.head(`/api/${path}`, async () => await handler());
                    break;
                }
                case 'trace': {
                    elysia.trace(`/api/${path}`, async () => await handler());
                    break;
                }
                case 'connect': {
                    elysia.connect(`/api/${path}`, async () => await handler());
                    break;
                }
                default: {
                    throw new Error(`Unknown API request type provided: ${type}`)
                }
            }
        });
    }
}

export const handleRequest = async (meta: ImportMeta, set: Context['set'], data?: object) => {
    const basePath = path.join(meta.dir, 'routes').replace('handlers/', '');
    const [fileName] = meta.path.replace(`${meta.dir}/`, '').split('.');
    const fileData = await promises.readFile(path.join(basePath, `${fileName}.html`), 'utf8');
    const compiled = Handlebars.compile(fileData);

    const nonce = setHeaders(set);

    return compiled({...data, ...nonce} || nonce);
}

export const setHeaders = (set: Context['set']): { nonce: string } => {
    const nonce = crypto.randomUUID();

    set.headers['Content-Security-Policy'] = `default-src \'self\';base-uri \'self\';font-src \'self\' https: data:;form-action \'self\';frame-ancestors \'self\';img-src \'self\' data:;object-src \'none\';script-src \'self\' \'nonce-${nonce}\';script-src-attr \'none\';style-src \'self\' https: \'unsafe-inline\';upgrade-insecure-requests;`;
    set.headers['Strict-Transport-Security'] = 'max-age=15552000';
    set.headers['X-Content-Type-Options'] = 'nosniff';
    set.headers['X-DNS-Prefetch-Control'] = 'off';
    set.headers['Cross-Origin-Embedder-Policy'] = 'require-corp';
    set.headers['Cross-Origin-Opener-Policy'] = 'same-origin';
    set.headers['X-XSS-Protection'] = '0';
    set.headers['X-Permitted-Cross-Domain-Policies'] = 'none';
    set.headers['X-Frame-Options'] = 'SAMEORIGIN';
    set.headers['X-Download-Options'] = 'noopen';
    set.headers['Referrer-Policy'] = 'no-referrer; includeSubDomains;';
    set.headers['Origin-Agent-Cluster'] = '?1';
    set.headers['Cross-Origin-Resource-Policy'] = 'same-origin';

    return {nonce};
}