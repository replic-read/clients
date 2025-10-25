import { Routes } from '@angular/router';
import { SetEndpointViewModel } from '../components/set_endpoint/set_endpoint';
import { SignupViewModel } from '../components/signup/signup';
import { LoginViewModel } from '../components/login/login';
import { NotVerifiedViewModel } from '../components/not_verified/NotVerifiedViewModel';
import { CreateReplicViewModel } from '../components/create_replic/create_replic';
import { ReplicCreatedViewModel } from '../components/replic_created/replic_created';
import { HomeViewModel } from '../components/home/home';

/**
 * The routes that are used in the app.
 */
export const routes: Routes = [
  {
    path: '',
    component: HomeViewModel,
  },
  {
    path: 'endpoint-config',
    component: SetEndpointViewModel,
  },
  {
    path: 'signup',
    component: SignupViewModel,
  },
  {
    path: 'login',
    component: LoginViewModel,
  },
  {
    path: 'not-verified',
    component: NotVerifiedViewModel,
  },
  {
    path: 'create-replic',
    component: CreateReplicViewModel,
  },
  {
    path: 'replic-created/:replic_id',
    component: ReplicCreatedViewModel,
  },
];
