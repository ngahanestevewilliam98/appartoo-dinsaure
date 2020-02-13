import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { Server } from './../../../helpers/server';
import { Loader } from './../../../helpers/loader';
import { Article } from './../../../models/article';
import { ModalComponent } from './../../../helpers/modal';
import { Alert } from './../../../helpers/alert';

@Component({
  selector: 'app-admin-stocks',
  templateUrl: './admin-stocks.component.html',
  styleUrls: ['./admin-stocks.component.scss']
})
export class AdminStocksComponent implements OnInit {

  serverUrl = Server.baseUrl();
  artiProvisoires: Array<Article>;
  articles: Array<Article> = [];
  focusArticle: any;
  thisAddArticle: any = {
    id_sous_categorie: undefined,
    nom: undefined,
    description: undefined,
    prix: undefined,
    statut: undefined
  };
  categories: any;
  listCategories: Array<{ id: number, nom: string }>;
  listSubCategories: Array<{ id: number, nom: string, idCategorie: number }>;
  listSelectSubCategories: Array<{ id: number, nom: string, idCategorie: number }>;

  constructor(public router: Router) { }

  ngOnInit() {
    Loader.show();
    this.getArticles();
    this.getCategories();
    Loader.dismiss();
  }

  async getArticles() {
    const route = `${Server.baseUrl()}/article/getAllI`;
    try {
      const bc = await axios.get(route);
      this.artiProvisoires = bc.data.data as Array<Article>;
      this.articles = this.artiProvisoires;
    } catch (error) {
      console.error(error);
    }
  }

  async getCategories() {
    const route = `${Server.baseUrl()}/sousCategorie/getAllGroup/1`;
    try {
      const bc = await axios.get(route);
      this.categories = bc.data.data;
      // tslint:disable-next-line: prefer-const
      let listCategoriesP = [];
      // tslint:disable-next-line: prefer-const
      let listSubCategoriesP = [];
      this.categories.forEach(element => {
        listCategoriesP.push({
          id: element.sousCategorie[0].id_categorie,
          nom: element.nom_categorie
        });
        element.sousCategorie.forEach(item => {
          listSubCategoriesP.push({
            id: item.id_sous_categorie,
            nom: item.nom,
            idCategorie: item.id_categorie
          });
        });
      });
      this.listCategories = listCategoriesP;
      this.listSubCategories = listSubCategoriesP;
    } catch (error) {
      console.error(error);
    }
  }

  public searchArticle(term: string) {
    if (!term) {
      this.articles = this.artiProvisoires;
    } else {
      this.articles = this.artiProvisoires.filter(
        x => x.nom.trim().toLowerCase().includes(term.trim().toLowerCase())
      );
    }
  }

  openModal(idModal: string, item: Article): void {
    this.detailsArticle(item);
    ModalComponent.show(idModal);
  }

  openModalAdd(idModal: string): void {
    ModalComponent.show(idModal);
  }

  detailsArticle(item: Article): void {
    this.focusArticle = item;
    const found = this.listSubCategories.find((element) => {
      return element.id === this.focusArticle.id_sous_categorie;
    });
    if (found !== undefined) {
      this.focusArticle.id_categorie = found.idCategorie;
    }
  }

  closeModal(idModal: string): void {
    ModalComponent.dismiss(idModal);
  }

  empty(e: string): boolean {
    if (e === undefined || e.length === 0) { return true; } else { return false; }
  }

  async addArticle() {
    const imageCreate = document.getElementById('imageCreate') as any;
    // tslint:disable-next-line: max-line-length
    if (imageCreate.length !== 0 && this.thisAddArticle.prix !== undefined && this.thisAddArticle.statut !== undefined && this.thisAddArticle.id_sous_categorie !== undefined && !this.empty(this.thisAddArticle.nom) && !this.empty(this.thisAddArticle.description)) {
      Loader.show();
      try {
        const params = new FormData();
        params.append('id_sous_categorie', '' + this.thisAddArticle.id_sous_categorie);
        params.append('nom', this.thisAddArticle.nom);
        params.append('description', this.thisAddArticle.description);
        params.append('prix', this.thisAddArticle.prix);
        params.append('statut', this.thisAddArticle.statut);
        params.append('attachementFile', imageCreate.files[0]);
        const route = `${Server.baseUrl()}/article/add`;
        await axios({
          method: 'post',
          url: route,
          data: params,
          headers: {'Content-Type': 'multipart/form-data'}
        });
        // await axios.post(route, params);
        this.closeModal('addArticle');
        this.getArticles();
        Loader.dismiss();
        Alert.show('Succès de l\'ajout de l\'article');
      } catch (error) {
        console.error(error);
        Loader.dismiss();
        Alert.show('Erreur de l\'ajout de l\'article');
      }
    } else {
      Alert.show('Veuillez remplir tous les champs');
    }
  }

  async editerArticle() {
    // tslint:disable-next-line: max-line-length
    if (this.focusArticle.id_article !== undefined && this.focusArticle.id_sous_categorie !== undefined && this.focusArticle.prix !== undefined
      && this.focusArticle.statut !== undefined && !this.empty(this.focusArticle.nom) && !this.empty(this.focusArticle.description)) {
      Loader.show();
      try {
        const params = new URLSearchParams();
        params.append('id_article', '' + this.focusArticle.id_article);
        params.append('id_sous_categorie', '' + this.focusArticle.id_sous_categorie);
        params.append('nom', this.focusArticle.nom);
        params.append('description', this.focusArticle.description);
        params.append('prix', this.focusArticle.prix);
        params.append('statut', this.focusArticle.statut);
        const route = `${Server.baseUrl()}/article/set`;
        await axios.post(route, params);
        this.closeModal('detailArticle');
        this.getArticles();
        Loader.dismiss();
        Alert.show('Succès de modification de l\'article');
      } catch (error) {
        console.error(error);
        Loader.dismiss();
        Alert.show('Erreur de modification de l\'article');
      }
    } else {
      Alert.show('Veuillez remplir tous les champs');
    }

  }

  loadSousCat(): void {
    // tslint:disable-next-line: triple-equals
    this.listSelectSubCategories = this.listSubCategories.filter(element => this.focusArticle.id_categorie == element.idCategorie);
  }

  loadSousCater(): void {
    // tslint:disable-next-line: triple-equals
    this.listSelectSubCategories = this.listSubCategories.filter(element => this.thisAddArticle.id_categorie == element.idCategorie);
  }

}
