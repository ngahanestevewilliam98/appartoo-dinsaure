import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import axios from 'axios';
import { Server } from './../../../helpers/server';
import { Loader } from './../../../helpers/loader';
import { Article } from './../../../models/article';
import { ModalComponent } from './../../../helpers/modal';
import { Alert } from './../../../helpers/alert';
import { Admin } from './../../../models/admin';

const STORAGE_KEY = 'user';

@Component({
  selector: 'app-admin-amis',
  templateUrl: './admin-amis.component.html',
  styleUrls: ['./admin-amis.component.scss']
})
export class AdminAmisComponent implements OnInit {


  user: Admin;
  serverUrl = Server.baseUrl();
  dinProvisoires: Array<any>  = [];
  dinosaures: Array<any> = [];
  codeSelectedDino: number;

  constructor(public router: Router, @Inject(SESSION_STORAGE) private storage: StorageService) { }


  ngOnInit() {
    Loader.show();
    this.user = this.storage.get(STORAGE_KEY) || undefined;
    this.getAmis();
    Loader.dismiss();
  }

  async getAmis() {
    try {
      const route = `${Server.baseUrl()}/amis/list/${this.user.id_donosaure}`;
      const bc = await axios.get(route);
      this.dinProvisoires = bc.data.data;
      this.dinosaures = this.dinProvisoires;
    } catch (error) {
      Alert.show('Erreur de connexion au serveur');
    }
  }

  public searchDinosaure(term: string) {
    if (!term) {
      this.dinosaures = this.dinProvisoires;
    } else {
      this.dinosaures = this.dinProvisoires.filter(
        x => x.nom.trim().toLowerCase().includes(term.trim().toLowerCase())
      );
    }
  }

  openModal(idModal): void {
    ModalComponent.show(idModal);
  }

  closeModal(idModal: string): void {
    ModalComponent.dismiss(idModal);
  }

  async delAmitie(id: number) {
    Loader.show();
    try {
      const route = `${Server.baseUrl()}/amis/del/${id}`;
      const bc = await axios.get(route);
    } catch (error) {
      Loader.dismiss();
      Alert.show('Erreur');
    }
  }


  async addAmis() {
    Loader.show();
    try {
      const route = `${Server.baseUrl()}/amis/add`;
      const params = {
        id_din1: this.user.id_donosaure,
        code_din2: this.codeSelectedDino,
      };
      await axios.post(route, params);
      this.getAmis();
      Loader.dismiss();
      Alert.show('Ajout reussi');
    } catch (error) {
      Loader.dismiss();
      Alert.show('Erreur de l\'ajout');
    }
  }

}
