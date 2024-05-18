import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, MinLengthValidator, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  apiUrl: string = 'http://localhost:8081/api/clientes';
  clientes: any[] = [];

  constructor(
    private httpClient: HttpClient
  ) {

  }
  formCadastro = new FormGroup({
    nomeCliente: new FormControl('', [
      Validators.required, Validators.minLength(8)
    ]),
    emailCliente: new FormControl('', [
      Validators.required, Validators.email
    ]),
    telefoneCliente: new FormControl('', [
      Validators.required, Validators.pattern(/^\d{11}$/)
    ])
  });

  formEdicao = new FormGroup({

    idCliente: new FormControl(''),

    nomeCliente: new FormControl('', [
      Validators.required, Validators.minLength(8)
    ]),
    emailCliente: new FormControl('', [
      Validators.required, Validators.email
    ]),
    telefoneCliente: new FormControl('', [
      Validators.required, Validators.pattern(/^\d{11}$/)
    ])
  });


  get fCadastro() {
    return this.formCadastro.controls;
  }

  get fEdicao() {
    return this.formEdicao.controls;
  }


  ngOnInit(): void {
    this.httpClient.get(this.apiUrl + '/consultar')
      .subscribe({
        next: (data) => {
          this.clientes = data as any[];
        }
      })
  }
  cadastrarCliente(): void {
    this.httpClient.post(this.apiUrl + '/criar', this.formCadastro.value,
      { responseType: 'text' }
    )
      .subscribe({
        next: (data) => {
          this.formCadastro.reset();
          this.ngOnInit();
          alert(data);
        }

      })

  }
  excluirCliente(idCliente: string): void {
    if (confirm('Deseja realmente excluir o cliente selecionado?')) {

      this.httpClient.delete(this.apiUrl + "/excluir/" + idCliente, { responseType: 'text' })
        .subscribe({
          next: (data) => {
            this.ngOnInit();
            alert(data);

          }


        })

    }


  }

  obterCliente(c: any): void {
    this.formEdicao.controls['idCliente'].setValue(c.idCliente);
    this.formEdicao.controls['nomeCliente'].setValue(c.nomeCliente);
    this.formEdicao.controls['emailCliente'].setValue(c.emailCliente);
    this.formEdicao.controls['telefoneCliente'].setValue(c.telefoneCliente);

  }
  atualizarCliente(): void {

    this.httpClient.put(this.apiUrl + '/editar', this.formEdicao.value, { responseType: 'text' })
      .subscribe({

        next: (data) => {
          this.ngOnInit();
          alert(data);


        }
      });
  }
}
