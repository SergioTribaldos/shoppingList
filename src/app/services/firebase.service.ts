import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Invitation, List, Product} from '../pages/home/home.page';
import {forkJoin, Observable, of} from 'rxjs';
import * as firebase from 'firebase';
import {concatMap, distinctUntilChanged, exhaustMap, map, mergeMap, switchMap, take, tap} from 'rxjs/operators';
import {ShoppingList} from '../pages/shopping-list/shopping-list.component';


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

    listenToShoppingListChanges(listId: string): Observable<ShoppingList> {
        return this.db.collection<ShoppingList>('shoppingList', list => list.orderBy('members.accountCreator', 'asc'))
            .doc(listId)
            .valueChanges() as Observable<ShoppingList>;
    }

    listenToInvitationsChanges(userId: string) {
        return this.db.collection<any>('invitations', list => list.where('invited', '==', userId))
            .valueChanges();
    }

    acceptInvitation(invitation: Invitation, photoURL: string, displayName: string) {
        this.db.collection('shoppingList').doc(invitation.listId).set({
            members: {
                [invitation.invited]: {
                    confirmed: true,
                    displayName,
                    photoURL
                }
            }
        }, {merge: true});

        this.deleteInvitation(invitation.listId, invitation.invited);
    }

    addCollaborator(newMemberData: any, {createdBy, listName, listId}) {
        this.db.collection<List>('shoppingList')
            .doc(listId).set({members: newMemberData}, {merge: true});

        this.addToInvitationsCollection(listId, listName, createdBy, newMemberData);
    }

    deleteCollaborator(listId: string, memberId: string) {
        this.db
            .collection('shoppingList')
            .doc(listId)
            .set({
                members: {
                    [memberId]: firebase.firestore.FieldValue.delete()
                }
            }, {merge: true});

        this.deleteInvitation(listId, memberId);
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

    createNewList({email, listName, photoURL, displayName}) {
        const dataToInsert = {
            createdBy: email,
            listName,
            members: {
                [email]: {
                    displayName,
                    accountCreator: true,
                    confirmed: true,
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

    getUserLists(userEmail: string): Observable<any> {
        const emailPath = new firebase.firestore.FieldPath('members', userEmail, 'exist');
        const confirmedPath = new firebase.firestore.FieldPath('members', userEmail, 'confirmed');

        return this.db.collection<any>('shoppingList',
            list => list
                .where(emailPath, '==', true)
                .where(confirmedPath, '==', true))
            .valueChanges({idField: 'id'}).pipe(
                distinctUntilChanged(),
                concatMap((lists) => {
                    let listArray = [];
                    const productLists = lists.map((list) => {
                        return this.db.collection('shoppingList').doc(list.id).collection('list').get().pipe(
                            map((val) => {
                                const itemsList = val.docs.map((value) => value.data());
                                const mergedList = {...list, list: itemsList};
                                listArray = [...listArray, mergedList];
                                return listArray;
                            })
                        );
                    });

                    return productLists;
                }),
                concatMap((productLists) => forkJoin({productLists})),
                map((values) => values.productLists)
            );
    }

    async setUserCredentials(user) {
        const userData = await this.db.collection('users', _user => _user.where('email', '==', user.email).limit(1)).get().toPromise();
        if (userData.empty) {
            this.db.collection('users').add({email: user.email, photoURL: user.photoURL, displayName: user.displayName, lists: []});
        }
    }

    private addToInvitationsCollection(listId: string, listName: string, createdBy: string, newMemberData: object) {
        const newInvitation = {
            inviter: createdBy,
            invited: Object.keys(newMemberData)[0],
            listId,
            listName
        };

        this.db.collection('invitations').add(newInvitation);
    }

    private deleteInvitation(listId: string, memberId: string) {

        this.db.collection('invitations', invitation => invitation.where('listId', '==', listId)
            .where('invited', '==', memberId))
            .get()
            .pipe(
                take(1),
                tap((val) => {
                    val.forEach((doc) => {
                        doc.ref.delete();
                    });
                })
            ).subscribe();

    }

}
