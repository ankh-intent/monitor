import { CoreOptions } from '../../../Core';
import { BaseCoreEvent } from '../CoreEvent';

export interface StartedEventProps {
  options: CoreOptions;
}

export class StartedEvent extends BaseCoreEvent<StartedEventProps> {
}
