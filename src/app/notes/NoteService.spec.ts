import { it, describe, expect, beforeEachProviders } from 'angular2/testing';
import {XHRBackend} from 'angular2/http';
import {NoteService} from './NoteService';
import {HTTP_PROVIDERS} from 'angular2/http';
import {provide} from 'angular2/core';
import {MockBackend} from 'angular2/src/http/backends/mock_backend';
import {MockConnection} from 'angular2/src/http/backends/mock_backend';
import {Response, ResponseOptions} from 'angular2/http';
import {Note} from './Note';
import {inject} from 'angular2/testing';
import {provideStore} from '@ngrx/store';
import {notesReducer, selectedNoteReducer} from './notesReducers';
import {Store, Action, Reducer} from '@ngrx/store';
import {NoteAction} from './NoteAction';
import {RequestMethod} from 'angular2/http';
import {Toast2Type} from '../toast2/toast2';
import {Toast2Service} from '../toast2/Toast2Service';

class MockError extends Error {
  constructor(status: number, message: string = undefined) {
    super(message);
  }
}

describe('NoteService', () => {

  let receivedActions: Action[];

  let mockReducer: Reducer<any> = (state: any = [], action: Action) => {
    if (action.type !== '@@ngrx/INIT') {
      receivedActions.push(action);
    }
    return state;
  };

  beforeEachProviders(() => {
    return [
      HTTP_PROVIDERS,
      provide(XHRBackend, {useClass: MockBackend}),
      provideStore({mockReducer}),
      Toast2Service,
      NoteService
    ];
  });

  beforeEach(() => {
    receivedActions = [];
  });

  it('should get all notes', inject([XHRBackend, NoteService], (mockBackend, noteService) => {
    const NOTES = [
      new Note('note 1', '', 1)
    ];

    mockBackend.connections.subscribe((connection: MockConnection) => {
      if (connection.request.method === RequestMethod.Get) {
        connection.mockRespond(new Response(new ResponseOptions({
          body: NOTES
        })));
      }
    });

    noteService.getAll();

    expect(receivedActions).toEqual([{type: NoteAction.GET_ALL, payload: NOTES}]);
  }));

  it('should create a new note', inject([XHRBackend, NoteService], (mockBackend, noteService) => {
    const NOTE = new Note('note 2', '');

    mockBackend.connections.subscribe((connection: MockConnection) => {
      if (connection.request.method === RequestMethod.Post) {
        connection.mockRespond(new Response(new ResponseOptions({
          body: connection.request.text()
        })));
      }
    });

    noteService.createNote(NOTE);

    expect(receivedActions.length).toEqual(1);
    let action = receivedActions[0];
    expect(action.type).toBe(NoteAction.CREATE);
    expect(action.payload.title).toEqual(NOTE.title);
    expect(action.payload.id).toBeDefined();
  }));

  it('should delete a note', inject([XHRBackend, NoteService], (mockBackend, noteService) => {
    const NOTE = new Note('note 2', '', 2);

    mockBackend.connections.subscribe((connection: MockConnection) => {
      if (connection.request.method === RequestMethod.Delete) {
        connection.mockRespond(new Response(new ResponseOptions({
          body: connection.request.text()
        })));
      }
    });

    noteService.deleteNote(NOTE);

    expect(receivedActions).toEqual([{type: NoteAction.DELETE, payload: NOTE}]);
  }));

  it('should update a note', inject([XHRBackend, NoteService], (mockBackend, noteService) => {
    const NOTE = new Note('note 2', '', 2);

    mockBackend.connections.subscribe((connection: MockConnection) => {
      if (connection.request.method === RequestMethod.Put) {
        connection.mockRespond(new Response(new ResponseOptions({
          body: connection.request.text()
        })));
      }
    });

    noteService.updateNote(NOTE);

    expect(receivedActions.length).toEqual(1);
    let action = receivedActions[0];
    expect(action.type).toBe(NoteAction.UPDATE);
    expect(action.payload.title).toEqual(NOTE.title);
    expect(action.payload.id).toEqual(NOTE.id);
  }));

  it('should emit an error when get all notes fails',
    inject([XHRBackend, NoteService], (mockBackend, noteService) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockError(new MockError(500));
      });

      noteService.getAll();

      expect(receivedActions.length).toEqual(1);
      let action = receivedActions[0];
      expect(action.type).toBe(Toast2Type.ERROR);
    }));

});
