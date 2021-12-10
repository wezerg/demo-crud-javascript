// Call
displayInvoice();
// Event
document.getElementById('formAdd').addEventListener('submit', function(e){
    addInvoices(e);
})
// Fonctions
async function addInvoices(e){
    e.preventDefault();
    const data = {
        nom : e.target.nom.value,
        montant : parseInt(e.target.montant.value)
    }
    const scheme = joi.object({
        nom : joi.string().required(),
        montant : joi.number().required()
    });
    const{value , error} =  scheme.validate(data , {abortEarly : false})
    if(error) return console.log(error.details);
    const requete = await fetch("http://localhost:3000/invoices" , {
        body: JSON.stringify(data),
        method: "POST",
        headers: {"Content-Type": "application/json"}
    });
    await displayInvoice();
}
async function getInvoices(){
    return await fetch('http://localhost:3000/invoices').then(response => response.json()).then(data => data);
}
async function deleteInvoices(elm){
    const requete = await fetch(`http://localhost:3000/invoices/${elm.value}` , {
        method: "DELETE",
        headers: {"Content-Type": "application/json"}
    });
    await displayInvoice();
}
async function displayInvoice(){
    const requete = await getInvoices();
    const div = document.getElementById('data-list');
    const total = document.getElementById('total');
    const depenses = document.getElementById('depenses');
    const recettes = document.getElementById('recettes');
    let dep = 0;
    let rec = 0;
    div.innerHTML = "";
    requete.forEach(elm => {
        div.innerHTML += `<div class="row align-items-center py-2 ${elm.id % 2 ? "bg-secondary text-light": "bg-light"}">
                            <form action="#" class="formList row">
                                <div class="col-3">
                                    <span>${elm.id}</span>
                                </div>
                                <div class="col-3">
                                    <input class="form-control" type="text" name="nom" id="" value="${elm.nom}">
                                </div>
                                <div class="col-3">
                                    <input class="form-control" type="text" name="montant" id="" value="${elm.montant}">
                                </div>
                                <div class="col-3">
                                    <button class="btn btn-warning" value="${elm.id}">Modifier</button>
                                </div>
                            </form>
                            <button class="btn btn-danger mt-2" value="${elm.id}" onclick="deleteInvoices(this)">Supprimer</button>
                        </div>`;
        if (elm.montant >= 0) {
            dep += elm.montant;
        }
        else{
            rec += elm.montant;
        }
    });
    const tabList = document.querySelectorAll('.formList');
    tabList.forEach(elm => {
        elm.addEventListener("submit", async function(e) {
            e.preventDefault();
            const data = {
                nom : e.target.nom.value,
                montant : parseInt(e.target.montant.value)
            }
            const scheme = joi.object({
                nom : joi.string().required(),
                montant : joi.number().required()
            });
            const{value , error} =  scheme.validate(data , {abortEarly : false})
            if(error) return console.log(error.details);
            const requete = await fetch(`http://localhost:3000/invoices/${e.target[2].value}` , {
                body: JSON.stringify(data),
                method: "PUT",
                headers: {"Content-Type": "application/json"}
            });
            await displayInvoice();
        });
    });
    depenses.innerHTML = dep;
    recettes.innerHTML = rec;
    total.innerHTML = dep + rec;
}