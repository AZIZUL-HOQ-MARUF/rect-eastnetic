interface IShape {
    x: number;
    y: number;
    height: number;
    width: number;
}

export class Shape implements IShape {
    x: number;
    y: number;
    height: number;
    width: number;

    constructor(options: any = {}) {
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.height = options.height || 0;
        this.width = options.width || 0;
    }
}