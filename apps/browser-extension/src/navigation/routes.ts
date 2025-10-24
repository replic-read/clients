import { Routes } from '@angular/router';
import { SetEndpointViewModel } from '../components/set_endpoint/set_endpoint';
import { SignupViewModel } from '../components/signup/SignupViewModel';
import { LoginViewModel } from '../components/login/LoginViewModel';
import { NotVerifiedViewModel } from '../components/not_verified/NotVerifiedViewModel';
import { CreateReplicViewModel } from '../components/create_replic/CreateReplicViewModel';
import { ReplicCreatedViewModel } from '../components/replic_created/ReplicCreatedViewModel';
import { HomeViewModel } from '../components/home/HomeViewModel';

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
