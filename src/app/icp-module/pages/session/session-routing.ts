import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EditSessionComponent } from "./edit-session/edit-session.component";

const routes: Routes = [
	{ path: ':id/edit', component: EditSessionComponent}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SessionRouting {
}
