import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EMPTY, Observable, catchError, retry, tap } from "rxjs";
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from "../../environments/environment";
import { AuthService } from "@services/auth.service";
import { Router } from "@angular/router";


@Injectable({
    providedIn: 'root'
})
export class ServeErrorsInterceptor implements HttpInterceptor{

    constructor(private snackBar: MatSnackBar, private authService: AuthService
        , private router: Router
    ){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token = this.authService.getToken();
        if (token) {
            req = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`,
              },
            });
          }
        return next.handle(req).pipe(
            retry(environment.RETRY)).pipe(
                tap(event => {
            if(event instanceof HttpResponse){
                if(event.body && event.body.error === true && event.body.errorMessage){
                    throw new Error(event.body.errorMessage);
                }/*else{
                    this.snackBar.open('SUCCESS', 'INFO', { duration: 2000});
                }*/
            }
        })).pipe(catchError( (err) => {
            if(err.status === 400){
                //console.log(err);
                this.snackBar.open(err.message, 'ERROR 400', { duration: 5000 });
            }
            else if (err.status === 404){
                this.snackBar.open('No existe el recurso', 'ERROR 404', { duration: 5000 });
            }
            else if (err.status === 403 || err.status === 401) {
                //console.log(err);
                this.snackBar.open(err.error.message, 'ERROR 403', { duration: 5000 });
                this.authService.logout();
                this.router.navigate(['/login']);
            }
            else if (err.status === 500) {
                this.snackBar.open(err.error.message, 'ERROR 500', { duration: 5000 });
            }
            else {
                this.snackBar.open(err.error.message, 'ERROR', { duration: 5000 });
            }

            return EMPTY;
        }));
    }

}
