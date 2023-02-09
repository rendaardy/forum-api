import {createServer} from '#infrastructures/http/create-server.ts';
import {container} from '#infrastructures/container';

const server = await createServer(container);
await server.start();
