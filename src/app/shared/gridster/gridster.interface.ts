import { ChangeDetectorRef, NgZone, Renderer2 } from '@angular/core';

import { GridsterCompact } from './gridster-compact.service';
import { GridsterConfigS } from './gridster-config-s.interface';
import { GridsterConfig } from './gridster-config.interface';
import { GridsterEmptyCell } from './gridster-empty-cell.service';
import { GridsterItemComponentInterface } from './gridster-item-component.interface';
import { GridsterItem } from './gridster-item.interface';
import { GridsterRenderer } from './gridster-renderer.service';

export abstract class GridsterComponentInterface {
  $options: GridsterConfigS;
  grid: Array<GridsterItemComponentInterface>;
  checkCollision: (item: GridsterItem) => GridsterItemComponentInterface | boolean;
  checkCollisionForSwaping: (item: GridsterItem) => GridsterItemComponentInterface | boolean;
  positionXToPixels: (x: number) => number;
  pixelsToPositionX: (x: number, roundingMethod: (x: number) => number, noLimit?: boolean) => number;
  positionYToPixels: (y: number) => number;
  pixelsToPositionY: (y: number, roundingMethod: (x: number) => number, noLimit?: boolean) => number;
  findItemWithItem: (item: GridsterItem) => GridsterItemComponentInterface | boolean;
  findItemsWithItem: (item: GridsterItem) => Array<GridsterItemComponentInterface>;
  checkGridCollision: (item: GridsterItem) => boolean;
  checkCollisionTwoItems: (item: GridsterItem, item2: GridsterItem) => boolean;
  el: any;
  renderer: Renderer2;
  gridRenderer: GridsterRenderer;
  cdRef: ChangeDetectorRef;
  options: GridsterConfig;
  calculateLayoutDebounce: () => void;
  updateGrid: () => void;
  movingItem: GridsterItem | null;
  addItem: (item: GridsterItemComponentInterface) => void;
  removeItem: (item: GridsterItemComponentInterface) => void;
  previewStyle: (drag?: boolean) => void;
  mobile: boolean;
  curWidth: number;
  curHeight: number;
  columns: number;
  rows: number;
  curColWidth: number;
  curRowHeight: number;
  windowResize: (() => void) | null;
  setGridDimensions: (() => void);
  dragInProgress: boolean;
  emptyCell: GridsterEmptyCell;
  compact: GridsterCompact;
  zone: NgZone;
  gridRows: Array<number>;
  gridColumns: Array<number>;
}
