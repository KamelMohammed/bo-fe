import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import Map from "ol/Map";
// import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from 'ol/source/OSM';
import Layer from "ol/layer/Layer";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";
import { fromLonLat } from 'ol/proj.js';
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Extent } from 'ol/extent';
import Polygon from "ol/geom/Polygon";
import { Style, Icon, Stroke, Fill } from 'ol/style.js';
import { defaults as defaultsControls } from 'ol/control';
import MultiPoint from 'ol/geom/MultiPoint';
import { defaults as defaultInteractions, Draw, Modify, MouseWheelZoom } from 'ol/interaction';
import { altKeyOnly } from "ol/events/condition"
// import { ActionCommand, ModalOptions } from 'app/common/models/models';
import { timer } from 'rxjs';
// import { GeoSpatialReference } from 'app/models/object-space.model';
// import { iconEdit, iconSave, iconTrash } from 'app/common/utils/icons.utils';
// import { ModalService } from 'app/common/services/modal.service';
// import { MapEditorInputDataDef } from '../map-editor-modal/map-editor.component';
import VectorLayer from 'ol/layer/Vector';
import { DataTableAction } from '../../data-table/types';



@Component({
	selector: 'map-preview',
	templateUrl: './map-preview.component.html',
	styleUrls: ['./map-preview.component.css']
})
export class MapPreviewComponent implements AfterViewInit, OnInit {
	@ViewChild('mapPreview') mapRef: ElementRef<HTMLInputElement>;
	map: Map;
	vectorLayer: VectorLayer<any> = new VectorLayer();
	vectorSource: VectorSource = new VectorSource();
	layers: Layer[] = [];
	view: View;
	private mapProjection = 'EPSG:4326';

	private _polygonArea: number[][][];
	private _center: any[];
	private _defaultCenterCoordinates = fromLonLat([14.781447642043426, 41.130769884646625], 'EPSG:4326');

	private modifyInteraction: Modify;
	private drawInteraction: Draw;
	private defaultStyle: Style = new Style({
		fill: new Fill({
			color: '#ffffff52'
		}),
		stroke: new Stroke({
			color: 'green',
			width: 2
		}),
		image: new Icon({
			src: 'assets/icons/poi-location-pin-marker.png',
		})
	})


	private _reference: number[];
	get reference(): number[] {
		return this._reference;
	}
	@Input() set coordinates(coordinates: number[]) {
		this.vectorSource.clear();
		// this.polygonArea = (reference.polygon && reference.polygon.coordinates && reference.polygon.coordinates[0]) ? reference.polygon.coordinates : null;
		this.center = coordinates; //(reference.centerPoint && reference.centerPoint.coordinates) ? reference.centerPoint.coordinates : null;
		this._reference = coordinates;
	};
	@Input() readOnly: boolean = true;
	// @Output() onDeleteRequest: EventEmitter<GeoSpatialReference> = new EventEmitter();
	// @Output() onSaveRequest: EventEmitter<GeoSpatialReference> = new EventEmitter();

	actions: DataTableAction[] = []
	// @Input() referenceId: any;
	// @Input() domainEntityId: any;

	set polygonArea(polygonArea: number[][][]) {
		console.log("polygonArea", polygonArea);

		if (polygonArea) {
			this._polygonArea = [[]];
			this._polygonArea[0] = polygonArea[0].map(el => { return fromLonLat([el[0], el[1]], this.mapProjection) });
			let polygon = new Polygon(this._polygonArea);
			let feature: Feature = new Feature({
				name: "polygon",
				geometry: polygon
			})
			feature.setStyle(this.defaultStyle);
			this.vectorSource.addFeature(feature);
		}
	}

	set center(center: any) {
		console.log("center", center);
		if (center) {
			this._center = fromLonLat(center, this.mapProjection);
			let point = new Point(this._center);
			let feature = new Feature({
				name: "center",
				geometry: point
			})
			feature.setStyle(this.defaultStyle);
			this.vectorSource.addFeature(feature);
		}
	}

	private initMap(): void {
		console.log("init..");
		
		this.vectorLayer.setSource(this.vectorSource);
		var tileLayer = new TileLayer({ source: new OSM() });

		if (this.layers.length == 0) {
			this.layers.push(tileLayer);
			this.layers.push(this.vectorLayer);
		}
		else {
			this.layers.splice(0, 1, tileLayer);
			this.layers.splice(1, 1, this.vectorLayer);
		}
		this.view = new View({
			center: (this._center) ? this._center : this._defaultCenterCoordinates,
			projection: this.mapProjection,
			zoom: 5,
			enableRotation: false,
		})
		this.map = new Map({
			interactions: defaultInteractions({
				mouseWheelZoom: false
			}),
			controls: defaultsControls({
				attribution: false,
				zoom: false,
				rotate: false
			}),
			layers: this.layers,
			view: this.view,
		});

		var mouseWheelInt = new MouseWheelZoom({
			condition: altKeyOnly
		});
		this.map.addInteraction(mouseWheelInt);
		console.log("init..",this.map );

	}

