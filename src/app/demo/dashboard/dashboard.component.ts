// angular import
import { Component, OnInit, inject, TemplateRef, ChangeDetectorRef } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

declare const AmCharts: any;
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import '../../../assets/charts/amchart/amcharts.js';
import '../../../assets/charts/amchart/gauge.js';
import '../../../assets/charts/amchart/serial.js';
import '../../../assets/charts/amchart/light.js';
import '../../../assets/charts/amchart/pie.min.js';
import '../../../assets/charts/amchart/ammap.min.js';
import '../../../assets/charts/amchart/usaLow.js';
import '../../../assets/charts/amchart/radar.js';
import '../../../assets/charts/amchart/worldLow.js';

import dataJson from 'src/fake-data/map_data';
import mapColor from 'src/fake-data/map-color-data.json';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DashboardService } from 'src/app/service/dashboard.service';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatStepperModule} from '@angular/material/stepper';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SharedModule,
    MatButtonModule,
    MatStepperModule,],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export default class DashboardComponent implements OnInit {
  closeResult = '';

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  therdFormGroup = this._formBuilder.group({
    therdCtrl: ['', Validators.required],
  });
  FordFormGroup = this._formBuilder.group({
    FordCtrl: ['', Validators.required],
  });
  isLinear = false;

  allBed = [];
  admitList = [];
  admitListClose = [];
  admitListAll = [];
  allDialysis = [
    {
      itemName: 'AA01',
      itemId: 'AA01',
      status: 'wait'
    },    {
      itemName: 'BB02',
      itemId: 'BB02',
      status: 'wait'
    },
    {
      itemName: 'CC03',
      itemId: 'CC03',
      status: 'wait'
    },
    {
      itemName: 'DD04',
      itemId: 'DD04',
      status: 'wait'
    },
  ];

  public badName = '';
  public dialysisName = '';
  public firstName = '';
  public lastName = '';
  public hn = '';
  public visitId = '';
  public phone = '';
  public weigth = 10;
  public height = 10;
  public day: any;
  public month: any;
  public year: any;
  public age: any;
  public address: {
    addressLine: '',
    district: '',
    city: '',
    province: '',
    postCode: '',
  };

  constructor(
    private modalService: NgbModal
    , private _formBuilder: FormBuilder
    // , private modal: NgbActiveModal
    , private dashboardService: DashboardService
    , private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.loadData();
    }, 500);
  }

  loadData(): void {

    this.dashboardService.getData().subscribe(data => {

      this.admitList = data.filter(x => x.status == 'wait');
      this.admitListClose = data.filter(x => x.status == 'close');
      this.admitListAll = data;
      this.changeDetectorRef.detectChanges();
    });


    this.dashboardService.getBed().subscribe(data => {
      this.allBed = data;
      this.changeDetectorRef.detectChanges();
    });
  }


  openModalAdmit(content: TemplateRef<any>, data: any) {
    this.firstName = data.firstname;
    this.lastName = data.lastname;
    this.hn = data.hn;
    this.visitId = data.visitId;
    this.phone = data.phone;
    // this.weigth = null;
    // this.height = null;
    this.day = '5';
    this.month =  '5';
    this.year = '1998';
    this.age = '26';
    this.address= {
      addressLine: data.address.addressLine,
      district: data.address.district,
      city: data.address.city,
      province: data.address.province,
      postCode: data.address.postCode,
    };

		this.modalService.open(content, { size: 'lg' }).result.then(
			(result) => {
        let a = data.status;
        // let usersAdmit = UsersAdmitTable.filter(x => x.hn == data.hn && x.visitId == data.visitId);
        const index = this.admitList.findIndex(x => x.hn == data.hn && x.visitId == data.visitId);
        this.badName;
        this.dialysisName;
        const indexBed = this.allBed.findIndex(x => x.badName == this.badName);
        if (index !== -1) {
          this.admitListAll[index].status = 'in progress';
          this.admitListAll[index].dialysisName = this.dialysisName;
          this.admitListAll[index].badName = this.badName;
          this.admitListAll[index].weigth = this.weigth;
          this.admitListAll[index].height = this.height;

          this.admitList[index].status = 'in progress';
          this.admitList[index].dialysisName = this.dialysisName;
          this.admitList[index].badName = this.badName;

          this.allBed[indexBed].userFullName = data.fullname;
          this.allBed[indexBed].userHn = data.hn;
          this.allBed[indexBed].visitId = data.visitId;
          this.allBed[indexBed].dialysisName = this.dialysisName;

          this.admitList = this.admitList.filter(x => x.hn !== data.hn && x.visitId !== data.visitId);
          this.changeDetectorRef.detectChanges();

        }
        console.log(this.admitList);
				this.closeResult = `Closed with: ${result}`;
			}
		);
	}


  openModalBed(content: TemplateRef<any>, data: any) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
        const indexBed = this.allBed.findIndex(x => x.userHn == data.userHn && x.userFullName == data.userFullName);
        const index = this.admitListAll.findIndex(x => x.hn == data.userHn && x.fullname == data.userFullName);
        if (index !== -1) {
          this.admitListAll[index].status = 'close';
          this.allBed[indexBed].userFullName = '';
          this.allBed[indexBed].userHn = '';
          this.allBed[indexBed].visitId = '';
          this.allBed[indexBed].dialysisName = '';

          this.admitListClose.push(this.admitListAll[index]);
          // this.allBed[indexBed].userHn = data.hn;
          this.changeDetectorRef.detectChanges();

        }
				this.closeResult = `Closed with: ${result}`;
			}
		);
	}


  openModalHemo(hemodialysis: TemplateRef<any>) {

		this.modalService.open(hemodialysis, { size: 'lg' }).result.then(
			(result) => {
        // let a = data.status;
        // let usersAdmit = UsersAdmitTable.filter(x => x.hn == data.hn && x.visitId == data.visitId);
        //   const index = this.admitList.findIndex(x => x.hn == data.hn && x.visitId == data.visitId);
        //   this.badName;
        //   this.dialysisName;
        //   const indexBed = this.allBed.findIndex(x => x.badName == this.badName);
        //   if (index !== -1) {
        //     this.changeDetectorRef.detectChanges();

        //   }
        // 	this.closeResult = `Closed with: ${result}`;
			}
		);
	}


  openModalTable(table: TemplateRef<any>) {

		this.modalService.open(table, { size: 'lg' }).result.then(
			(result) => {
        // let a = data.status;
        // let usersAdmit = UsersAdmitTable.filter(x => x.hn == data.hn && x.visitId == data.visitId);
        //   const index = this.admitList.findIndex(x => x.hn == data.hn && x.visitId == data.visitId);
        //   this.badName;
        //   this.dialysisName;
        //   const indexBed = this.allBed.findIndex(x => x.badName == this.badName);
        //   if (index !== -1) {
        //     this.changeDetectorRef.detectChanges();

        //   }
        // 	this.closeResult = `Closed with: ${result}`;
			}
		);
	}

  openModalCamera(camera: TemplateRef<any>) {

		this.modalService.open(camera, { size: 'lg' }).result.then(
			(result) => {
        // let a = data.status;
        // let usersAdmit = UsersAdmitTable.filter(x => x.hn == data.hn && x.visitId == data.visitId);
        //   const index = this.admitList.findIndex(x => x.hn == data.hn && x.visitId == data.visitId);
        //   this.badName;
        //   this.dialysisName;
        //   const indexBed = this.allBed.findIndex(x => x.badName == this.badName);
        //   if (index !== -1) {
        //     this.changeDetectorRef.detectChanges();

        //   }
        // 	this.closeResult = `Closed with: ${result}`;
			}
		);
	}

  onClose(result: any = null) {
    // this.modal.close(result);
  }


  onSave() {
    let data = {};
    // data = {
    //   hn: this.hn,
    //   bedNo: this.bedNo,
    //   startDate: new Date((this.model.month)+'-'+(this.model.day)+'-'+(this.model.year)),
    //   time: this.time,
    // };

    // this.allBedService.updateBad(data).pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
      // this.modal.close(data);
      // this.modal.dismiss('Cross click')
      this.changeDetectorRef.detectChanges();

    // }, err => {
    //   console.error(err);
    // });
  }

}
