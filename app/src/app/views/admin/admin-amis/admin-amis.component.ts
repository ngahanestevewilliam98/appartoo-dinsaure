import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import axios from 'axios';
import { Server } from './../../../helpers/server';
import { Loader } from './../../../helpers/loader';
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
  dinProvisoires: Array<any> = [];
  dinosaures: Array<any> = [];
  codeSelectedDino: number;

  newP: { email: string, race: string, age: number, nourriture: string, password: string, passwordC: string } = {
    email: undefined,
    race: undefined,
    age: undefined,
    nourriture: undefined,
    password: undefined,
    passwordC: undefined
  };

  races: Array<string> = ['Callovosaurus', 'Brachylophosaurus', 'Brachyceratops'];

  constructor(public router: Router, @Inject(SESSION_STORAGE) private storage: StorageService) { }


  ngOnInit() {
    Loader.show();
    this.user = this.storage.get(STORAGE_KEY) || undefined;
    this.getAmis();
    Loader.dismiss();
  }

  async getAmis() {
    try {
      const route = `${Server.baseUrl()}/amis/list/${this.user.email}`;
      const bc = await axios.get(route);
      this.dinProvisoires = bc.data.data;
      this.dinosaures = this.dinProvisoires;
      this.user.amis = JSON.stringify(bc.data.emailAmi);
      this.storage.set(STORAGE_KEY, this.user as Admin);
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

  openModal(idModal: string): void {
    ModalComponent.show(idModal);
  }

  closeModal(idModal: string): void {
    ModalComponent.dismiss(idModal);
  }

  async delAmitie(email: number) {
    Loader.show();
    try {
      const route = `${Server.baseUrl()}/amis/del`;
      const params = {
        emailAmi: email,
        user: this.user,
      };
      await axios.post(route, params);
      this.getAmis();
      Loader.dismiss();
      Alert.show('Ajout reussi');
    } catch (error) {
      Loader.dismiss();
      Alert.show('Erreur de requette');
    }
  }

  async addAmis() {
    Loader.show();
    try {
      const route = `${Server.baseUrl()}/amis/add`;
      const params = {
        emailAmi: this.codeSelectedDino,
        user: this.user,
      };
      await axios.post(route, params);
      this.codeSelectedDino = undefined;
      this.getAmis();
      Loader.dismiss();
      this.closeModal('addAmis');
      Alert.show('Ajout reussi');
    } catch (error) {
      Loader.dismiss();
      if (`${error}`.includes('404')) {
        Alert.show('Erreur de l\'ajout. Vous pouvez creer un dinosaure et faire de lui votre ami');
        ModalComponent.show('createDinosaure');
      } else {
        Alert.show('Erreur de requette');
        ModalComponent.dismiss('addAmis');
      }
    }
  }
  async createDinosaure() {
    ModalComponent.dismiss('addAmis');
    Loader.show();
    try {
      const route = `${Server.baseUrl()}/amis/createAndAddAmis`;
      const params = {
        race: this.newP.race,
        email: this.newP.email,
        password: this.newP.password,
        nourriture: this.newP.nourriture,
        age: this.newP.age,
        user1: this.user
      };
      const vv = await axios.post(route, params);
      console.log(vv);
      this.getAmis();
      Loader.dismiss();
      ModalComponent.dismiss('createDinosaure');
      Alert.show('Create de compte et ajout d\'ami reussi reussi');
    } catch (error) {
      Loader.dismiss();
      Alert.show('Erreur de create du compte');
    }
  }

}
