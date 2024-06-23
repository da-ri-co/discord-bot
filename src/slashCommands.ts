import {ping} from "./commands/ping";
import {join} from "./commands/join";
import {leave} from "./commands/leave";
import { joinparrot } from "./commands/joinParrot";

export const commands = [ping, join, joinparrot, leave];
