import {Elysia} from 'elysia'
import html from "@elysiajs/html";
import {staticPlugin} from '@elysiajs/static';
import {registerApi, registerPartials, registerRoutes} from "./utils";

await registerPartials();

const app = new Elysia();

app
    .use(html())
    .use(staticPlugin());

await registerRoutes(app);
await registerApi(app);

app.listen(3000)

console.log(`Compage is running at ${app.server?.hostname}:${app.server?.port}`)
