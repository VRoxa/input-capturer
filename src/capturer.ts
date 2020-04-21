export class Capturer {
    private buffer: string;
    private buffering: boolean;

    private enabled = true;

    private END_SENTINEL: number;
    private START_SENTINEL: number;

    constructor(
        private element: HTMLElement,
        private onComplete: (result: string) => void
    ) {
        this.buffer = ``;
        this.startCapturing();
    }

    private startCapturing = (): void =>
        this.element.addEventListener(`keypress`, this.onCaptured);

    private onCaptured = (event: KeyboardEvent) => {
        if (this.enabled)
            this.capture(event);
    }

    private capture = (event: KeyboardEvent): void => {
        event.preventDefault();
        const key = event.charCode;
        if (this.ends(key))
            this.emit();
        else if (this.buffering)
            this.append(key);
        else if (this.starts(key))
            this.buffering = true;
    }

    private ends = (key: number): boolean =>
        key === this.END_SENTINEL && this.buffer !== ``;

    private emit = () => {
        this.buffering = false;
        this.onComplete(this.buffer);
        this.buffer = ``;
    }

    private append = (key: number) =>
        this.buffer = `${this.buffer}${key}`;

    private starts = (key: number): boolean => 
        key === this.START_SENTINEL;

    public enable = (): boolean => this.enabled = true;
    public disable = (): string => {
        this.enabled = false;
        this.buffering = false;
        return this.buffer;
    }
}
