import { di, ILogger } from "./interfaces";

export class Logger implements ILogger {
    buf: string[] = [];

    log(msg: string): void {
        this.buf.push(msg);
    }

    flush() {
        for (const b of this.buf) console.log(b);
        this.buf = [];
    }
}
di.set('logger', () => new Logger);
