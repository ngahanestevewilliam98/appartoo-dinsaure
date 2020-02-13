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
  idrace: number;
  code: string;
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
    if (this.idrace !== undefined && !this.empty(this.code) && this.age !== undefined && !this.empty(this.password) && !this.empty(this.passwordC) && !this.empty(this.nourriture)) {
      if (Regex.isValideEmail(this.code)) {
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
        idrace: this.idrace,
        code: this.code,
        password: this.password,
        nourriture: this.nourriture,
        age: this.age
      };
      await axios.post(route, params);
      Loader.dismiss();
      Alert.show('Create de compte reussi reussi');
      this.router.navigate(['']);
    } catch (error) {
      Loader.dismiss();
      Alert.show('Erreur de create du compte');
    }
  }

}
