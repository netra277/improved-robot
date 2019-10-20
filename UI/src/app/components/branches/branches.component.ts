import { Component, OnInit } from '@angular/core';
import { BranchService } from 'src/app/services';
import { Branch } from 'src/app/models/branch.interface';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';




@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css']
})
export class BranchesComponent implements OnInit {
  filterText: string;
  editMode: boolean = false;
  selectedBranch: Branch= {
    address: 'this is address',
    branchId:'ABC001',
    email: 'abc@abc.com',
    phone: 1234567898,
    isHeadBranch: true,
    name: 'kukatpally',
    printInvoice: true,
    tax:[]
  };
   branches;
  

  constructor(private branchService: BranchService) { 

  }

  ngOnInit() {
    this.branchService.getAll().subscribe(data => {
      console.log(data);
      this.branches = data;
    });
  }

  selectedBranchRow(branch:Branch){
    console.log('Branch', branch);
    this.selectedBranch = branch;
  }

  editBranch(){
    console.log('editing branch', this.selectedBranch);
    this.editMode = true;
  }
  deleteBranch(){
    this.editMode = false;
  }
}
