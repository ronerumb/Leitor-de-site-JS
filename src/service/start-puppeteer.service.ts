import { IFileGenerator } from "interface/file-generator.interface";
import puppeteer, { Page } from "puppeteer";
import fs from 'node:fs';
import path from 'node:path';

class StartPuppeteerService{

    constructor (){};
    public  start(url:string) : Promise<Page> {

        return new Promise ( async(resolve,reject) =>{

            const browser = await puppeteer.launch({ headless: false});
            const page = await browser.newPage();
            const allPages = await browser.pages();
            allPages[0].close();
            await page.goto(url);    
            if(!page) return  reject ('configuração não corresponde!');
            return resolve(page);

        });    
    }

    public fileGenerator(payload: Array<IFileGenerator> , fileName: string){
        const pathTmp = 'tmp';
        if(!fs.existsSync(path.resolve(pathTmp))){
            fs.mkdirSync(path.resolve(pathTmp));
            console.log('Pasta Criada com Sucesso');
        }
        const csvRowns = payload.map((res: IFileGenerator) => {
            return `${res.title};${res.link};${res.date}`;
        })

        const csvContent = `Titulo;Link;Data da postagem\n${csvRowns.join('\n')}`;
        try{
            fs.writeFileSync(`${path.resolve(pathTmp,fileName)}.csv`,csvContent);
            console.log("Foi");
        }catch(erro){
            console.log(erro);
        }
        
    }
   
}

export const startPuppeteerService = new StartPuppeteerService();