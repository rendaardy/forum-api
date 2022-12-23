import * as dotenv from 'dotenv';

import {createServer} from '#infrastructures/http/create-server.js';
import {container} from '#infrastructures/container';

dotenv.config();

const server = await createServer(container);
await server.start();
