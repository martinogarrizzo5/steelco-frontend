/* 
    1) implementare la funzione con la chiamata di tipo GET al server per ottenere dati relativi gli infortuni.
    2) Eseguirla appena la pagina è stata caricata e mostrare uno spinner di caricamento 
    fino a quando i dati non sono stati ricevuti.
    3) Mostrare i dati sullo schermo
    4) Usare setInterval per ottenere i dati ogni 6 ore e aggiornare i dati visualizzati

    5) Adattare la dimensione del font in base al numero di elementi visualizzati e mostrarli 
    in una colonna centrata se meno di 6, in due colonne se di più.
*/
const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric"
}

document.querySelector(`#list`).innerHTML=`<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`
setInterval(fetchData(), 21600000)
clearData()


function fetchData() {
    fetch("http://localhost:5000/api/report")
    .then(res => {return res.json()})
    .then(data => {
        data.forEach(factory => {

            const date1 = new Date()    
            const date2 = new Date(factory.lastInjuryDate)
            const time = date1.getTime() - date2.getTime()
            let days = "nessuno"
            if(factory.lastInjuryDate != null){
                days = Math.ceil(time / (1000 * 60 * 60 * 24)) 
            }
            let markUp = null
            if(days < 2) {
                markUp = `
                <div class="content__row">
                <h2 class="content__row__stabilimento">${factory.address + " (" + factory.name + ") : "}</h2>
                <span class="count">${days}</span>
                <i class="fa-regular fa-circle-xmark icon icon--XMark"></i>
                </div>
                `;  
            }
            else{
                markUp = `
                <div class="content__row">
                <h2 class="content__row__stabilimento">${factory.address + " (" + factory.name + ") : "}</h2>
                <span class="count">${days}</span>
                <i class="fa-regular fa-circle-check icon icon--Check"></i>
                </div>
                `;  
            }
            
            document.querySelector(`#list`).insertAdjacentHTML(`beforeend`, markUp)
        })
        document.querySelector(`#update`).innerText="Dati aggiornati a : " + new Date().toLocaleDateString("IT-IT", options)
    })
    .catch(error => {console.log(error)})
}

function clearData(){
    document.querySelector(`#list`).innerText=""
}

