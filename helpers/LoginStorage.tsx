import CookiesSession from "./Cookies"


const LoginStorage = (token:string,checked:boolean) => {
    if(checked){
        CookiesSession.set(
            "token",
            token,
            {
            path:"/",
            maxAge:60*60*24*7, 
            sameSite:"strict",
            secure:true
        }
        );
    }
    CookiesSession.set(
        "token",
        token,
        {
          path:"/",
          secure:true,
          sameSite:"strict"
        }
    )
}

export default LoginStorage;