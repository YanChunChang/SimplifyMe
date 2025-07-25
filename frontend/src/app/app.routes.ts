import { Routes } from '@angular/router';
import { CaptionComponent } from './components/caption/caption.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { SimplificationComponent } from './components/simplification/simplification.component';

export const routes: Routes = [
    { path: '', redirectTo: 'homepage', pathMatch: 'full' },
    { path: 'homepage', component: HomepageComponent },
    { path: 'caption', component: CaptionComponent },
    { path: 'simplification', component: SimplificationComponent },
];
