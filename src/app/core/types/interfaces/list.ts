import {Product} from './product';

export interface List {
    id: string;
    listName: string;
    members: {
        exist: boolean,
        photoURL: string
    };

    list: Product[];
}
