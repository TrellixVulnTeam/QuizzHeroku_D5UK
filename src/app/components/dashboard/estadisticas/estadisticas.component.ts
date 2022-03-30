import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { element } from 'protractor';
import { Subscription } from 'rxjs';
import { RespuestaQuizzService } from 'src/app/services/respuesta-quizz.service';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit, OnDestroy {
  id: string;
  loading = false;
  listRespuestasUsuario: any[] = [];
  respuestasQuizz: Subscription = new Subscription();

  constructor(private aRoute: ActivatedRoute, 
              private _respuestaUsuarioService: RespuestaQuizzService,
              private toastr: ToastrService) {
    this.id = this.aRoute.snapshot.paramMap.get('id')!;              
  }

  ngOnInit(): void {
    this.getRespuestaByCuestionario();
  }

  ngOnDestroy(): void {
    this.respuestasQuizz.unsubscribe();
  }
  
  getRespuestaByCuestionario(){
    this.loading = true;

    this.respuestasQuizz = this._respuestaUsuarioService.getRespuestaByCuestionario(this.id).subscribe( data => {
      this.loading = false;
      this.listRespuestasUsuario = [];
      data.forEach((element:any) => {
        this.listRespuestasUsuario.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      })
      console.log(this.listRespuestasUsuario);
    }, error => {
      console.log(error);
      this.loading = false;
    })
  }

  eliminarRespuestaUsuario(id:string){
    this.loading = true;

    this._respuestaUsuarioService.deleteRespuestaUsuario(id).then(() => {
      this.loading = false;
      this.toastr.info('La respuesta fue eliminada','Respuesta Eliminada');
    }, error => {
      console.log(error);
      this.toastr.error('Estadistica ocurrio un error', 'Error');
    })
  }

}
