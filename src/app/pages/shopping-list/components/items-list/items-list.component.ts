import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren} from '@angular/core';
import {Product} from '../../../home/home.page';
import {Observable, Subject} from 'rxjs';
import {IonInput} from '@ionic/angular';

@Component({
    selector: 'app-items-list',
    templateUrl: './items-list.component.html',
    styleUrls: ['./items-list.component.scss'],
})
export class ItemsListComponent implements OnInit {
    @Input() tickedItems$: Observable<Product>;
    @Input() untickedItems$: Observable<Product>;

    @Output()
    moveToTickedList = new EventEmitter<Product>();
    @Output()
    moveToUntickedList = new EventEmitter<Product>();
    @Output()
    editProductName = new EventEmitter<{ productName: string | number, product: Product }>();
    @Output()
    removeProduct = new EventEmitter<Product>();
    @Output()
    addEmptyProduct = new EventEmitter();

    @ViewChildren('input') productsList: QueryList<IonInput>;

    constructor() {
    }

    ngOnInit() {
    }


    showDeleteButton(removeProductButton: any) {
        removeProductButton.el.hidden = false;
    }

    hideDeleteButton(removeProductButton: any) {
        removeProductButton.el.hidden = true;
    }

    trackById(index: number, item: Product) {
        return item.id;
    }

}
