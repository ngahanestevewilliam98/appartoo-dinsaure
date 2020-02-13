import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import axios from 'axios';
import { Md5 } from 'ts-md5/dist/md5';
import { Server } from './../../../helpers/server';
import { Regex } from './../../../helpers/regex';
import { Alert } from './../../../helpers/alert';
import { Loader } from './../../../helpers/loader';
import { Admin } from './../../../models/admin';

const STORAGE_KEY = 'user';

@Component({
  selector: 'app-admin-compte',
  templateUrl: './admin-compte.component.html',
  styleUrls: ['./admin-compte.component.scss']
})
export class AdminCompteComponent implements OnInit {

  race: Array<{ id: number, nom: string }> = [{
    id: 1,
    nom: 'Callovosaurus'
  }, {
    id: 2,
    nom: 'Brachylophosaurus'
  }, {
    id: 3,
    nom: 'Brachyceratops'
  }];
  newPassword: string;
  anPassword: string;
  newPasswordConfirm: string;
  user: Admin;

  constructor(public router: Router, @Inject(SESSION_STORAGE) private storage: StorageService) { }

  ngOnInit() {
    Loader.show();
    this.user = this.storage.get(STORAGE_KEY) || undefined;
    Loader.dismiss();
  }

  empty(e: string): boolean {
    if (e === undefined || e.length === 0) { return true; } else { return false; }
  }

  updateUser(): void {
    // tslint:disable-next-line: max-line-length
    if (!this.empty(this.user.code) && !this.empty(this.user.password)
      && !this.empty('' + this.user.age) && !this.empty(this.user.nourriture)
      && !this.empty(this.anPassword) && !this.empty(this.newPassword) && !this.empty(this.newPasswordConfirm)) {
      if (Regex.isValideEmail(this.user.code)) {
        if (this.newPassword === this.newPasswordConfirm) {
          const bs = Md5.hashStr(this.anPassword);
          if (bs === this.user.password) {
            this.saveCommande();
          } else {
            Alert.show('Votre ancien mot de passe est erroné');
          }
        } else {
          Alert.show('Les 2 mots de passes entrés sont différents');
        }
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
      const newPassword = Md5.hashStr(this.newPassword) as string;
      const route = `${Server.baseUrl()}/dinosaure/set`;
      const params = {
        id: this.user.id_donosaure,
        code: this.user.code,
        password: newPassword,
        age: this.user.age,
        idrace: this.user.id_race,
        nourriture: this.user.nourriture,
      };
      await axios.post(route, params);
      await axios.post(route, params);
      this.user.password = newPassword;
      this.storage.set(STORAGE_KEY, this.user as Admin);
      Loader.dismiss();
      Alert.show('Mise à jour reussi');
    } catch (error) {
      Loader.dismiss();
      Alert.show('Erreur de mise à jour');
    }
  }

}
