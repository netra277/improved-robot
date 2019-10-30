import { Component, OnInit } from '@angular/core';
import { ItemsService } from 'src/app/services';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
items;
  constructor(private itemsService: ItemsService) { }

  ngOnInit() {
    this.itemsService.getAll().subscribe((data)=>{
      this.items = data;
    });
  }
  selectedItemRow(item){
    console.log(item);
  }

}
