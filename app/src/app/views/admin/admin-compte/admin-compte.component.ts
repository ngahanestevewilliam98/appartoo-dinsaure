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

  races: Array<string> = ['Callovosaurus', 'Brachylophosaurus', 'Brachyceratops'];
  anPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
  lastuser: Admin;
  user: Admin;

  constructor(public router: Router, @Inject(SESSION_STORAGE) private storage: StorageService) { }

  ngOnInit() {
    Loader.show();
    this.lastuser = this.storage.get(STORAGE_KEY) || undefined;
    this.user = this.lastuser;
    Loader.dismiss();
  }

  empty(e: string): boolean {
    if (e === undefined || e.length === 0) { return true; } else { return false; }
  }

  updateUser(): void {
    // tslint:disable-next-line: max-line-length
    if (!this.empty(this.user.email) && !this.empty('' + this.user.age) && !this.empty(this.user.nourriture)
      && !this.empty(this.anPassword) && !this.empty(this.newPassword) && !this.empty(this.newPasswordConfirm)) {
      if (Regex.isValideEmail(this.user.email)) {
        if (this.newPassword === this.newPasswordConfirm) {
          const bs = Md5.hashStr(this.anPassword);
          if (bs === this.lastuser.password) {
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
      this.user.password = newPassword;
      await axios.post(route, { user: this.user });
      this.lastuser = this.user;
      this.storage.set(STORAGE_KEY, this.user as Admin);
      Loader.dismiss();
      Alert.show('Mise à jour reussi');
    } catch (error) {
      Loader.dismiss();
      if (`${error}`.includes('404')) {
        Alert.show('Erreur. Compte inexistant');
      } else {
        console.log(error)
        Alert.show('Erreur de mise à jour');
      }
    }
  }

}
