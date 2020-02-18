import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import axios from 'axios';
import { Server } from './../../../helpers/server';
import { Alert } from './../../../helpers/alert';
import { Loader } from './../../../helpers/loader';
import { Regex } from './../../../helpers/regex';

@Component({
  selector: 'app-admin-create',
  templateUrl: './admin-create.component.html',
  styleUrls: ['./admin-create.component.scss']
})
export class AdminCreateComponent implements OnInit {

  races: Array<string> = ['Callovosaurus', 'Brachylophosaurus', 'Brachyceratops'];
  race: string;
  email: string;
  password: string;
  passwordC: string;
  nourriture: string;
  age: number;

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
    if (!this.empty(this.race) && !this.empty(this.email) && this.age !== undefined && !this.empty(this.password) && !this.empty(this.passwordC) && !this.empty(this.nourriture)) {
      if (Regex.isValideEmail(this.email)) {
        if (this.password !== this.passwordC) {
          Alert.show('Erreur. Les 2 mots de passe sont différents');
        } else {
          this.saveCommande();
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
      const route = `${Server.baseUrl()}/dinosaure/add`;
      const params = {
        race: this.race,
        code: this.email,
        password: this.password,
        nourriture: this.nourriture,
        age: this.age
      };
      const vv = await axios.post(route, params);
      console.log(vv);
      Loader.dismiss();
      Alert.show('Creation de compte reussi reussi');
      this.router.navigate(['']);
    } catch (error) {
      Loader.dismiss();
      if (`${error}`.includes('404')) {
        Alert.show('Erreur. Compte deja existant');
      } else if (`${error}`.includes('0')) {
        Alert.show('Erreur. Verifier votre connexion internet');
      } else {
        Alert.show('Erreur de create du compte');
      }
    }
  }

}
