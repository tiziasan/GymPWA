import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Observable, of} from 'rxjs';
import {Action, Store} from '@ngrx/store';
import {catchError, mergeMap, switchMap, tap} from 'rxjs/operators';
import {FeedbackGymService} from '../services/feedback-gym.service';
import {
  EFeedbackGymActions,
  ShowAllAction,
  ShowAllFailureAction,
  ShowAllSuccessAction,
  CreateAction,
  CreateFailureAction,
  CreateSuccessAction,
  UpdateAction,
  UpdateSuccessAction,
  UpdateFailureAction,
  DeleteAction,
  DeleteSuccessAction, DeleteFailureAction
} from '../actions/feedback-gym.actions';
import {selectUserToken} from '../selectors/user.selector';
import {IAppState} from '../state/app.states';
import {Router} from '@angular/router';

@Injectable()
export class FeedbacksGymEffects {

  constructor(private store: Store<IAppState>, private actions: Actions, private feedbackGymService: FeedbackGymService, private router: Router) { }

  @Effect()
  findAll: Observable<Action> =
    this.actions.pipe(
      ofType<ShowAllAction>(EFeedbackGymActions.SHOW_ALL),
      switchMap((action) => {
        return this.feedbackGymService.getAll(action.idGym).pipe(
          mergeMap( (feedbacks) => [{feedbacks, idGym: action.idGym}]
          ),
        );
      }),
      switchMap((payload) => of(new ShowAllSuccessAction(payload))),
      catchError(() => of(new ShowAllFailureAction()))
    );

  @Effect()
  create: Observable<Action> =
    this.actions.pipe(
      ofType<CreateAction>(EFeedbackGymActions.CREATE),
      switchMap((action) => {
        return this.store.select(selectUserToken).pipe(
          mergeMap( (token) => {
            return this.feedbackGymService.save(action.feedback, token).pipe(
              mergeMap( (result) => {
                const id: number = +result.headers.get('Location').substring(result.headers.get('Location').lastIndexOf('/') + 1);
                return [{...action.feedback, id}];
              })
            );
          })
        );
      }),
      switchMap((payload) => of(new CreateSuccessAction(payload))),
      tap(() => {
        return this.router.navigate(['./']);
      }),
      catchError(() => of(new CreateFailureAction()))
    );

  @Effect()
  update: Observable<Action> =
    this.actions.pipe(
      ofType<UpdateAction>(EFeedbackGymActions.UPDATE),
      switchMap((action) => {
        return this.store.select(selectUserToken).pipe(
          mergeMap( (token) => {
            return this.feedbackGymService.update(action.feedback, token).pipe(
              mergeMap( () => [{...action.feedback}] )
            );
          })
        );
      }),
      switchMap((payload) => of(new UpdateSuccessAction(payload))),
      tap(() => {
        return this.router.navigate(['./']);
      }),
      catchError(() => of(new UpdateFailureAction()))
    );

  @Effect()
  delete: Observable<Action> =
    this.actions.pipe(
      ofType<DeleteAction>(EFeedbackGymActions.DELETE),
      switchMap((action) => {
        return this.store.select(selectUserToken).pipe(
          mergeMap( (token) => {
            return this.feedbackGymService.delete(action.feedback, token).pipe(
              mergeMap( () => [action.feedback])
            );
          })
        );
      }),
      switchMap((payload) => of(new DeleteSuccessAction(payload))),
      tap(() => {
        return this.router.navigate(['./']);
      }),
      catchError(() => of(new DeleteFailureAction()))
    );

}
