import { Component, Input, SimpleChanges } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgIf, NgClass, NgFor } from '@angular/common';
import { Location } from '@angular/common';
@Component({
  selector: 'app-paginator',
  standalone:true,
  imports: [RouterModule,NgClass],
  templateUrl: './paginator.component.html'
})
export class PaginatorComponent {
  constructor(private router:Router,private location:Location) { }

  @Input() paginator:any={};
  @Input() url:string='';

  paginas:number[]
  desde:number
  hasta:number

   ngOnInit(): void {
     this.initPaginator()
   }
 
   ngOnChanges(changes:SimpleChanges ){
     let paginadorActualizado=changes['paginator']
     if(paginadorActualizado.previousValue){
       this.initPaginator()
     }
   }
 
   private initPaginator(): void {
    if (!this.paginator || this.paginator.totalPages === undefined || this.paginator.number === undefined) {
      console.error("El paginador no tiene datos correctos:", this.paginator);
      return;
    }
  
    const totalPages = this.paginator.totalPages;
    const currentPage = this.paginator.number + 1; // Ajuste para indexación base 1
  
    const maxPagesToShow = 5; // Máximo de páginas visibles
  
    if (totalPages <= maxPagesToShow) {
      this.desde = 1;
      this.hasta = totalPages;
    } else {
      const middle = Math.floor(maxPagesToShow / 2);
  
      if (currentPage <= middle) {
        this.desde = 1;
        this.hasta = maxPagesToShow;
      } else if (currentPage >= totalPages - middle) {
        this.desde = totalPages - maxPagesToShow + 1;
        this.hasta = totalPages;
      } else {
        this.desde = currentPage - middle;
        this.hasta = currentPage + middle - 1;
      }
    }
  
    this.paginas = Array.from({ length: this.hasta - this.desde + 1 }, (_, i) => i + this.desde);
  
  }

}