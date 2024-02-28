exports.accesControler= async (role,userRole)=>{
    switch (role) {
        case "admin":
            if(userRole!==role){
                return false
            }
        return true
        case "employe":
            if(userRole==="employe"|| userRole==="admin"){
                return true
            }
        return false
    
        default:
            return false;
    }
}