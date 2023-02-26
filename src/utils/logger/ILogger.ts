export abstract class ILogger {
    protected constructor(protected _name: string) {}

    public abstract debug(message: string, ...metadata: any[]): void
    public abstract info(message: string, ...metadata: any[]): void
    public abstract warn(message: string, ...metadata: any[]): void
    public abstract error(message: string, ...metadata: any[]): void
}
