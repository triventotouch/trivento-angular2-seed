import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Note} from './Note';
import {Store} from '@ngrx/store';
import {NotesState} from './notesReducers';
import {NoteAction} from './NoteAction';
import {Http, Headers} from 'angular2/http';
import {Toast2Service} from '../toast2/Toast2Service';
import {ApiHttp} from '../util/ApiHttp';

const BASE_URL = 'http://localhost:3100/note/';

@Injectable()
export class NoteService {

  constructor(private http: ApiHttp, private store: Store<NotesState>,
              private toast2Service: Toast2Service) {
  }

  getAll() {
    this.http.get(BASE_URL)
      .map(res => res.json())
      .map(payload => NoteAction.getAll(payload))
      .subscribe(action => this.store.dispatch(action));
  }

  saveNote(note: Note) {
    (note.id) ? this.updateNote(note) : this.createNote(note);
  }

  updateNote(note: Note) {
    this.http.put(BASE_URL + note.id, JSON.stringify(note))
      .map(res => res.json())
      .subscribe(payload => this.store.dispatch(NoteAction.updateNote(payload)));
  }

  createNote(note: Note) {
    let noteWithId: Note = Object.assign({}, note, {id: Math.ceil(Math.random() * 1000000)});
    this.http.post(BASE_URL, JSON.stringify(noteWithId))
      .map(res => res.json())
      .subscribe(payload => this.store.dispatch(NoteAction.createNote(payload)));
  }

  deleteNote(note: Note) {
    this.http.delete(BASE_URL + note.id)
      .subscribe(() => this.store.dispatch(NoteAction.deleteNote(note)));
  }
}
