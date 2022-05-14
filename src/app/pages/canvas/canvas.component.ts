import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fromEvent, repeat, Subject, switchMap, takeUntil } from 'rxjs';
import { Shape } from '../../models/shape.model';
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, OnDestroy {

  currentShape: Shape;
  @ViewChild('svg', { static: true }) svg!: ElementRef;

  private $unsubscibe: Subject<any> = new Subject();

  constructor() {
    this.currentShape = new Shape();
  }

  ngOnInit() {
    this._initiateDrawing
  }

  private _initiateDrawing(): void {
    let down = fromEvent(this.svg.nativeElement, 'mousedown');
    let up = fromEvent(this.svg.nativeElement, 'mouseup');
    let move = fromEvent(this.svg.nativeElement, 'mousemove');

    down
      .pipe(
        switchMap((event: any) => {
          this.startDrawing(event);
          return move;
        }),
        takeUntil(up),
        repeat()
      ).subscribe(moves => {
        this.keepDrawing(moves);
      });
  }

  startDrawing(evt: any) {
    this.currentShape = {
      x: evt.offsetX,
      y: evt.offsetY,
      width: 0,
      height: 0
    };
  }


  keepDrawing(evt: any) {
    this.currentShape.width = evt.offsetX - this.currentShape.x;
    this.currentShape.height = evt.offsetY - this.currentShape.y;
    console.log(this.currentShape);

  }

  ngOnDestroy(): void {
    this.$unsubscibe.next(null);
    this.$unsubscibe.complete();
  }

}
