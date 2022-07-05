import Cookies from 'universal-cookie';

const cookies = new Cookies();

class CookiesClass {

    get(key: string) {
        return cookies.get(key);
    }

    set(name:string,value:string,path:{}){
        cookies.set(name, value, path)
    }

    remove(name:string){
        cookies.remove(name)
    }
}


export default new CookiesClass();