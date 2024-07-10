const createElement = domString => new DOMParser().parseFromString(domString, 'text/html').body.firstChild

function waitForElement(querySelector, timeout, typeElement){
    return new Promise((resolve, reject)=>{
      var timer = false;
      if(document.querySelectorAll(querySelector).length) return resolve();
      const observer = new MutationObserver((m)=>{
        console.log(m);
        if(document.querySelectorAll(querySelector).length){
          observer.disconnect();
          if(timer !== false) clearTimeout(timer);
          return resolve();
        }
      });
      observer.observe(document.body, {
        childList: true, 
        subtree: true
      });
      if(timeout) timer = setTimeout(()=>{
        observer.disconnect();
        reject();
      }, timeout);
    });
  }
  

const setLocalStorageItems = (key,items) => {
    let value = JSON.stringify(items)
    localStorage.setItem(key,value)
}

const deleteLocalStorageItems = (key) => {
    localStorage.removeItem(key)
}

class API_Firebase {
    constructor(firebase) {
        this.firebase = firebase
    }

    getUser() {
        //Get current user when they login
        const currentUser = this.firebase?.auth()?.currentUser
        if (currentUser) {
            return ({
                displayName: currentUser.displayName,
                email: currentUser.email,
                emailVerified: currentUser.emailVerified,
                photoURL:currentUser.photoURL,
                uid:currentUser.uid
            })
        } else return undefined
    }

    signOut() {
        //logout 
        this.firebase.auth().signOut()
    }

    async signIn() {
        //Google singin provider
        const ggProvider = new firebase.auth.GoogleAuthProvider();
        ggProvider.addScope('https://www.googleapis.com/auth/youtube.readonly');
         //Sing in with Google
        const signInResult = await this.firebase.auth().signInWithPopup(ggProvider)
        
        const token = signInResult.credential.accessToken;
        const user = signInResult.user;
        setLocalStorageItems("token", token);
        console.log(signInResult);
        return user;
    }
    currentTime() {
        var currentTime = new Date();
        var date = currentTime.toLocaleDateString();
        var time = currentTime.toLocaleTimeString();
        return ({
            date,
            time,
            timeFormat: `${time} - ${date}`
        })
    }
}