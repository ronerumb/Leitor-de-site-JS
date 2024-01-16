import { IFileGenerator } from "interface/file-generator.interface";
import { startPuppeteerService } from "service/start-puppeteer.service";

export class CrawlerCorinthiansController{
    constructor (){

    }
   
    public async init(){
        try{
            const page = await startPuppeteerService.start('https://www.corinthians.com.br/noticias');


            const selector = '.ct-news-list .ct-news-list-item';
            await page.waitForSelector(selector);

            const nodes = await page.$$(selector)
            const payload: Array<IFileGenerator > = [];

            for(const node of nodes){
                
                const link = await page.evaluate((el:Element) =>{
                    return el.querySelector('.ct-news-list-item-content a')?.getAttribute('href');
                },node)

                const title = await page.evaluate((el:Element) =>{
                    return el.querySelector('.ct-news-list-item-content a h4')?.innerHTML.replace(/\n/g, '')
                    .replace(/<p>.*?<\/p>/g, '')
                    .trim();
                },node)

                const date = await page.evaluate((el: Element) => {
                    return el
                      .querySelector('.ct-news-list-item-content a h4 p')
                      ?.innerHTML.replace(/\n/g, '')
                      .replace(/<strong>.*?<\/strong>/g, '')
                      .replace(/-/g, '')
                      .trim();
                  }, node);

                  if (!link || !title || !date)
                  throw new Error('Esses itens não são validos');
        
                payload.push({
                  link,
                  title,
                  date,
                });
              
            }
            console.log(payload);
            page.close();
        }catch(erro){
            console.log(erro);
        }

    }
}