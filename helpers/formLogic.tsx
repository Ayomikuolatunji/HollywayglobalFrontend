import React, { FormEvent, useState } from "react"



interface inputInterface {
    firstname:string
    lastname:string
    email:string
    topic:string
}


const FormLogic=()=>{
    const [values,setValues]=useState<inputInterface>({
        firstname:"",
        lastname:"",
        email:"",
        topic:""
    })
     

    const handleChange=(event:React.FormEvent<HTMLInputElement>)=>{
        const {name, value} = event.currentTarget;
        setValues({...values, [name]:value})
    }

    const handleTextarea=(event:React.FormEvent<HTMLTextAreaElement>)=>{
        const {name, value} = event.currentTarget;
        setValues({...values, [name]:value})
    }
    return {
         values,
        handleChange,
        handleTextarea
    }
}


export default FormLogic