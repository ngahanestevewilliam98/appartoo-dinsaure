import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { Server } from './../../../helpers/server';
import { Regex } from './../../../helpers/regex';
import { Alert } from './../../../helpers/alert';
import { Loader } from './../../../helpers/loader';

@Component({
  selector: 'app-admin-recuvar',
  templateUrl: './admin-recuvar.component.html',
  styleUrls: ['./admin-recuvar.component.scss']
})
export class AdminRecuvarComponent implements OnInit {

  recuvarEmail: string;

  constructor() { }

  ngOnInit() {
    Loader.show();
    setTimeout(() => {
      Loader.dismiss();
    }, 1000);
  }

  empty(e: string): boolean {
    if (e === undefined || e.length === 0) { return true; } else { return false; }
  }

  submitRecuvar(): void {
    // tslint:disable-next-line: max-line-length
    if (!this.empty(this.recuvarEmail)) {
      if (Regex.isValideEmail(this.recuvarEmail)) {
        this.saveCommande();
      } else {
        Alert.show('Vérifier votre email');
      }
    } else {
      Alert.show('Veuillez remplir tous les champs');
    }
  }

  async saveCommande() {
    Loader.show();
    try {
      const params = new URLSearchParams();
      params.append('nom_complet', this.recuvarEmail);
      const route = `${Server.baseUrl()}/adminer/recuvar/${this.recuvarEmail}`;
      await axios.get(route);
      this.recuvarEmail = undefined;
      Alert.show('Votre nouveau mot de passse a été envoyé à votre adresse email');
    } catch (error) {
      Alert.show('Erreur');
    }
    Loader.dismiss();
  }

}
