


export const LoginStorage = (token,checked) => {
    if(checked){
        CookiesSession.set('token',token);
    }
}