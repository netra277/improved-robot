import { Component, OnInit, Input } from '@angular/core';
import { Branch } from 'src/app/models/branch.interface';
import { AlertsService } from 'src/app/commons/services/alerts.service';
import { BranchService } from 'src/app/services';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit {
  @Input() selectedBranch;
  
  constructor(private alertService: AlertsService, private branchService: BranchService) { }

  ngOnInit() {
    this.selectedBranch = {
      _id:'',
      branchId:'',
      name:'',
      phone:'',
      email:'',
      address:'',
      isHeadBranch: false,
      printInvoice: false,
      tax:[
        {
          key:'',
          value:''
        }
      ]
    };
  }
  editBranch(){
    console.log('editing branch', this.selectedBranch);
    this.alertService.info('this is sample message');
  }

  deleteBranch(){
    if(this.selectedBranch && this.selectedBranch._id){
      console.log('deleting branch id', this.selectedBranch._id);
      this.branchService.deleteBranch(this.selectedBranch._id).subscribe(()=>{
        console.log('deleted successfully');
      },(error)=>{
        console.log('error in deleting branch');
      });
    }
  }
}
