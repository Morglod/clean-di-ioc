import { ContainerDI } from "..";

export interface ILogger {
    log(msg: string): void;
    flush(): void;
}

export const di = new ContainerDI<{
    logger: ILogger,
}>();