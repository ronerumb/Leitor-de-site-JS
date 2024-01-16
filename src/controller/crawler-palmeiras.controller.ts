
import { IFileGenerator } from "interface/file-generator.interface";
import { startPuppeteerService } from "service/start-puppeteer.service";

export class CrawlerPalmeirasController{
    constructor (){

    }
   
    public async init(){
        try{

        
        const page = await startPuppeteerService.start('https://www.palmeiras.com.br/central-de-midia/noticias/');

        const selector = '.central-de-midia-container .items-central';
        await page.waitForSelector(selector);

        const nodes = await page.$$(selector);
        const payload: Array<IFileGenerator> = [];


        for (const node of nodes ){

            const link = await page.evaluate((el: Element) => {
                return el.querySelector('a')?.getAttribute('href')
            },node);
           

            const title = await page.evaluate((el: Element) => {
                return el.querySelector('a .items-central-txt h4')?.textContent;
            },node);

            const date = await page.evaluate((el:Element) =>{
                return el.querySelector('a .items-central-date')?.textContent;
            },node)

            if(!title || !link || !date) throw new Error('Deu ruim');

           payload.push({
            title,link,date});
        }
        console.log(payload);
        page.close();
      
        }catch(error){
            console.log(error);
        }
         
    }
}