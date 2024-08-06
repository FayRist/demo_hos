import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
// import { ConfigServerService } from '../core/config-server.service';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {


  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    // return this.http.get<any>('/src/app/_fake/usersAdmit.json');
    return this.http.get<any>('assets/usersAdmit.json');
  }


  getBed(): Observable<any> {
    // return this.http.get<any>('/src/app/_fake/usersAdmit.json');
    return this.http.get<any>('assets/allBed.json');
  }
}
