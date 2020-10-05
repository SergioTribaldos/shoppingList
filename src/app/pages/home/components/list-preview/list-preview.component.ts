import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {List} from '../../../../core/types/interfaces/list';


@Component({
    selector: 'app-list-preview',
    templateUrl: './list-preview.component.html',
    styleUrls: ['./list-preview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListPreviewComponent implements OnInit {

    @Input() list: List;
    @Input() userId: string;

    listSize: number;
    remainingProducts: number;
    readonly previewListSize = 3;

    @Output() navigateToList = new EventEmitter();


    constructor() {

    }

    ngOnInit() {
        this.listSize = this.list.list.length;
        this.remainingProducts = this.listSize - this.previewListSize;
        this.list.list = this.list.list.slice(0, this.previewListSize);
    }

    enterList() {
        this.navigateToList.emit(this.list);

    }
}
