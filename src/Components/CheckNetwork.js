const connectNetwork = () =>{
    let condition = navigator.onLine ? 'online' : 'offline';
    if (condition === 'online') {
        fetch('https://www.google.com/', { // Check for internet connectivity
            mode: 'no-cors',
            })
        .then(() => {
            return true;
        }).catch(() => {
           return false;
        }  )

    }else{
       return false;
    }
}

export default connectNetwork;