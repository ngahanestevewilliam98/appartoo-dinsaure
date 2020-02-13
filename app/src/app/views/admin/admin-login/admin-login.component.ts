import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import axios from 'axios';
import { Server } from './../../../helpers/server';
import { Alert } from './../../../helpers/alert';
import { Loader } from './../../../helpers/loader';
import { Admin } from './../../../models/admin';
import { Regex } from './../../../helpers/regex';

const STORAGE_KEY = 'user';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {

  loginEmail: string;
  loginPassword: string;

  constructor(public router: Router, @Inject(SESSION_STORAGE) private storage: StorageService) { }

  ngOnInit() {
    Loader.show();
    setTimeout(() => {
      Loader.dismiss();
    }, 1000);
  }

  empty(e: string): boolean {
    if (e === undefined || e.length === 0) { return true; } else { return false; }
  }

  submitLogin(): void {
    // tslint:disable-next-line: max-line-length
    if (!this.empty(this.loginEmail) && !this.empty(this.loginPassword)) {
      if (Regex.isValideEmail(this.loginEmail)) {
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
      const route = `${Server.baseUrl()}/dinosaure/connect/${this.loginEmail}/${this.loginPassword}`;
      const bc = await axios.get(route);
      this.storage.set(STORAGE_KEY, bc.data.data as Admin);
      this.loginEmail = undefined;
      this.loginPassword = undefined;
      Loader.dismiss();
      Alert.show('Connexion reussi');
      this.router.navigate(['/admin/compte']);
    } catch (error) {
      Loader.dismiss();
      Alert.show('Erreur de connexion');
    }
  }

}
