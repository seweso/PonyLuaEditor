storage = (()=>{
   
    


    function setStorage(data){
        localStorage.setItem('general', JSON.stringify(data));
    }

    function getStorage(){
        try {
            let parse = JSON.parse( localStorage.getItem('general') )
            return parse
        } catch (e){
            return null
        }
    }

    

    return {
        setStorage: setStorage,
        getStorage: getStorage
    } 
})()