import {Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IConfig } from '../../models/config';
import * as saveAs from 'file-saver';
const jsonFile = `assets/config/config.json`;
const savejsonFile = `C://Users//config.json`;


@Injectable()
export class AppConfig {
    static settings: IConfig;
    //fs : any;
    constructor(private http: HttpClient) {
        this.load();
    }
    load() {
        return new Promise<void>((resolve, reject) => {
            this.http.get(jsonFile).toPromise().then((response : IConfig) => {
                AppConfig.settings = <IConfig>response;
               resolve();
            }).catch((response: any) => {
               reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
            });
        });
    }

    setValue(key, value) {
        AppConfig.settings[key] = 'hello'
        // const blob = new Blob([JSON.stringify(AppConfig.settings)], { type: 'text/plain' });
        // saveAs(blob, savejsonFile);
        //fs.writeFileSync(savejsonFile, JSON.stringify(AppConfig.settings)); 
        
    }
}