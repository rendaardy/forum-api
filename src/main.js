import {createServer} from '#infrastructures/http/create-server.js';
import {container} from '#infrastructures/container';

const server = await createServer(container);
await server.start();
