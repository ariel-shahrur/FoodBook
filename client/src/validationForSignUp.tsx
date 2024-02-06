const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const minLength = 8;
  const maxLength = 30;
  const hasUppercase = /[A-Z]/;
  const hasLowercase = /[a-z]/;
  const hasNumber = /[0-9]/;
  const hasSpecialChar = /[!@#$%^&*()_+[\]{};':"\\|,.<>?]/;



export const singUpValidationHandler = (inputName:string,inputValue:string,password:string) => {
    if(inputName==="username" && inputValue.length<8){
        return true 
      }
      else if(inputName==="email" && !(emailRegex.test(inputValue))){
        return true;
      }
      else if(inputName==="password"){
        if (inputValue.length < minLength || inputValue.length > maxLength) {
            return true;
          }
        
          if (!hasUppercase.test(inputValue)) {
            return true;
          }
        
          if (!hasLowercase.test(inputValue)) {
            return true;
          }
        
          if (!hasNumber.test(inputValue)) {
            return true;
          }
        
          if (!hasSpecialChar.test(inputValue)) {
            return true;
          }
          
          return false;
      }
      else if(inputName==="confirmPassword"){
        if(inputValue!==password)
        return true;
      }
      
      else{
        return false
        }
  };

