import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AlertsService } from 'src/app/commons/services/alerts.service';
import { CreateUserComponent } from './create-user/create-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  filterText: string;
  editMode: boolean = false;
  selectedUser: any;
  usersList;
   options: NgbModalOptions = {
     size:'lg'
   }

  constructor(private userService: UserService, private modalService: NgbModal,
    private alertService: AlertsService) { }

    ngOnInit() {
      this.userService.getAll().subscribe(data => {
        console.log(data);
        this.usersList = data;
        this.selectedUser = data[0];
      });
    }
  
    // selectedBranchRow(user){
    //   console.log('Branch', branch);
    //   this.selectedBranch = branch;
    // }
  
    createUser(){
      const modalRef = this.modalService.open(CreateUserComponent,this.options);
    }

}
