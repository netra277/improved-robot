import { Component, OnInit } from '@angular/core';
import { BranchService } from 'src/app/services';
import { Branch } from 'src/app/models/branch.interface';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { CreateBranchComponent } from './create-branch/create-branch.component';
import { AlertsService } from 'src/app/commons/services/alerts.service';




@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css']
})
export class BranchesComponent implements OnInit {
  filterText: string;
  editMode: boolean = false;
  branchSelected: Branch;
   branches;
   options: NgbModalOptions = {
     size:'lg'
   }
  

  constructor(private branchService: BranchService, private modalService: NgbModal, private alertService: AlertsService) { 

  }

  ngOnInit() {
    this.branchService.getAll().subscribe(data => {
      console.log(data);
      this.branches = data;
      this.branchSelected = data[0];
    });
  }

  selectedBranchRow(branch:Branch){
    console.log('Branch', branch);
    this.branchSelected = branch;
  }

  createBranch(){
    const modalRef = this.modalService.open(CreateBranchComponent,this.options);
  }
}
