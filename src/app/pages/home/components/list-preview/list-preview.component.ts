import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-list-preview',
    templateUrl: './list-preview.component.html',
    styleUrls: ['./list-preview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListPreviewComponent implements OnInit {

    @Input() list: any;
    @Input() userId: string;

    @Output() navigateToList = new EventEmitter();


    constructor() {
        console.log(this.list);
    }

    ngOnInit() {
    }

    enterList() {
        this.navigateToList.emit(this.list);

    }
}
