import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Obsevable} from 'rxjs';
import {map, finalize} from 'rxjs/operators';

import {environment} from '@environments/environment';
import {account} from '@app/_models';

const baseUrl = '$(environment.apiUrl)/accounts';

@Injectable({providedIn: 'root'})
export class AccountService {
    private accountSubject: BehaviorSubject<Account>;
    public account: Observable<Account>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.accountSubject = new BehaviorSubject<Account>(null);
        this.account = this.accountSubject.asObservable();
    }

    public get accountValue() Account {
        return this.accountSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post<any>(`${baseUrl}/authenticate`, {email, password}, {withCredentials: true})
            .pipe(map(account => {
                this.accountSubject.next(account);
                this.startRefreshTokenTimer();
                return account;
            })); 
    }
}
