import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {List, Product} from '../pages/home/home.page';
import {Observable} from 'rxjs';
import * as firebase from 'firebase';
import {distinctUntilChanged, map} from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class FirebaseService {

    constructor(private db: AngularFirestore) {
    }

    listenToSelectedListChanges(listId: string): Observable<any> {
        return this.db.collection<Product>('shoppingList')
            .doc(listId)
            .collection('list', product => product.orderBy('created', 'asc'))
            .valueChanges({idField: 'id'});
    }

    setItemToUnticked(listId: string, product: Product) {
        this.db.collection('shoppingList').doc(listId).collection('list').doc(product.id).set({...product, ticked: false});
    }

    setItemToTicked(listId: string, product: Product) {
        this.db.collection('shoppingList').doc(listId).collection('list').doc(product.id).set({...product, ticked: true});
    }

    async addEmptyProductToList(listId: string) {
        await this.db.collection('shoppingList').doc(listId).collection('list').add({
            productName: '',
            ticked: false,
            created: firebase.firestore.Timestamp.now()
        });
    }

    editProductName(listId: string, productName: string | number, product: Product) {
        this.db.collection('shoppingList').doc(listId).collection('list').doc(product.id).set({...product, productName});

    }

    removeProduct(listId: string, product: Product) {
        this.db.collection('shoppingList').doc(listId).collection('list').doc(product.id).delete();
    }

    createNewList({email, listName, photoURL}) {
        const dataToInsert = {
            listName,
            members: {
                [email]: {
                    exist: true,
                    photoURL
                }
            }
        };
        this.db.collection('shoppingList').add(dataToInsert);
    }

    deleteList(listId: string) {
        return this.db.collection('shoppingList').doc(listId).delete();
    }

    getUserLists(userEmail: string): Observable<List[]> {
        const path = new firebase.firestore.FieldPath('members', userEmail, 'exist');
        return this.db.collection<List>('shoppingList', list => list.where(path, '==', true)).valueChanges({idField: 'id'}).pipe(
            distinctUntilChanged()
        );
    }

    async setUserCredentials(user) {
        const userData = await this.db.collection('users', _user => _user.where('email', '==', user.email).limit(1)).get().toPromise();
        if (userData.empty) {
            this.db.collection('users').add({email: user.email, photoURL: user.photoURL, displayName: user.displayName, lists: []});
        }
    }

    addCollaborator() {


    }
}
