import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { finalize, fromEvent, of, repeat, Subject, switchMap, take, takeUntil } from 'rxjs';
import { ShapeService } from 'src/app/core/services/shape.service';
import { Shape } from '../../models/shape.model';
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, OnDestroy, AfterViewInit {

  currentShape: Shape;
  pointerX: number = 115;
  pointerY: number = 115;
  readonly pointerHeight: number = 8;
  readonly pointerWidth: number = 8;
  private readonly minHeight: number = 5;
  private readonly minWidth: number = 5;
  private maxWidth: number = 0;
  private maxHeight: number = 0;

  @ViewChild('pointer', { static: true }) pointer!: ElementRef;
  @ViewChild('svg', { static: true }) svg!: ElementRef;

  private $unsubscribe: Subject<any> = new Subject();

  constructor(private _shapeService: ShapeService) {
    this.currentShape = new Shape({ x: 20, y: 20 });
  }

  ngOnInit() {
    this._getShape();
    this._initiateDrawing();
  }

  ngAfterViewInit(): void {
    this.maxWidth = this.svg.nativeElement.clientWidth;
    this.maxHeight = this.svg.nativeElement.clientHeight;

  }

  private _getShape(): void {
    this._shapeService.getShape()
      .pipe(
        takeUntil(this.$unsubscribe)
      ).subscribe({
        next: (res) => {
          this.currentShape.height = res.Height;
          this.currentShape.width = res.Width;
          this.pointerX = this.currentShape.x + this.currentShape.width - (this.pointerWidth / 2);
          this.pointerY = this.currentShape.y + this.currentShape.height - (this.pointerHeight / 2);

        },
        error: () => {
          this.currentShape.height = 100;
          this.currentShape.width = 100;
          this.pointerX = this.currentShape.x + this.currentShape.width - (this.pointerWidth / 2);
          this.pointerY = this.currentShape.y + this.currentShape.height - (this.pointerHeight / 2);
        },
      });
  }

  private saveShape(shape: Shape) {
    const { height, width } = shape;

    this._shapeService.saveShape({ Height: height, Width: width })
      .pipe(
        take(1)
      ).subscribe(res => {
        // this._getShape();
      });

  }

  private _initiateDrawing(): void {
    let down = fromEvent(this.pointer.nativeElement, 'mousedown');
    let up = fromEvent(window, 'mouseup');
    let move = fromEvent(this.svg.nativeElement, 'mousemove');

    down
      .pipe(
        switchMap((event: any) => {
          return move;
        }),
        takeUntil(up),
        finalize(() => {
          this.saveShape(this.currentShape);
        }),
        repeat()
      ).subscribe(moves => {
        if (moves) {
          this.keepDrawing(moves);
        }
      });
  }

  keepDrawing(evt: any) {

    let width = evt.offsetX - this.currentShape.x,
      height = evt.offsetY - this.currentShape.y;

    if (height < this.minHeight) {
      this.currentShape.height = this.minHeight;
    } else {
      this.currentShape.height = height || this.currentShape.height;
    }

    if (width < this.minWidth) {
      this.currentShape.width = this.minWidth;
    } else {
      this.currentShape.width = width < 0 ? this.currentShape.width : width;
    }

    if (height < this.minHeight) {
      this.pointerY = this.currentShape.y + this.currentShape.height - (this.pointerHeight / 2);
    } else {
      this.pointerY = evt.offsetY - this.pointerHeight / 2;
    }

    if (width < this.minWidth) {
      this.pointerX = this.currentShape.x + this.currentShape.width - (this.pointerWidth / 2);
    } else {
      this.pointerX = evt.offsetX - this.pointerWidth / 2;
    }



  }

  ngOnDestroy(): void {
    this.$unsubscribe.next(null);
    this.$unsubscribe.complete();
  }

}