	// constructor(private _modalService: ModalSe) {
	// }

	// examplePolygonCoords() {
	// 	let polygon = [];
	// 	var c1 = [14.781447642043426, 41.130769884646625]
	// 	polygon.push(c1);
	// 	c1 = [14.781425474197626, 41.130739816046706]
	// 	polygon.push(c1);
	// 	c1 = [14.781484482794388, 41.13069132959179]
	// 	polygon.push(c1);
	// 	c1 = [14.78164876809219, 41.1308832549327]
	// 	polygon.push(c1);
	// 	c1 = [14.781767784182525, 41.13096304741808]
	// 	polygon.push(c1);
	// 	c1 = [14.781704081720111, 41.13101759445141]
	// 	polygon.push(c1);
	// 	c1 = [14.781596122810129, 41.13095345117605]
	// 	polygon.push(c1);
	// 	c1 = [14.78135405344863, 41.13117365932768]
	// 	polygon.push(c1);
	// 	c1 = [14.780936299395641, 41.1309191067195]
	// 	polygon.push(c1);
	// 	c1 = [14.781140147274387, 41.13073879802389]
	// 	polygon.push(c1);
	// 	c1 = [14.781236036248783, 41.13080092124336]
	// 	polygon.push(c1);
	// 	c1 = [14.781363783391921, 41.13069486506368]
	// 	polygon.push(c1);
	// 	return polygon;
	// }
	ngOnInit() {
		this.createActionsForReference();
	}
	ngAfterViewInit() {
		this.initMap();
		this.map.setTarget(this.mapRef.nativeElement);
		this.fitMap();
		timer(500).subscribe(val => {
			this.map.updateSize();
		});

	}
	createActionsForReference = () => {
		// let button = new DataTableAction();
		// button.funcToInvoke = (element) => {
		// 	this.onDeleteRequest.emit(element);
		// };
		// button.label = "common.deleteButtonLabel";
		// button.icon = iconTrash;
		// // button.enablePermission="localizableentities.write";
		// this.actions.push(button);

		// button = new DataTableAction();
		// button.funcToInvoke = this.openModalEditor;
		// button.label = "common.updateButtonLabel";
		// button.icon = iconEdit;
		// // button.enablePermission="localizableentities.write";		
		// this.actions.push(button);

	}
	// openModalEditor = (element) => {
	// 	let callBack = (result: GeoSpatialReference) => {
	// 		if (result) {
	// 			console.log("risultato callback", result);
	// 			if(result.centerPoint){
	// 				this._reference.centerPoint = result.centerPoint;
	// 				// this.center = result.centerPoint.coordinates;

	// 			}
	// 			if(result.polygon){
	// 				this._reference.polygon = result.polygon
	// 				// this.polygonArea = result.polygon.coordinates
	// 			}
	// 			this.reference = result;
	// 			this.fitMap();
	// 			this.onSaveRequest.emit(result);
	// 		}
	// 	}
	// 	let options = new ModalOptions();
	// 	options.size = "xl";
	// 	options.callback = callBack;
	// 	let data: MapEditorInputDataDef = new MapEditorInputDataDef();
	// 	// data.geoSpatialReference = new GeoSpatialReference;
	// 	// if (this._reference && this._reference.centerPoint)
	// 	// 	data.geoSpatialReference.centerPoint = {
	// 	// 		type: "Point",
	// 	// 		coordinates: this._center
	// 	// 	}
	// 	// if(this._reference && this._reference.polygon)
	// 	// 	data.geoSpatialReference.polygon = {
	// 	// 		type: "Polygon",
	// 	// 		coordinates: this._polygonArea
	// 	// 	}
	// 	data.geoSpatialReference = this._reference;
	// 	data.title = "contents.selectModalMap";
	// 	// data.message = "contents.selectModalMap";

	// 	this._modalService.showEditOnMap(data, options);
	// }


	fitMap() {
		let multiPoint: MultiPoint = new MultiPoint([]);
		let pointCounter = 0;
		if (this._polygonArea && this._polygonArea[0] && this._polygonArea[0].length > 0) {
			this._polygonArea[0].forEach(c => {
				pointCounter++;
				multiPoint.appendPoint(new Point([c[0], c[1]]));
			});
		}

		if (this._center && this._center.length > 0) {
			pointCounter++;
			multiPoint.appendPoint(new Point(this._center));
		}

		if (pointCounter > 1) {
			this.map.getView().fit(multiPoint.getExtent(), {
				duration: 2500
			});
		}
		else if (this._center && this._center.length > 0) {
			console.log("center");
			this.map.getView().animate({
				center: this._center,
				zoom: 17,
				duration: 2500
			})
		}
	}

	// invokeAction = ($event, action: ActionCommand, item): void => {
	// 	console.log("invokeAction");

	// 	if (action.enableFunc(item))
	// 		action.funcToInvoke(item)
	// 	$event.preventDefault();
	// }

	hello() {
		console.log("HELLO");

	}
}


