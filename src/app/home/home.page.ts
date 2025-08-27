import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { Invertexto } from '../service/invertexto';
import { ESTADOS, MESES } from './dados.json';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption
  ]
})
export class HomePage implements OnInit {
  meses = MESES;
  estados = ESTADOS;
  anos: number[] = [];
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  selectedEstado: string = '';
  daysInMonth: number[] = [];
  firstDayOfWeek: number = 0;
  feriados: any[] = [];

  constructor(private invertexto: Invertexto, private alertCtrl: AlertController) {
    const anoAtual = new Date().getFullYear();
    for (let i = anoAtual - 5; i <= anoAtual + 5; i++) {
      this.anos.push(i);
    }
  }

  ngOnInit() {
    this.generateCalendar();
    this.loadFeriados();
  }

  onChangeFiltro() {
    this.generateCalendar();
    this.loadFeriados();
  }

  onChangeFiltroMonth() {
    this.generateCalendar();
  }

  generateCalendar() {
    const date = new Date(this.currentYear, this.currentMonth, 1);
    this.firstDayOfWeek = date.getDay();
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    this.daysInMonth = Array.from({ length: lastDay }, (_, i) => i + 1);
  }

  loadFeriados() {
    this.invertexto.getFeriados(this.currentYear, this.selectedEstado).subscribe({
        next: (res: any) => {
          console.log('Resposta da API Invertexto:', res);
          let feriadosArr = Array.isArray(res) ? res : (res.holidays || []);
          if (!feriadosArr || feriadosArr.length === 0) {
            console.warn('Nenhum feriado retornado para o filtro:', this.currentYear, this.selectedEstado);
          } else {
            console.log('Feriados recebidos:', feriadosArr);
          }
          this.feriados = [...feriadosArr];
        },
        error: (err) => {
          console.error('Erro na API Invertexto:', err);
          this.feriados = [];
        }
    });
  }

  isFeriado(day: number): boolean {
    const dia = day;
    const mes = this.currentMonth + 1;
    const ano = this.currentYear;
    const result = this.feriados.some((f: any) => {
      const [fAno, fMes, fDia] = f.date.split('-').map(Number);
      const match = fAno === ano && fMes === mes && fDia === dia;
      if (match) {
        const key = `${ano}-${mes}`;
        if (!(window as any)._feriadoLogs) {
          (window as any)._feriadoLogs = {};
        }
        const logs = (window as any)._feriadoLogs;
        logs[key] = logs[key] || new Set();
        if (!logs[key].has(f.date)) {
          console.log(`Feriado encontrado: ${f.date} para dia ${dia}/${mes}/${ano}`);
          logs[key].add(f.date);
        }
      }
      return match;
    });
    return result;
  }

  async abrirFeriado(day: number) {
    const dia = day;
    const mes = this.currentMonth + 1;
    const ano = this.currentYear;
    const feriado = this.feriados.find((f: any) => {
      const [fAno, fMes, fDia] = f.date.split('-').map(Number);
      return fAno === ano && fMes === mes && fDia === dia;
    });
    if (feriado) {
      const [anoF, mesF, diaF] = feriado.date.split('-');
      const dataFormatada = `${diaF}/${mesF}/${anoF}`;
      const alert = await this.alertCtrl.create({
        header: feriado.name,
        subHeader: `${feriado.type} - ${feriado.level}`,
        message: dataFormatada,
        buttons: ['Fechar']
      });
      await alert.present();
    }
  }
}