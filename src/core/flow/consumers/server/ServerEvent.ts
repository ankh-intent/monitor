
import { BaseCoreEvent } from '../../CoreEvent';
import { Server } from './intent/Server';

export interface ServerEventProps {
  server: Server;
  state: string;
}

export class ServerEvent extends BaseCoreEvent<ServerEventProps> {
}
