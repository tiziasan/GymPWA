import {Injectable, } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Observable, of} from 'rxjs';
import {Action} from '@ngrx/store';
import {catchError, switchMap} from 'rxjs/operators';
import {GymService} from '../services/gym.service';
import {
  EGymActions,
  GetGymAction, GetGymFailureAction,
  GetGymSuccessAction,
  ShowAllAction,
  ShowAllFailureAction,
  ShowAllSuccessAction
} from '../actions/gym.actions';

@Injectable()
export class GymEffects {

  constructor(private actions: Actions, private gymService: GymService) { }

  @Effect()
  showAll: Observable<Action> =
    this.actions.pipe(
      ofType<ShowAllAction>(EGymActions.SHOW_ALL),
      switchMap((action) => this.gymService.getGymsByRegion(action.region)),
      switchMap((gyms) => {
        gyms.forEach(e => {
          e.courses = [];
          e.feedbacks = [];
        });
        return [gyms];
      }),
      switchMap((payload) => of(new ShowAllSuccessAction(payload))),
      catchError(() => of(new ShowAllFailureAction()))
    );

  @Effect()
  getGym: Observable<Action> =
    this.actions.pipe(
      ofType<GetGymAction>(EGymActions.GET_GYM),
      switchMap((action) => this.gymService.getGym(action.idGym)),
      switchMap((gym) => {
        gym.courses = [];
        gym.feedbacks = [];
        return [gym];
      }),
      switchMap((payload) => of(new GetGymSuccessAction(payload))),
      catchError(() => of(new GetGymFailureAction()))
    );

}
