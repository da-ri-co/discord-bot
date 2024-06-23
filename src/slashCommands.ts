import {ping} from "./commands/ping";
import {join} from "./commands/join";
import {leave} from "./commands/leave";
import { joinParrot } from "./commands/joinParrot";

export const commands = [ping, join, joinParrot, leave];
