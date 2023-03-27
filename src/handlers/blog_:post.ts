import {handleRequest} from "../utils";
import {Context} from "elysia/dist";

const handler = async ({params, set}: Context) => {
    // We can do whatever we want with the params (i.e. api requests, database calls, etc.)

    // Call handleRequest to finish off the setup.
    // Pass through the current import.meta so that the current path context is not lost.
    // Pass through any object (such as params) to have it passed to the view (optional).
    return await handleRequest(import.meta, set, params);
}

export default handler;